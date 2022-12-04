// 时间控件
   $('.form_datetime').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
		minView: 0,
    	minuteStep:1
    });
	$('.form_date').datetimepicker({
        language: 'zh-CN',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
	$('.form_time').datetimepicker({
		format: 'hh:ii:00',
        language:  'zh-CN',
        weekStart: 0,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight:0,
		startView: 1,
		minView: 0,
		maxView:0,
		forceParse: 1,
		minuteStep:1,
    });
	$('.form_moon').datetimepicker({
        language: 'zh-CN',
        weekStart: 1,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		startView: 3,
		minView: 3,
		forceParse: 0
    });

//弹出泡	
	$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})



//显示隐藏模块
$(".chevron-down").click(function() {
	$(".chevron-down").css('display','none');
	$(".chevron-up").css('display','block');
	$(".table-display").css('display','table');
});
$(".chevron-up").click(function() {
	$(".chevron-up").css('display','none');
	$(".chevron-down").css('display','block');
	$(".table-display").css('display','none');
});


function selectFile(){  
        document.getElementById('open').click();
            }
function selectFile2(){  
        document.getElementById('open2').click();
            }
function selectFile3(){  
        document.getElementById('open3').click();
            }    
			
			
jQuery(document).ready(function () {
	jQuery("#jquery-accordion-menu") || jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
	
});

$(function(){	
	//顶部导航切换
	$("#demo-list li").click(function(){
		$("#demo-list li.active").removeClass("active")
		$(this).addClass("active");
	})	
})	


$(function () {

  $("#organId") || $("#organId").fSelect();
	$("#organId2") || $("#organId2").fSelect();
	$("#organId3") || $("#organId3").fSelect();
	$("#organId4") || $("#organId4").fSelect();
	$("#organId5") || $("#organId5").fSelect();
  $("#organId6") || $("#organId6").fSelect();
  $("#organId7") || $("#organId7").fSelect();
  $("#organId8") || $("#organId8").fSelect();
  $("#organId9") || $("#organId9").fSelect();
});