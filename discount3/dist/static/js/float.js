/**
 *  浮動 (預設右上 top:150)
 *  @example   $("#id").Float();
 *  @param {topSide:150,floatRight:0|1,side:5,close:ID}
 */
$.fn.Float = function(obj){
    var that = this;
    
    var lock = {
        topSide : 150,
        floatRight :1, 
        side : 5, //margin
        init : function(){
            var el = that, ua = navigator.userAgent;
            el.css({
                'position':'absolute',
                'z-index':'1000',
                'top': this.topSide
            });
            
            if (ua.toLowerCase().indexOf('360se') > -1) {
                this.isBlock = true;
            } else if (ua.toLowerCase().indexOf("theworld") > 0) {
                this.isBlock = true;
            }
            this.floatRight == 1 ? el.css('right',this.side) : el.css('left',this.side);
                    var locker = this;
            setInterval(function () {
                locker.lock.call(locker);
            }, 20);
            
            if(this.close != undefined){
                this.closeFloat();
            }
            if (this.floatRight == 1) {
                $(window).resize(function () {
                    $(this).scrollLeft(0);
                    el.css('right', 5);
                });
            }
        },
        lockTop : function (el, position, page, scroll, icon){
            var top = el.css('top');
            var y = scroll.top + icon.topSide,
                offsetTop = (y - parseInt(top)) / 20;
            if (this.isBlock) {
                offsetTop = (y - parseInt(top));
            }
            var topSide = parseInt(top) + offsetTop;
            if ((topSide + position.height) < page.height) {
                el.css('top',topSide );
            }
        },
        lockLeft : function (el, scroll, icon) {
            var left = el.css('left');
            var x = scroll.left + icon.side,
                offsetLeft = (x - parseInt(left)) / 20;
            el.css('left',parseInt(left) + offsetLeft);
        },
        lockRight : function (el, scroll, icon) {
            var right = el.css('right');
            var d = document;
            if (scroll.left == 0) {
                var x = icon.side,
                    offsetRight = (Math.abs(x) - Math.abs(parseInt(right))) / 20;
                el.css('right',Math.abs(parseInt(right)) + offsetRight);
            } else {
                    var x = scroll.left - icon.side,
                        offsetRight = (Math.abs(x) - Math.abs(parseInt(right))) / 20;
                    right = -(Math.abs(parseInt(right)) + offsetRight) + "px";
                    el.css('right',right);
                }
        },
        lock : function(){
             var el = that,
                position = this.currentPosition(el),
                win = this.windowDimension(),
                scroll = this.scrollPosition(),
                page = this.pageDimension(),
                icon = this;
            this.lockTop(el, position, page, scroll, icon);
            if (this.floatRight == 1) {
                this.lockRight(el, scroll, icon);
            } else {
                this.lockLeft(el, scroll, icon);
            }
            if (this.isBlock) {
                if (this.lastTop != el.css('top')) {
                    el.css('visibility',"hidden");
                    this.lastTop = el.css('top');
                } else {
                    el.css('visibility',"visible");
                }
            }
        },
        currentPosition: function (el) {
            var offset = el.offset();
            return {
                //top: offset.top,
                //left: offset.left,
                width: el.outerWidth(),
                height: el.outerHeight()
            };
        },
        windowDimension: function () {
            if ((typeof innerWidth != "undefined" && innerWidth != 0) && (typeof innerHeight != "undefined" && innerHeight != 0)) {
                return {
                    width: innerWidth,
                    height: innerHeight
                };
            }
            var d = document;
            return {
                width: Math.min(d.body.clientWidth, d.documentElement.clientWidth),
                height: Math.min(d.body.clientHeight, d.documentElement.clientHeight)
            };
        },
        scrollPosition: function () {
            var d = document;
            return {
                top: Math.max(d.body.scrollTop, d.documentElement.scrollTop),
                left: Math.max(d.body.scrollLeft, d.documentElement.scrollLeft)
            };
        },
        pageDimension: function () {
            var d = document;
            return {
                width: Math.max(d.body.scrollWidth, d.documentElement.scrollWidth),
                height: Math.max(d.body.scrollHeight, d.documentElement.scrollHeight)
            };
        },
        closeFloat : function(){
            that.find('#'+this.close).click(function(){
                that.hide();
            }).css('cursor','pointer');
        }
    };
    if (obj) $.extend(lock, obj);
    lock.init();
};

// JavaScript Document
//關閉效果
function FloatClose(t){$("#TplFloatPic_1").hide(); }
var left_top = 150, right_top = 150, float_list = [];
$(window).load(function() {
	// 廳主自改 - 浮動圖V2 -2013.7.19
            float_list['0'] = $('#TplFloatPic_0');
            float_list['1'] = $('#TplFloatPic_1');
        for (var i in float_list) {
        var self = float_list[i], 
        	picfloat = (self.attr('picfloat') == 'right') ? 1 : 0;
        
        self.show().Float({'floatRight' : picfloat, 'topSide' : ((picfloat == 1) ? right_top : left_top)});
        
        // ie6 png bug
        if (navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
        	$.each(self.find('img'), function(){
        		$(this).css({'width':$(this).width(),'height' : $(this).height()});
	});
        }
	
        if (picfloat) {
            right_top = right_top + 10 + (self.height() || 250);
        } else {
            left_top = left_top + 10 + (self.height() || 250);
	}
        $('a', self).each(function(){
        	$(this).css({'height' : $(this).find('img').height()}).hover(function() {
	            $(this).find('img:first').css('display', 'none');
	            $(this).find('img:last').css('display', 'block');
	        }, function() {
	            $(this).find('img:last').css('display', 'none');
	            $(this).find('img:first').css('display', 'block');
	        });
        });
}
});
function BBOnlineService() {
    window.open("http://chat32.live800.com/live800/chatClient/chatbox.jsp?companyID=664589&configID=91364&jid=6715243991");

}
