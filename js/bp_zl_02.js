var apiConfig = {
  'mock': true,
  'canshu': {
    url: "../mock/xxx.json",
    callback: function(res) {
      console.log(res)
      window.canshu = res.data
      $(".canshu").html('')
      $.each(res.data.canshuList, function(index, item) {
        $(".canshu").append("<span data-id='"+item.id+"' onclick=\"todo1()\">$(" + item.name + ")</span>\n")
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
  'zhiling': {
    url: "../mock/zhiling.json",
    callback: function(res) {
      console.log(res)
      window.zhiling = res.data
      $(".zhiling").html('')
      $.each(res.data.zhilingList, function(index, item) {
        $(".zhiling").append("<span data-id='"+item.id+"' onclick=\"zhilingInit()\">$(" + item.name + ")</span>\n")
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
    $(".bp_zl_cs").append("<span data-id='"+item.id+"' onclick=\"canshuInit()\">$(" + item.name + ")</span>\n")
  })
}

function zhilingInit(){
  bpq.style.display='block';bpq2.style.display='none';glcs.style.display='block';ycs.style.display='none'
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

function reset(){
  var id = $('#canshuId').data("id")
  canshuInit(id)

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

ajaxData(apiConfig['zhiling'].url, {}, function(res){
  apiConfig['zhiling'].callback(res)
}, function(){
  console.log('zhiling: ajax请求失败');
})