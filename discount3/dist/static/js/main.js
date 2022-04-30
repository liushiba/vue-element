$('#TplFloatPic_1').Float();
$('#TplFloatPic_2').Float();

$(document).ready(function(){
	$('.notice_list li:even').addClass('lieven');
})
$(function(){
	$(".notice_list").myScroll({
		speed:60,
		rowHeight:28,
	});
});

$('.layui-layer-close').click(function(event) {
	$(this).parents('.modal').hide(100);
});

function show(index){
	var height = $('#querycon'+index).height();
	var width = $('#querycon'+index).width();
	$('#querycon'+index).css({'margin-top': -height/2, 'margin-left': -width/2});
	$('#querycon'+index).show(300).siblings('.modal').hide();
};

// $(window).scroll(function(){  
// 	if ($(window).scrollTop()> 500){  
// 		$(".go-top").fadeIn(500);  
// 	} else{  
// 		$(".go-top").fadeOut(500);  
// 	}  
// });