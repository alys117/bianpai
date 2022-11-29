var apiConfig = {
  'mock': true,
  'canshu': {
    url: "../mock/xxx.json",
    callback: function(res) {
      console.log(res)
      window.canshu = res.data
      window.canshu.netElementList = []
      window.canshu.supplierList = []
      window.canshu.serviceList.forEach(function(item){
        item.netElementList.forEach(function(item2){
          item2.serviceCode = item.serviceCode
          item2.supplierList.forEach(function(item3){
            item3.netElementCode = item2.netElementCode
            item3.serviceCode = item.serviceCode
          })
          window.canshu.supplierList.push(...item2.supplierList)
        })
        window.canshu.netElementList.push(...item.netElementList)
      })
      $(".bp_zl_cs").html('')
      $.each(res.data.paramList, function(index, item) {
        $(".bp_zl_cs").append("<span data-id='"+item.paramId+"' onclick=\"canshuInit()\">$(" + item.paramName + ")</span>\n")
      })

      $(".busi").html('<option value="all">全部业务</option>\n')
      $.each(res.data.serviceList, function(index, item) {
        $(".busi").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
      })
      
      $(".wangyuan").html('<option value="all">全部网元</option>\n')
      $.each(res.data.netElementList, function(index, item) {
        // $(".wangyuan").append("<option value="+item.id+">" + item.name + "</option>\n")
      })
    }
  },
  "modify": {
    url: "/modify",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#modifyModelName').html('【'+$('#canshuId').html()+'】')
        $('#myModal6').modal('toggle');
        bpq.style.display='none';
        fzcj.style.display='none'
      }
    }
  },
  "create": {
    url: "/create",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#newModelName').html('【$('+$('#_new_name').val()+')】')
        $('#myModal5').modal('toggle');
        bpq.style.display='none';
        fzcj.style.display='none'
      }
    }
  }
}

function changeBusi(busiClassName, wangyuanClassName, vendorClassName) {
  var busi = $("."+busiClassName).val()
  $("."+wangyuanClassName).html('<option value="all">全部网元</option>\n')
  $("."+vendorClassName).html('<option value="all">全部厂家</option>\n')
  if(busi === 'all') {
    if(busiClassName === 'busi'){
      filterCanshu(window.canshu.paramList)
    }
  }else{
    var wangyuanList = window.canshu.netElementList.filter(function(item){
      return item.serviceCode == busi
    })
    $.each(wangyuanList, function(index, item) {
      $("."+wangyuanClassName).append("<option value="+item.netElementCode+">" + item.netElementName + "</option>\n")
    })
    if(busiClassName === 'busi'){
      var canshuList = window.canshu.paramList.filter(function(item){
        return item.serviceCode == busi
      })
      if(busiClassName === 'busi') filterCanshu(canshuList)
    }
  }
}
function changeWangyuan(busiClassName, wangyuanClassName, vendorClassName) {
  var busi = $("."+busiClassName).val()
  var wangyuan = $("."+wangyuanClassName).val()
  if(busiClassName === 'busi') {
    var canshuList = window.canshu.paramList.filter(function(item){
      if(wangyuan === 'all'){
        return item.serviceCode == busi
      }else{
        return item.serviceCode == busi && item.netElementCode == wangyuan
      }
    })
    filterCanshu(canshuList)
  }else if(busiClassName === 'busi2' || busiClassName === 'busi3'){
    $("."+vendorClassName).html('<option value="all">全部厂家</option>\n')
    var vendorList = window.canshu.supplierList.filter(function(item){
      return item.serviceCode == busi && item.netElementCode == wangyuan
    })
    $.each(vendorList, function(index, item) {
      $("."+vendorClassName).append("<option value="+item.supplierCode+">" + item.supplierName + "</option>\n")
    })
  }
}
function filterCanshu(list) { 
  $(".bp_zl_cs").html('')
  $.each(list, function(index, item) {
    $(".bp_zl_cs").append("<span data-id='"+item.paramId+"' onclick=\"canshuInit()\">$(" + item.paramName + ")</span>\n")
  })
}

