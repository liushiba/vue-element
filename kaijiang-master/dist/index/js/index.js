

function lunLeftFn(obj, time) {

		time = time ? time: 30;
		var ul = $(obj).find("ul")
		ul.append(ul.children().clone(true))
		var len = ul.children('li').width()*ul.children('li').length / 2
		var times = null;
		times = window.setInterval(function(){
			var t = ul.css('left');
			t = t.replace('px','');
			
			if(t > -len){
				t--;
				ul.css({left: t})
			}else{
				ul.css({left: 0})
			}
			
		},time)
		
		ul.hover(function(){
			window.clearInterval(times);
		},function(){
			times = window.setInterval(function(){
				var t = ul.css('left');
				t = t.replace('px','');
				
				if(t > -len){
					t--;
					ul.css({left: t})
				}else{
					ul.css({left: 0})
				}
				
			},time)
		})
	}
  // lunLeftFn(".lunleft")
	

	
function carouselFn(obj,stopTime,slipTime){
	var stopTime = stopTime?stopTime:4000;
	var slipTime = slipTime?slipTime:1000;
	var obj = $(obj);
	var tutu = obj.find('.tutu')
	
	var yuandian = obj.find('.yuandian')
	
	tutu.append(tutu.children('li').eq(0).clone(true));
	var len = tutu.children('li').height();
	var cLength = tutu.children('li').length;
	var iNow = 0;

	var leftBtn =  function(){
		if(iNow > 0){
			iNow--;
			tutu.stop().animate({top: -len*iNow},slipTime);
		}else{
			tutu.css({top: -len*(cLength-1)})
			iNow = cLength-2;
			tutu.stop().animate({top: -len*iNow},slipTime);
		}
	}
	var rightBtn =  function(){
		if(iNow < cLength-2){
			iNow++;
			tutu.stop().animate({top: -len*iNow},slipTime);
		}else{
			tutu.stop().animate({top: -len*(cLength-1)},slipTime,function(){
				tutu.css({top:0});
				iNow = 0;
			});
		}
	}
	
	var times = window.setInterval(function(){
			rightBtn();
		},stopTime)
	obj.hover(function(){
			window.clearInterval(times);
		},function(){
			times = window.setInterval(function(){
				rightBtn();
			},stopTime)
		})
}





$(document).ready(function () { 
	$('.inflisert ul li').click(function(){
		//$(this).toggleClass('cur');
	});

	$('.allclear').click(function(){
		//$('.inflisert ul li').removeClass('cur');
	});


	$('.btn-close').click(function(){
   		$(this).parents('.dialogBox').hide();
   });
});
	$(window).scroll(function() {
    	
		var nowt1 = $(window).scrollTop();
		var nowt2 = $('.fidxtop').offset().top;
		if (nowt1>=591) {
			$('.fidxtop').addClass('cur');
		}
		else{
			$('.fidxtop').removeClass('cur');
		}
		
	});


