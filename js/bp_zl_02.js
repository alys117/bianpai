var apiConfig = {
  'mock': true,
  'canshu': {
    url: "../mock/yyy.json",
    callback: function(res) {
      console.log(res)
      window.canshu = res.data
      window.zhiling = {}
      window.zhiling.commandList = res.data.commandList
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
      $(".zhiling").html('')
      $.each(res.data.commandList, function(index, item) {
        $(".zhiling").append("<span data-id='"+item.commandId+"' onclick=\"zhilingInit()\">$(" + item.commandName + ")</span>\n")
      })

      $(".canshu").html('')
      $.each(res.data.paramList, function(index, item) {
        $(".canshu").append("<button style='background: rgba(0,0,0,0);border:0'><span data-id='"+item.paramId+"' onclick=\"clickCanshu()\">$(" + item.paramName + ")</span></button>\n")
      })
      $(".busi").html('<option value="all">全部业务</option>\n')
      $.each(res.data.serviceList, function(index, item) {
        $(".busi").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
      })
      
      $(".wangyuan").html('<option value="all">全部网元</option>\n')
      $.each(res.data.netElementList, function(index, item) {
        // $(".wangyuan").append("<option value="+item.id+">" + item.name + "</option>\n")
      })

      $(".busi2").html('<option value="all">全部业务</option>\n')
      $.each(res.data.serviceList, function(index, item) {
        $(".busi2").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
      })
      
      $(".wangyuan2").html('<option value="all">全部网元</option>\n')
      $.each(res.data.netElementList, function(index, item) {
        // $(".wangyuan").append("<option value="+item.id+">" + item.name + "</option>\n")
      })
    }
  },
  'zhiling': {
    url: "../mock/zhiling.json",
    callback: function(res) {
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
function clickCanshu(){
  var content = event.target.innerHTML
  var sel = window.getSelection();
  console.log('sel :>> ', sel);
  function getClassName(el){
    if(el.nodeName === 'DIV') {
      return el.className
    }else{
      return getClassName(el.parentElement)
    }
  }

  if(sel.anchorNode && getClassName(sel.anchorNode) === 'leave-message-textarea'){
    insertContent(content)
  }
}
function insertContent(content){
  if (!content) {//如果插入的内容为空则返回
      return
  }
  var sel = null;
  if (document.selection) {//IE9以下
      sel = document.selection;
      sel.createRange().pasteHTML(content);
  } else {
      sel = window.getSelection();
      if (sel.rangeCount > 0) {
          var range = sel.getRangeAt(0);      //获取选择范围
          range.deleteContents();             //删除选中的内容
          var el = document.createElement("div"); //创建一个空的div外壳
          el.innerHTML = content;                 //设置div内容为我们想要插入的内容。
          var frag = document.createDocumentFragment();//创建一个空白的文档片段，便于之后插入dom树
          var node = el.firstChild;
          var lastNode = frag.appendChild(node);
          range.insertNode(frag);                 //设置选择范围的内容为插入的内容
          var contentRange = range.cloneRange();  //克隆选区
          contentRange.setStartAfter(lastNode);          //设置光标位置为插入内容的末尾
          contentRange.collapse(true);                   //移动光标位置到末尾
          sel.removeAllRanges();                  //移出所有选区
          sel.addRange(contentRange);             //添加修改后的选区
      }
  }
}
function changeBusi(busiClassName, wangyuanClassName) {
  var busi = $("."+busiClassName).val()
  $("."+wangyuanClassName).html('<option value="all">全部网元</option>\n')
  if(busi === 'all') {
    if(busiClassName === 'busi2'){
      filterCanshu(window.canshu.paramList)
    }else if(busiClassName === 'busi'){
      filterZhiling(window.zhiling.zhilingList)
    }
  }else{
    var wangyuanList = window.canshu.netElementList.filter(function(item){
      return item.serviceCode == busi
    })
    $.each(wangyuanList, function(index, item) {
      $("."+wangyuanClassName).append("<option value="+item.netElementCode+">" + item.netElementName + "</option>\n")
    })
    if(busiClassName === 'busi2'){
      var canshuList = window.canshu.paramList.filter(function(item){
        return item.serviceCode == busi
      })
      if(busiClassName === 'busi2') filterCanshu(canshuList)
    }else if(busiClassName === 'busi'){
      var zhilingList = window.zhiling.zhilingList.filter(function(item){
        return item.busiId == busi
      })
      if(busiClassName === 'busi') filterZhiling(zhilingList)
    }
  }
}
function changeWangyuan(busiClassName, wangyuanClassName) {
  var busi = $("."+busiClassName).val()
  var wangyuan = $("."+wangyuanClassName).val()
  if(busiClassName === 'busi2') {
    var canshuList = window.canshu.paramList.filter(function(item){
      if(wangyuan === 'all'){
        return item.serviceCode == busi
      }else{
        return item.serviceCode == busi && item.netElementCode == wangyuan
      }
    })
    filterCanshu(canshuList)
  }else if(busiClassName === 'busi'){
    var zhilingList = window.zhiling.zhilingList.filter(function(item){
      if(wangyuan === 'all'){
        return item.serviceCode == busi
      }else{
        return item.serviceCode == busi && item.netElementCode == wangyuan
      }
    })
    filterZhiling(zhilingList)
  }
}
function filterCanshu(canshuList) {
  $(".bp_zl_cs.canshu").html('')
  $.each(canshuList, function(index, item) {
    $(".bp_zl_cs.canshu").append("<span data-id='"+item.paramId+"' onclick=\"canshuInit()\">$(" + item.paramName + ")</span>\n")
  })
}

function filterZhiling(zhilingList) {
  $(".bp_zl_cs.zhiling").html('')
  $.each(zhilingList, function(index, item) {
    $(".bp_zl_cs.zhiling").append("<span data-id='"+item.id+"' onclick=\"zhilingInit()\">$(" + item.name + ")</span>\n")
  })
}

function zhilingInit(){
  var id = event.target.dataset.id
  bpq.style.display='block';
  bpq2.style.display='none';
  // glcs.style.display='block';
  ycs.style.display='none'

  var zhiling = window.zhiling.commandList.find(item=>item.commandId == id)
  console.log('zhiling :>> ', zhiling);
  // select 被选中的操作代码
  $('#commandType').find('option[value='+zhiling.commandType+']').attr('selected',true)

  zhiling.failPrompt.forEach((element, idx)=> {
    if(idx === 0){
      var a = $('#commandExecFailIdTD').children().find('input').val(element)
    }else{
      addrow('commandExecFailId', element)
    }
  });
  zhiling.successPrompt.forEach((element, idx)=> {
    if(idx === 0){
      var a = $('#commandExecSuccessIdTD').children().find('input').val(element)
    }else{
      addrow('commandExecSuccessId', element)
    }
  });
  zhiling.responseFlag.forEach((element, idx)=> {
    if(idx === 0){
      var a = $('#replyIdTD').children().find('input').val(element)
    }else{
      addrow('replyId', element)
    }
  });
  
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
  $.each(window.canshu.serviceList, function(index, item) {
    $(".busi3").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
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
ajaxData(apiConfig['canshu'].url, {}, function(res){
  apiConfig['canshu'].callback(res)
}, function(){
  console.log('canshu: ajax请求失败');
})

// ajaxData(apiConfig['zhiling'].url, {}, function(res){
//   apiConfig['zhiling'].callback(res)
// }, function(){
//   console.log('zhiling: ajax请求失败');
// })