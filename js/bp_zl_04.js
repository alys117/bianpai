var apiConfig = {
  'mock': true,
  'last': {
    url: "../mock/last.json",
    callback: function(res) {
      console.log(res)
      window.zhiling = {}
      window.zhiling.commandList = res.data.commandList
      window.template = {}
      window.template.templateList = res.data.templateList
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
      $(".busi").html('<option value="all">全部业务</option>\n')
      $.each(res.data.serviceList, function(index, item) {
        $(".busi").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
      })
      $(".wangyuan").html('<option value="all">全部网元</option>\n')
      $(".template").html('')
      $.each(res.data.templateList, function(index, item) {
        $(".template").append("<span data-id='"+item.templateId+"' onclick=\"templateInit()\">$(" + item.templateName + ")</span>\n")
      })
    }
  },
  "modify": {
    url: "/modify",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#modifyModelName').html('【'+$('#_templateName').html()+'】')
        $('#myModal6').modal('toggle');
        bpq.style.display='none';
      }
    }
  }
}
function changeBusi(busiClassName, wangyuanClassName) {
  var busi = $("."+busiClassName).val()
  $("."+wangyuanClassName).html('<option value="all">全部网元</option>\n')
  if(busi === 'all') {
    filterTemplate(window.template.templateList)
  }else{
    var wangyuanList = window.canshu.netElementList.filter(function(item){
      return item.serviceCode == busi
    })
    $.each(wangyuanList, function(index, item) {
      $("."+wangyuanClassName).append("<option value="+item.netElementCode+">" + item.netElementName + "</option>\n")
    })
    var templateList = window.template.templateList.filter(function(item){
      return item.serviceCode == busi
    })
    filterTemplate(templateList)
  }
}
function changeWangyuan(busiClassName, wangyuanClassName) {
  var busi = $("."+busiClassName).val()
  var wangyuan = $("."+wangyuanClassName).val()
  var templateList = window.template.templateList.filter(function(item){
    if(wangyuan === 'all'){
      return item.serviceCode == busi
    }else{
      return item.serviceCode == busi && item.netElementCode == wangyuan
    }
  })
  filterTemplate(templateList)
}
function filterTemplate(canshuList) {
  $(".bp_zl_cs.template").html('')
  $.each(canshuList, function(index, item) {
    $(".bp_zl_cs.template").append("<span data-id='"+item.templateId+" onclick=\"templateInit()\"'>$(" + item.templateName + ")</span>\n")
  })
}

function templateInit(){
  bpq.style.display='block';
  var id = event.target.dataset.id
  if(id) window.tmpId = id 
  var template = window.template.templateList.find(item=>item.templateId == window.tmpId)
  console.log('template :>> ', template);
  $('#g3').html('')
  template.commandList.forEach(item=>{
    var zhiling = window.zhiling.commandList.find(it=>it.commandId == item)
    $('#g3').append('<span style="display: block;" data-id="'+item+'">'
    +'<pre>'+zhiling.commandContent+'</pre></span>')
  })

  $("#_templateId").html(template.templateId)
  $("#_templateName").html(template.templateName)
  $("#_busi").html(template.serviceName)
  $("#_wangyuan").html(template.netElementName)
  $("#_vendor").html(template.supplierName)
  $("#_scence").val('新增')
  $("#_condition").val('')
  $("#_description").val('')
  $('#organId').fSelect({showSearch: false, BtnFixed:false});
  //获取选中的值
  function set1(arr) {
    //第一步，先给select标签赋值
    if(!arr) arr = ''
    var tmp = arr.split(',');
    $("select[name='demo']").val(tmp);
    //第二步，给fs-optgroup下对应的option添加样式selected
    $(".fs-option").each(function () {
      if(tmp.indexOf($(this)['context']['dataset']['value']) != -1){
          $(this).addClass("selected");
      }else{
          $(this).removeClass("selected");
      }
    });
    //第三步，重新加载下拉框，使得添加了selected样式的option处于被勾选状态
    $("select[name='demo']").fSelect('reloadDropdownLabel');
  }
  set1()
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

function reload(){
  ajaxData(apiConfig['last'].url, {}, function(res){
    apiConfig['last'].callback(res)
  }, function(){
    console.log(last+': ajax请求失败');
  })
}

function createCompose(){
  var organId = $("#organId").val()
  var templateId = $('#_templateId').html()
  var scence = $('#_scence').val()
  var condition = $('#_condition').val()
  var obj ={templateId, scence, condition, organId}
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
        console.log(': ajax请求失败');
      }
    })
}

ajaxData(apiConfig['last'].url, {}, function(res){
  apiConfig['last'].callback(res)
}, function(){
  console.log('last: ajax请求失败');
})
