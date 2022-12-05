var apiConfig = {
  'mock': true,
  'template': {
    url: "../mock/zzz.json",
    callback: function(res) {
      console.log(res)
      window.template = {}
      window.template.templateList = res.data.templateList
      window.zhiling = {}
      window.zhiling.commandList = res.data.commandList
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

      $(".busi2").html('<option value="all">全部业务</option>\n')
      $.each(res.data.serviceList, function(index, item) {
        $(".busi2").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
      })
      
      $(".wangyuan2").html('<option value="all">全部网元</option>\n')

      $(".zhiling").html('')
      $.each(res.data.commandList, function(index, item) {
        $(".zhiling").append("<span style=\"cursor:move\" data-id='"+item.commandId+"' class=item>$(" + item.commandName + ")</span>\n")
      })

      $(".template").html('')
      $.each(res.data.templateList, function(index, item) {
        $(".template").append("<span data-id='"+item.templateId+"' onclick=\"templateInit()\">$(" + item.templateName + ")</span>\n")
      })
    },
    resetZhiling: function(res) {
      window.template = {}
      window.template.templateList = res.data.templateList
      window.zhiling = {}
      window.zhiling.commandList = res.data.commandList
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
      $(".zhiling").html('')
      $.each(res.data.commandList, function(index, item) {
        $(".zhiling").append("<span style=\"cursor:move\" data-id='"+item.commandId+"' class=item>$(" + item.commandName + ")</span>\n")
      })
    },
    resetTemplate: function(res) {
      window.template = {}
      window.template.templateList = res.data.templateList
      window.zhiling = {}
      window.zhiling.commandList = res.data.commandList
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
      $(".busi2").html('<option value="all">全部业务</option>\n')
      $.each(res.data.serviceList, function(index, item) {
        $(".busi2").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
      })
      $(".wangyuan2").html('<option value="all">全部网元</option>\n')
      $(".template").html('')
      $.each(res.data.templateList, function(index, item) {
        $(".template").append("<span data-id='"+item.templateId+"' onclick=\"tempateInit()\">$(" + item.templateName + ")</span>\n")
      })
    }
  },
  "modify": {
    url: "/modify",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#modifyModelName').html('【'+$('#_templateName').val()+'】')
        $('#myModal6').modal('toggle');
        bpq.style.display='none';
        // fzcj.style.display='none'
      }
    }
  },
  "create": {
    url: "/create",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#newModelName').html('【$('+$('#_new_templateName').val()+')】')
        $('#myModal5').modal('toggle');
        bpq02.style.display='none';
        // fzcj.style.display='none'
        reload('resetTemplate')
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
      filterZhiling(window.zhiling.commandList)
    }
    if(busiClassName === 'busi2'){
      filterTemplate(window.template.templateList)
    }
  }else{
    var wangyuanList = window.canshu.netElementList.filter(function(item){
      return item.serviceCode == busi
    })
    $.each(wangyuanList, function(index, item) {
      $("."+wangyuanClassName).append("<option value="+item.netElementCode+">" + item.netElementName + "</option>\n")
    })
    if(busiClassName === 'busi2'){
      var list = window.template.templateList.filter(function(item){
        return item.serviceCode == busi
      })
      filterTemplate(list)
    }
    if(busiClassName === 'busi'){
      var commandList = window.zhiling.commandList.filter(function(item){
        return item.serviceCode == busi
      })
      filterZhiling(commandList)
    }
  }
}
function changeWangyuan(busiClassName, wangyuanClassName, vendorClassName) {
  var busi = $("."+busiClassName).val()
  var wangyuan = $("."+wangyuanClassName).val()
  if(busiClassName === 'busi'){
    var commandList = window.zhiling.commandList.filter(function(item){
      if(wangyuan === 'all'){
        return item.serviceCode == busi
      }else{
        return item.serviceCode == busi && item.netElementCode == wangyuan
      }
    })
    filterZhiling(commandList)
  }else if(busiClassName === 'busi2') {
    var list = window.template.templateList.filter(function(item){
      if(wangyuan === 'all'){
        return item.serviceCode == busi
      }else{
        return item.serviceCode == busi && item.netElementCode == wangyuan
      }
    })
    filterTemplate(list)
  }else if(busiClassName === 'busi3'){
    $("."+vendorClassName).html('<option value="all">全部厂家</option>\n')
    var vendorList = window.canshu.supplierList.filter(function(item){
      return item.serviceCode == busi && item.netElementCode == wangyuan
    })
    $.each(vendorList, function(index, item) {
      $("."+vendorClassName).append("<option value="+item.supplierCode+">" + item.supplierName + "</option>\n")
    })
  }
}
function filterZhiling(list) {
  $(".bp_zl_cs.zhiling").html('')
  $.each(list, function(index, item) {
    $(".bp_zl_cs.zhiling").append("<span data-id='"+item.commandId+"' onclick=\"zhilingInit()\">$(" + item.commandName + ")</span>\n")
  })
}