function canshuInit(id){
  // console.log(`canshuInit(${id})`, event);
  var canshuId = id || event.target.dataset.id
  if(!canshuId) return
  bpq.style.display='block';
  var canshu = window.canshu.paramList.find(function(item){
    return item.paramId === canshuId
  })
  $('#bpq #canshuId').html('$(' + canshu.paramName + ')') 
  $('#bpq #canshuId').attr('data-id',canshu.paramId);
  $('#bpq #bpqBusi').html('<select id="_busiId" class="form-control input-sm busi2" style="width: 200px;" onchange=changeBusi(\'busi2\',\'wangyuan2\',\'vendor2\')><option value="all">全部业务</option></select>')
  window.canshu.serviceList.forEach(function(item){
    if(item.serviceCode === canshu.serviceCode){
      $('#bpq #_busiId').append('<option value="'+item.serviceCode+'" selected>'+item.serviceName+'</option>')
    }else{
      $('#bpq #_busiId').append('<option value="'+item.serviceCode+'" >'+item.serviceName+'</option>')
    }
  })
  $('#bpq #bpqWangyuan').html('<select id="_wangyuanId" class="form-control input-sm wangyuan2" style="width: 200px;" onchange=changeWangyuan(\'busi2\',\'wangyuan2\',\'vendor2\')><option value="all">全部网元</option></select>')
  window.canshu.netElementList.forEach(function(item){
    if(item.netElementCode === canshu.netElementCode && item.serviceCode === canshu.serviceCode){
      $('#bpq #_wangyuanId').append('<option value="'+item.netElementCode+'" selected>'+item.netElementName+'</option>')
    }else if(item.serviceCode === canshu.serviceCode){
      $('#bpq #_wangyuanId').append('<option value="'+item.netElementCode+'" >'+item.netElementName+'</option>')
    }
  })
  $('#bpq #bpqVendor').html('<select id="_vendorId" class="form-control input-sm vendor2" style="width: 200px;"><option value="all">全部厂商</option></select>')
  window.canshu.supplierList.forEach(function(item){
    if(item.netElementCode === canshu.netElementCode && item.serviceCode === canshu.serviceCode && item.supplierCode === canshu.supplierCode){
      $('#bpq #_vendorId').append('<option value="'+item.supplierCode+'" selected>'+item.supplierName+'</option>')
    }else if(item.netElementCode === canshu.netElementCode && item.serviceCode === canshu.serviceCode){
      $('#bpq #_vendorId').append('<option value="'+item.supplierCode+'" >'+item.supplierName+'</option>')
    }
  })
  $('#bpq #bpqVersion').html('<input id="_version" class="form-control input-sm" style="width: 200px;" placeholder="如：e164AF" value="'+canshu.paramVersion+'">')
  $('#bpq #bpqRule').html('<select id="_rule" class="form-control input-sm" style="width: 200px;"><option value="all">全部规则</option></select>')
  window.canshu.ruleList.forEach(function(item){
    if(item.ruleId === canshu.ruleId){
      $('#bpq #_rule').append('<option value="'+item.ruleId+'" selected>'+item.ruleName+'</option>')
    }else {
      $('#bpq #_rule').append('<option value="'+item.ruleId+'" >'+item.ruleName+'</option>')
    }
  })
}

