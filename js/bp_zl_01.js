var apiConfig = {
  'mock': true,
  'canshu': {
    url: "../mock/xxx.json",
    callback: function(res) {
      console.log(res)
      window.canshu = res.data
      $(".bp_zl_cs").html('')
      $.each(res.data.canshuList, function(index, item) {
        $(".bp_zl_cs").append("<span data-id='"+item.id+"' onclick=\"bpq.style.display='block';canshuInit(event)\">$(" + item.name + ")</span>\n")
      })

      $(".busi").html('<option value="all">全部业务</option>\n')
      $.each(res.data.busiList, function(index, item) {
        $(".busi").append("<option value="+item.id+">" + item.name + "</option>\n")
      })
      
      $(".wangyuan").html('<option value="all">全部网元</option>\n')
      $.each(res.data.wangyuanList, function(index, item) {
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

function changeBusi(busiClassName, wangyuanClassName) {
  var busi = $("."+busiClassName).val()
  $("."+wangyuanClassName).html('<option value="all">全部网元</option>\n')
  if(busi === 'all') {
    if(busiClassName === 'busi'){
      filterCanshu(window.canshu.canshuList)
    }
  }else{
    var wangyuanList = window.canshu.wangyuanList.filter(function(item){
      return item.busiId == busi
    })
    $.each(wangyuanList, function(index, item) {
      $("."+wangyuanClassName).append("<option value="+item.id+">" + item.name + "</option>\n")
    })
    if(busiClassName === 'busi'){
      var canshuList = window.canshu.canshuList.filter(function(item){
        return item.busiId == busi
      })
      if(busiClassName === 'busi') filterCanshu(canshuList)
    }
  }
}
function changeWangyuan(busiClassName, wangyuanClassName) {
  var busi = $("."+busiClassName).val()
  var wangyuan = $("."+wangyuanClassName).val()
  if(busiClassName === 'busi') {
    var canshuList = window.canshu.canshuList.filter(function(item){
      if(wangyuan === 'all'){
        return item.busiId == busi
      }else{
        return item.busiId == busi && item.wangyuanId == wangyuan
      }
    })
    filterCanshu(canshuList)
  }
}
function filterCanshu(canshuList) { 
  $(".bp_zl_cs").html('')
  $.each(canshuList, function(index, item) {
    $(".bp_zl_cs").append("<span data-id='"+item.id+"' onclick=\"bpq.style.display='block';canshuInit(event)\">$(" + item.name + ")</span>\n")
  })
}

function canshuInit(){
  var canshu = window.canshu.canshuList.find(function(item){
    return item.id === event.target.dataset.id
  })
  var wangyuanList = window.canshu.wangyuanList.find(function(item){
    return item.id === canshu.busiId
  })
  $('#bpq #canshuId').html('$(' + canshu.name + ')') 
  $('#bpq #canshuId').attr('data-id',canshu.id);
  $('#bpq #bpqBusi').html('<select id="_busiId" class="form-control input-sm busi2" style="width: 200px;" onchange=changeBusi(\'busi2\',\'wangyuan2\')><option value="all">全部业务</option></select>')
  window.canshu.busiList.forEach(function(item){
    if(item.id === canshu.busiId){
      $('#bpq #_busiId').append('<option value="'+item.id+'" selected>'+item.name+'</option>')
    }else{
      $('#bpq #_busiId').append('<option value="'+item.id+'" >'+item.name+'</option>')
    }
  })
  $('#bpq #bpqWangyuan').html('<select id="_wangyuanId" class="form-control input-sm wangyuan2" style="width: 200px;"><option value="all">全部网元</option></select>')
  window.canshu.wangyuanList.forEach(function(item){
    if(item.id === canshu.wangyuanId && item.busiId === canshu.busiId){
      $('#bpq #_wangyuanId').append('<option value="'+item.id+'" selected>'+item.name+'</option>')
    }else if(item.busiId === canshu.busiId){
      $('#bpq #_wangyuanId').append('<option value="'+item.id+'" >'+item.name+'</option>')
    }
  })
  $('#bpq #bpqVendor').html('<input id="_vendor" class="form-control input-sm" style="width: 200px;" placeholder="如：e164AF" value="'+canshu.vendor+'">')
  $('#bpq #bpqVersion').html('<input id="_version" class="form-control input-sm" style="width: 200px;" placeholder="如：e164AF" value="'+canshu.version+'">')
  $('#bpq #bpqRule').html('<input id="_rule" class="form-control input-sm" style="width: 200px;" placeholder="如：e164AF" value="'+canshu.rule+'">')
}

function modify(){
  var id = $('#canshuId').data("id")
  var busiId = $('#_busiId').val()
  var wangyuanId = $('#_wangyuanId').val()
  var vendor = $('#_vendor').val()
  var version = $('#_version').val()
  var rule = $('#_rule').val()
  var obj ={id, busiId, wangyuanId, vendor, version, rule}
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
  var name = $('#_new_name').val()
  var busiId = $('#_new_busi').val()
  var wangyuanId = $('#_new_wangyuan').val()
  var vendor = $('#_new_vendor').val()
  var version = $('#_new_version').val()
  var rule = $('#_new_rule').val()
  var obj ={name, busiId,wangyuanId, vendor, version, rule}
  console.log(obj);
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
  $(".busi3").html('<option value="all">全部业务</option>\n')
  $.each(window.canshu.busiList, function(index, item) {
    $(".busi3").append("<option value="+item.id+">" + item.name + "</option>\n")
  })
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