function filterTemplate(list) {
  $(".bp_zl_cs.template").html('')
  $.each(list, function(index, item) {
    $(".bp_zl_cs.template").append("<span data-id='"+item.templateId+"'>$(" + item.templateName + ")</span>\n")
  })
}

function templateInit(){
  $('#resetModify').css({"display":"block"});
  $('#resetNew').css({"display":"none"});
  bpq02.style.display='block';
  bpq.style.display='none';
  // glcs.style.display='block';
  // ycs.style.display='none'
  var id = event.target.dataset.id
  if(id) window.tmpId = id 
  var template = window.template.templateList.find(item=>item.templateId == window.tmpId)
  console.log('template :>> ', template);

  $('#_templateId').html(template.templateId)
  $('#_serviceName').html(template.serviceName)
  $('#_netElementName').html(template.netElementName)
  $('#_supplierName').html(template.supplierName)
  $('#_templateType').html(template.templateType)
  $('#_templateName').val(template.templateName)
  $('#_description').val(template.description)

  $('#g3').html('')
  template.commandList.forEach(item=>{
    var zhiling = window.zhiling.commandList.find(it=>it.commandId == item)
    $('#g3').append('<span style="cursor: move; display: block;" data-id="'+item+'" class="item" draggable="false">'
    +'<span class="fa fa-trash-o sc_dw" onclick="delZhiling(this)"></span><pre>'+zhiling.commandContent+'</pre></span>')
  })
  
  if($('#g3').children().length>0){
    $('#tipg3').css('display','none')
  }
}

