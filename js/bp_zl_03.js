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
      filterZhiling(window.zhiling.commandList)
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
  bpq02.style.display='block';
  bpq.style.display='none';
  // glcs.style.display='block';
  // ycs.style.display='none'
  var id = event.target.dataset.id
  if(id) window.tmpId = id 
  var template = window.template.templateList.find(item=>item.templateId == window.tmpId)
  console.log('template :>> ', template);

  $('#_serviceName').html(template.serviceName)
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

function addrow(id, value){
  var divid = id+'_'+ new Date().getTime()
  $('#'+id+'TD').append(
  '<div id="'+divid+'" class="input-group" style="width: 200px;margin-top: 10px;">'+
  '<input type="text" class="form-control input-sm" value="'+(value?value:'')+'">'+
  '<div class="input-group-addon pointer" onclick="delrow(\''+divid+'\')"><span class="fa fa-minus"></span></div>')
}
function delrow(id){
  $('#'+id).remove()
}

function reload(val){
  ajaxData(apiConfig[val].url, {}, function(res){
    apiConfig[val].callback(res)
  }, function(){
    console.log(val+': ajax请求失败');
  })
}
function delZhiling(el){
  console.log($(el));
  el.parentElement.remove()
  if($('#g2').children().length === 0){
    $('#tip').css('display','block')
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
      $('#tip').css('display','none')
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
/**********  拖拽  ***********/

ajaxData(apiConfig['template'].url, {}, function(res){
  apiConfig['template'].callback(res)
}, function(){
  console.log('template: ajax请求失败');
})