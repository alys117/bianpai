var apiConfig = {
  'mock': true,
  'command': {
    url: "../mock/yyy.json",
    callback: function(res) {
      console.log(res)
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
    },
    resetCanshu: function(res) {
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
      $(".canshu").html('')
      $.each(res.data.paramList, function(index, item) {
        $(".canshu").append("<button style='background: rgba(0,0,0,0);border:0'><span data-id='"+item.paramId+"' onclick=\"clickCanshu()\">$(" + item.paramName + ")</span></button>\n")
      })
    },
    resetZhiling: function(res) {
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
        $(".zhiling").append("<span data-id='"+item.commandId+"' onclick=\"zhilingInit()\">$(" + item.commandName + ")</span>\n")
      })
    }
  },
  "modify": {
    url: "/command/modify",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#modifyModelName').html('【'+$('#canshuId').html()+'】')
        $('#myModal6').modal('toggle');
        bpq.style.display='none';
      }
    }
  },
  "create": {
    url: "/command/create",
    callback: function(res) {
      console.log(res)
      if(res.code === 200){
        $('#newModelName').html('【$('+$('#_new_commandName').val()+')】')
        $('#myModal5').modal('toggle');
        bpq2.style.display='none';
        reload('resetZhiling')
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
      var canshuList = window.canshu.paramList.filter(function(item){
        return item.serviceCode == busi
      })
      filterCanshu(canshuList)
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
    var canshuList = window.canshu.paramList.filter(function(item){
      if(wangyuan === 'all'){
        return item.serviceCode == busi
      }else{
        return item.serviceCode == busi && item.netElementCode == wangyuan
      }
    })
    filterCanshu(canshuList)
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
function filterCanshu(list) {
  $(".bp_zl_cs.canshu").html('')
  $.each(list, function(index, item) {
    $(".bp_zl_cs.canshu").append("<span data-id='"+item.paramId+"' onclick=\"canshuInit()\">$(" + item.paramName + ")</span>\n")
  })
}

function filterZhiling(list) {
  $(".bp_zl_cs.zhiling").html('')
  $.each(list, function(index, item) {
    $(".bp_zl_cs.zhiling").append("<span data-id='"+item.commandId+"' onclick=\"zhilingInit()\">$(" + item.commandName + ")</span>\n")
  })
}

function zhilingInit(){
  bpq.style.display='block';
  bpq2.style.display='none';
  // glcs.style.display='block';
  // ycs.style.display='none'

  $('#resetModify').css({"display":"block"});
  $('#resetNew').css({"display":"none"});
  
  var id = event.target.dataset.id
  if(id) window.tmpId = id 
  var zhiling = window.zhiling.commandList.find(item=>item.commandId == window.tmpId)
  console.log('zhiling :>> ', zhiling);

  $('#_commandId').html(zhiling.commandId)
  $('#_commandContent').html(zhiling.commandContent)
  $("#_region").html(zhiling.region);
  $("#_netel").html(zhiling.netElementName);
  $("#_supplier").html(zhiling.supplierName);
  $("#_commandName").html(zhiling.commandName);

  // select 被选中的操作代码
  // $('#_commandType').find('option[value='+zhiling.commandType+']').attr('selected',true)
  // $('#_goldenLibCommand').find('option[value='+zhiling.goldenLibCommand+']').attr('selected',true)
  $('#_commandType').val(zhiling.commandType)
  $('#_goldenLibCommand').val(zhiling.goldenLibCommand)
  
  $("#_description").val(zhiling.description);
  $("#_commandPrompt").val(zhiling.commandPrompt);
  $("#_commandConfirm").val(zhiling.commandConfirm);
  $("#_commandEnd").val(zhiling.commandEnd);
  $("#_waitTimeout").val(zhiling.waitTimeout);
  $("#_readTimeout").val(zhiling.readTimeout);
  $.each($('#commandExecFailIdTD').children(), function(i,val){ 
    if(i === 0 ){
      $(val).find('input').val('')
    }else{
      $(val).remove()
    }
  });
  zhiling.failPrompt.forEach((element, idx)=> {
    if(idx === 0){
      var a = $('#commandExecFailIdTD').children().find('input').val(element)
    }else{
      addrow('commandExecFailId', element)
    }
  });
  $.each($('#commandExecSuccessIdTD').children(), function(i,val){ 
    if(i === 0 ){
      $(val).find('input').val('')
    }else{
      $(val).remove()
    }
  });
  zhiling.successPrompt.forEach((element, idx)=> {
    if(idx === 0){
      var a = $('#commandExecSuccessIdTD').children().find('input').val(element)
    }else{
      addrow('commandExecSuccessId', element)
    }
  });
  $.each($('#replyIdTD').children(), function(i,val){ 
    if(i === 0 ){
      $(val).find('input').val('')
    }else{
      $(val).remove()
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
  var commandId = $('#_commandId').html()
  var commandContent = $('#_commandContent').html()
  var commandType = $('#_commandType').val()
  var goldenLibCommand = $('#_goldenLibCommand').val()
  var description = $('#_description').val()
  var commandPrompt = $('#_commandPrompt').val()
  var commandConfirm = $('#_new_commandConfirm').val()
  var commandEnd = $('#_commandEnd').val()
  var commandConfirm = $('#_commandConfirm').val()
  var commandPrompt = $('#_commandPrompt').val()
  var failPrompt = [];
  $('#commandExecFailIdTD').children().map(function(i, val){
    failPrompt.push($(val).find('input').val())
  })
  var successPrompt = [];
  $('#commandExecSuccessIdTD').children().map(function(i, val){
    successPrompt.push($(val).find('input').val())
  })
  var responseFlag = [];
  $('replyIdTD').children().map(function(i, val){
    responseFlag.push($(val).find('input').val())
  })
  var readTimeout = $('#_readTimeout').val()
  var waitTimeout = $('#_waitTimeout').val()
  var obj ={commandContent, commandId, commandType, goldenLibCommand, description, commandPrompt
    , commandConfirm, commandEnd, failPrompt, successPrompt, responseFlag
    , readTimeout, waitTimeout}
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
        console.log('modify: ajax请求失败');
      }
    })
}
function create(){
  var commandContent = $('#_new_commandContent').html()
  var serviceCode = $('#_new_service').val()
  var netElementCode = $('#_new_netel').val()
  var supplierCode = $('#_nwe_supplier').val()
  var commandName = $('#_new_commandName').val()
  var commandType = $('#_new_commandType').val()
  var goldenLibCommand = $('#_new_goldenLibCommand').val()
  var description = $('#_new_description').val()
  var commandPrompt = $('#_new_commandPrompt').val()
  var commandConfirm = $('#_new_commandConfirm').val()
  var commandEnd = $('#_new_commandEnd').val()
  var commandConfirm = $('#_new_commandConfirm').val()
  var commandPrompt = $('#_new_commandPrompt').val()
  var failPrompt = [];
  $('#newCommandExecFailIdTD').children().map(function(i, val){
    failPrompt.push($(val).find('input').val())
  })
  var successPrompt = [];
  $('#newCommandExecSuccessIdTD').children().map(function(i, val){
    successPrompt.push($(val).find('input').val())
  })
  var responseFlag = [];
  $('#newReplyIdTD').children().map(function(i, val){
    responseFlag.push($(val).find('input').val())
  })
  var readTimeout = $('#_new_readTimeout').val()
  var waitTimeout = $('#_new_waitTimeout').val()
  var obj ={commandContent, serviceCode,netElementCode, supplierCode
    , commandName, commandType, goldenLibCommand, description, commandPrompt
    , commandConfirm, commandEnd, failPrompt, successPrompt, responseFlag
    , readTimeout, waitTimeout}
  console.log(obj);
  if(commandName === ''){alert('请填写名称');return}
  if(serviceCode === 'all'){alert('请选择业务');return}
  if(netElementCode === 'all'){alert('请选择网元');return}
  if(supplierCode === 'all'){alert('请选择厂商');return}
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
        console.log('create: ajax请求失败');
      }
    })
}
function initNew(){
  $('#resetModify').css({"display":"none"});
  $('#resetNew').css({"display":"block"});
  bpq.style.display='none';
  bpq2.style.display='block';

  $(".busi3").html('<option value="all">全部业务</option>\n')
  $.each(window.canshu.serviceList, function(index, item) {
    $(".busi3").append("<option value="+item.serviceCode+">" + item.serviceName + "</option>\n")
  })
  $(".wangyuan3").html('<option value="all">全部网元</option>\n')
  $(".vendor3").html('<option value="all">全部厂商</option>\n')


  $('#_new_commandContent').html('')
  // $("#_new_region").html('');
  // $("#_new_netel").html('');
  // $("#_new_supplier").html('');
  $("#_new_commandName").val('');

  $('#_new_commandType').val('新增')
  $('#_new_goldenLibCommand').val('否')
  
  $("#_new_description").val('');
  $("#_new_commandPrompt").val('');
  $("#_new_commandConfirm").val('');
  $("#_new_commandEnd").val('');
  $("#_new_waitTimeout").val('');
  $("#_new_readTimeout").val('');
  $.each($('#newCommandExecFailIdTD').children(), function(i,val){ 
    if(i === 0 ){
      $(val).find('input').val('')
    }else{
      $(val).remove()
    }
  });
  $.each($('#newCommandExecSuccessIdTD').children(), function(i,val){ 
    if(i === 0 ){
      $(val).find('input').val('')
    }else{
      $(val).remove()
    }
  });
  $.each($('#newReplyIdTD').children(), function(i,val){ 
    if(i === 0 ){
      $(val).find('input').val('')
    }else{
      $(val).remove()
    }
  });
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

function reload(type){
  ajaxData(apiConfig['command'].url, {}, function(res){
    apiConfig['command'][type](res)
  }, function(){
    console.log('command: ajax请求失败');
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

// 请求第二页的数据
ajaxData(apiConfig['command'].url, {}, function(res){
  apiConfig['command'].callback(res)
}, function(){
  console.log('command: ajax请求失败');
})