function modify(){
  var paramId = $('#canshuId').data("id")
  var serviceCode = $('#_busiId').val()
  var netElementCode = $('#_wangyuanId').val()
  var supplierCode = $('#_vendorId').val()
  var paramVersion = $('#_version').val()
  var ruleId = $('#_rule').val()
  if(serviceCode === 'all'){alert('请选择业务');return}
  if(netElementCode === 'all'){alert('请选择网元');return}
  if(supplierCode === 'all'){alert('请选择厂商');return}
  if(ruleId === 'all'){alert('请选择规则');return}
  if(paramVersion === ''){alert('请填写版本');return}
  var obj ={paramId, serviceCode, netElementCode, supplierCode, paramVersion, ruleId}
  console.log(obj);
  postData(apiConfig['modify'],obj,function(res){
      apiConfig['modify'].callback(res)
    }, function(){
      if(apiConfig.mock){
        apiConfig['modify'].callback({
          code: 200,
          mock: true,
          msg: 'success'
        })
      }else{
        console.log('canshu: ajax请求失败');
      }
    })
}
function create(){
  var paramName = $('#_new_name').val()
  var serviceCode = $('#_new_busi').val()
  var netElementCode = $('#_new_wangyuan').val()
  var supplierCode = $('#_new_vendor').val()
  var paramVersion = $('#_new_version').val()
  var ruleId = $('#_new_rule').val()
  var obj ={paramName, serviceCode,netElementCode, supplierCode, paramVersion, ruleId}
  console.log(obj);
  if(paramName === ''){alert('请填写名称');return}
  if(serviceCode === 'all'){alert('请选择业务');return}
  if(netElementCode === 'all'){alert('请选择网元');return}
  if(supplierCode === 'all'){alert('请选择厂商');return}
  if(ruleId === 'all'){alert('请选择规则');return}
  if(paramVersion === ''){alert('请填写版本');return}
  postData(apiConfig['create'],obj,function(res){
      apiConfig['create'].callback(res)
    }, function(){
      if(apiConfig.mock){
        apiConfig['create'].callback({
          code: 200,
          mock: true,
          msg: 'success'
        })
      }else{
        console.log('canshu: ajax请求失败');
      }
    })
}
function initNew(){
  resetNew()
  $(".busi3").html('<option value="all">全部业务</option>\n')
  $.each(window.canshu.serviceList, function(index, item) {
    $(".busi3").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
  })
  $("#_new_rule").html('<option value="all">全部规则</option>\n')
  $.each(window.canshu.ruleList, function(index, item) {
    $("#_new_rule").append("<option value="+item.ruleId+">" + item.ruleName + "</option>\n")
  })
}

function reload(){
  ajaxData(apiConfig['canshu'].url, {}, function(res){
    apiConfig['canshu'].callback(res)
  }, function(){
    console.log('canshu: ajax请求失败');
  })
}

function reset(){
  var id = $('#canshuId').data("id")
  canshuInit(id)
  resetNew()
}

function resetNew(){
  $('#_new_name').val('')
  $('#_new_busi').val('all')
  $('#_new_wangyuan').html('<option value="all">全部网元</option>\n')
  $('#_new_wangyuan').val('all')
  $('#_new_vendor').html('<option value="all">全部厂商</option>\n')
  $('#_new_version').val('')
  $('#_new_rule').html('<option value="all">全部规则</option>\n')
}

function ajaxData(url, params, callback, failCallback) {
  $.ajax({
    url: url,
    data: params,
    type:"get",
    dataType: "json",
    success: function(res, textStatus, jqXHR){
        callback(res)
    },
    error: function(XMLHttpRequest, textStatus, errorThrown){
        console.log(errorThrown)
        failCallback()
    }
  })
}

function postData(url, data, callback, failCallback) {
  $.ajax({
    url:url,
    contentType: "application/json",
    type:"POST",
    dataType:"json",
    data:JSON.stringify(data),
    success: function(res, textStatus, jqXHR){
        callback(res)
    },
    error: function(XMLHttpRequest, textStatus, errorThrown){
        console.log(errorThrown)
        failCallback()
    }
  })
}
ajaxData(apiConfig['canshu'].url, {}, function(res){
  apiConfig['canshu'].callback(res)
}, function(){
  console.log('canshu: ajax请求失败');
})