function modify(){
  var templateId = $('#_templateId').html()
  var description = $('#_description').val()
  var templateName = $('#_templateName').val()
  var commandList = []
  $('#g3').children().each(function(index, item){
    commandList.push(item.dataset.id)
  })
  var obj ={templateName, templateId, description, commandList}
  console.log(obj);
  if(!templateName) {alert('模板名称不能为空');return}
  if(commandList.length == 0) {alert('指令不能为空');return}
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
  var serviceCode = $('#_new_busi').val()
  var netElementCode = $('#_new_wangyuan').val()
  var supplierCode = $('#_new_vendor').val()
  var templateType = $('#_new_templateType').val()
  var description = $('#_new_description').val()
  var templateName = $('#_new_templateName').val()
  var commandList = []
  $('#g2').children().each(function(index, item){
    commandList.push(item.dataset.id)
  })
  var obj ={serviceCode,netElementCode, supplierCode,templateType,templateName, description, commandList}
  console.log(obj);
  if(serviceCode === 'all'){alert('请选择业务');return}
  if(netElementCode === 'all'){alert('请选择网元');return}
  if(supplierCode === 'all'){alert('请选择厂商');return}
  if(!templateName) {alert('模板名称不能为空');return}
  if(commandList.length == 0) {alert('指令不能为空');return}
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
  $('#resetModify').css({"display":"none"});
  $('#resetNew').css({"display":"block"});
  bpq.style.display='block';
  bpq02.style.display='none';
  $(".busi3").html('<option value="all">全部业务</option>\n')
  $.each(window.canshu.serviceList, function(index, item) {
    $(".busi3").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
  })
  $(".wangyuan3").html('<option value="all">全部网元</option>\n')
  $(".vendor3").html('<option value="all">全部厂商</option>\n')
  $("#_new_templateType").val('制作')
  $("#_new_templateName").val('')
  $("#_new_description").val('')
  $("#tipg2").css('display','block')
  $("#g2").html('')
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

function reload(type){
  ajaxData(apiConfig['template'].url, {}, function(res){
    apiConfig['template'][type](res)
  }, function(){
    console.log('template: ajax请求失败');
  })
}

function delZhiling(el){
  console.log($(el),$(el.parentElement.parentElement).attr('id'));
  var id = $(el.parentElement.parentElement).attr('id')
  el.parentElement.remove()
  if($('#'+id).children().length === 0){
    $('#tip'+id).css('display','block')
  }
}

/**********  拖拽  ***********/
//左侧
var g1 = document.getElementById('g1');
var ops1 = {
  animation: 100,
  draggable: ".item",
  group: { name: "zhiling", pull: 'clone', put: false },
  sort: false, // 是否排序

  //拖动结束
  onEnd: function (evt) {
    console.log('g1 onEnd', evt);
    //获取拖动后的排序
    var arr = sortable1.toArray();
    // console.log(arr);
  },
};
var sortable1 = Sortable.create(g1, ops1);


var g2 = document.getElementById('g2');
var ops2 = {
  animation: 100,
  draggable: ".item",
  group: { name: "zhiling", pull: true, put: true },
  onAdd(evt) {
    console.log('g2 onAdd', evt);
    console.log($('#g2').children()); 
    if($('#g2').children().length>0){
      $('#tipg2').css('display','none')
    }
    evt.item.style.display = 'block'
    var zhiling = window.zhiling.commandList.find(it=>it.commandId == evt.item.dataset.id)
    evt.item.innerHTML = '<span class="fa fa-trash-o sc_dw" onclick="delZhiling(this)"></span><pre>'+zhiling.commandContent+'</pre>'
    var arr = sortable2.toArray();
    console.log(arr);
  },
  //拖动结束
  onEnd: function (evt) {
    console.log('g2 onEnd', evt);
    //获取拖动后的排序
    var arr = sortable2.toArray();
    console.log(arr);
  },
};
var sortable2 = Sortable.create(g2, ops2);

var g3 = document.getElementById('g3');
var ops3 = {
  animation: 100,
  draggable: ".item",
  group: { name: "zhiling", pull: true, put: true },
  onAdd(evt) {
    console.log('g3 onAdd', evt);
    console.log($('#g3').children()); 
    if($('#g3').children().length>0){
      $('#tipg3').css('display','none')
    }
    evt.item.style.display = 'block'
    var zhiling = window.zhiling.commandList.find(it=>it.commandId == evt.item.dataset.id)
    evt.item.innerHTML = '<span class="fa fa-trash-o sc_dw" onclick="delZhiling(this)"></span><pre>'+zhiling.commandContent+'</pre>'
    var arr = sortable2.toArray();
    console.log(arr);
  },
  //拖动结束
  onEnd: function (evt) {
    console.log('g2 onEnd', evt);
    //获取拖动后的排序
    var arr = sortable3.toArray();
    console.log(arr);
  },
};
var sortable3 = Sortable.create(g3, ops3);
/**********  拖拽  ***********/

ajaxData(apiConfig['template'].url, {}, function(res){
  apiConfig['template'].callback(res)
}, function(){
  console.log('template: ajax请求失败');
})