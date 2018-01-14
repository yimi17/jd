/*-------------------
	公共函数
-------------------*/
	//兼容IE,动画计时器
	window.requestAnimationFrame = window.requestAnimationFrame || function (a){return setTimeout(a,1000/60)};
	window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
	
	//获取元素样式，兼容IE8以下
	function getstyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];	//仅支持IE
		}else{
			return getComputedStyle(obj)[attr];//支持主流浏览器及IE8以上
		}
	}
	//时间版运动框架完善版，4个形参：元素，json属性，完成时间，回调
	function move(obj,mJson,time,fun){
		var start = {},
			end = {},
			s_time = new Date();

		for(var key in mJson){
			//获取scrolltop的方式，不能使用getstyle方法
			start[key] = (key==="scrollTop")?obj[key]:parseFloat(getstyle(obj,key));
			end[key] = parseFloat(mJson[key]);
		}

		timer();
		function timer(){
			var t =(new Date()-s_time)/time;//当前时间比
			t>=1?t=1:requestAnimationFrame(timer);
			for(var key in mJson){
				if(key==="opacity"){
					var o = start[key] + t*(end[key]-start[key]);
					obj.style[key] = o;
					obj.style.filter = "alpha(opacity=" + 100*o + ")";
				}else if(key==="scrollTop"){
					obj[key] = start[key] + t*(end[key]-start[key]);
				}else{
					obj.style[key] = start[key] + t*(end[key]-start[key]) + "px";
				}
			}
			if(t===1){fun && fun()}	//回调函数
		}
	}

	//getElementsByClassName的兼容写法（IE8及以下不支持）
    //用于获取侧边悬浮导航所对应元素的滚动位置 89行
    var getElementsByClassName = function(className, results) {
        results = results || [];
        if(document.getElementsByClassName) {
            results.push.apply( results, document.getElementsByClassName(className) );
        } else {
            var nodes = document.getElementsByTagName("*");
            for(var i = 0; i < nodes.length; i++) {
                var cNodes = nodes[i];
                var cNodeClsName = cNodes.className;
                var clsNames = cNodeClsName.split(" ");
                for(var j = 0; j < clsNames.length; j++) {
                    if(clsNames[j] === className) {
                        results.push(cNodes);
                    }
                }
            }
        }
        return results;
    };

/*-------------------
 	顶部和侧边悬浮导航nav
 -------------------*/
+function(){
	var oNav = document.getElementById("nav");
	var sidebar = document.getElementById("sidebar2");
	var oLi = sidebar.getElementsByTagName("li");
	var index = 0;		//侧边栏序号
	var arr = [];       //点击时对应滚动的top值693,1003,1457,1857,2697,3251,3938,4463,4870,0
	var onoff = true;	//控制背景色跳跃（在点击滚动时不改变背景色）
	var dObj  = document.documentElement;	//存储文档对象
	//判断是不是谷歌浏览器，兼容文档滚动属性
	// if(navigator.userAgent.indexOf("Chrome") >= 0){
	// 	dObj = document.body;
	// }else{
	// 	dObj = document.documentElement;
	// }

    //动态生成滚动top值
    (function(){
        var scrollTarget = getElementsByClassName("scroll-target");
        var length = scrollTarget.length;
        for(var i=0;i<length;i++){arr[i] = scrollTarget[i].offsetTop-52}
        arr.push(0);
    })();

	//右侧的返回顶部
	var totop = document.getElementById("totop");
	totop.onclick = function(){
		onoff = false;		//控制背景色跳跃
		move(dObj,{scrollTop:0},500,function(){
			onoff = true;	//控制背景色跳跃
		});
	};
	//侧边栏点击时滚动到相应位置
	for(var i=0;i<oLi.length;i++){
		oLi[i].index = i;
		oLi[i].onclick = function(){
			var This = this;
			onoff = false;	//控制背景色跳跃

			//调用时间运动框架
			move(dObj,{scrollTop:arr[this.index]},500,function(){
				oLi[index].style.background = "#918888";
				index = This.index;
				This.style.background = "#d70b1c";
				onoff = true;//控制背景色跳跃
			});
		};
		//添加移入移出事件
		if(i<oLi.length-1){
			oLi[i].onmouseenter = function(){
				this.style.background = "#d70b1c";
			};
			oLi[i].onmouseleave = function(){
				this.style.background = "#918888";
				oLi[index].style.background = "#d70b1c";//防止当前的序号背景色改变，要重新赋值
			};
		}
	}

	//滚动时改变背景色
	function on(x){
		if(onoff){	//控制背景色跳跃
			oLi[index].style.background = "#918888";
    		index = x;
    		oLi[index].style.background = "#d70b1c";
		}
	}

	//窗口滚动时显示顶部和侧边的导航
    window.onscroll = function(){
    	var scrollTop = dObj.scrollTop;
    	//控制顶部的悬浮导航
    	oNav.style.top = scrollTop>650?0:"-100px";
        var num = scrollTop>1000?1:0;

    	//控制侧边的悬浮导航
    	move(sidebar,{opacity:num},300);

    	//滚动条改变，改变导航相应背景色
    	scrollTop += 100;	//提前100px显示

        if(scrollTop>arr[8]){
            on(8);
        }else if(scrollTop>arr[7]){
            on(7);
        }else if(scrollTop>arr[6]){
            on(6);
        }else if(scrollTop>arr[5]){
            on(5);
        }else if(scrollTop>arr[4]){
            on(4);
        }else if(scrollTop>arr[3]){
            on(3);
        }else if(scrollTop>arr[2]){
            on(2);
        }else if(scrollTop>arr[1]){
            on(1);
        }else if(scrollTop>arr[0]){
            on(0);
        }

    };

    window.onload = change;    //初始化侧边导航的位置
    window.onresize = change;  //浏览器大小改变时调整位置
	function change(){
		sidebar.style.marginTop = -sidebar.offsetHeight/2 + "px";
		sidebar.style.left = dObj.clientWidth/2 - 1190/2 - 80 + "px";
	}
}();
/*-------------------
	当前城市local
-------------------*/
+function(){	//更改当地位置
	var oCurrent = document.getElementById("beijing");
	var oCurrent2 = document.getElementById("beijing2");
	var oSpan = document.querySelector("#local .local-con");
	var oLocal = document.getElementById("local");
	var oA = document.querySelectorAll("#local .local-con p a");

	for(var i=0;i<oA.length;i++){
		oA[i].onclick = function(){
			oCurrent.innerHTML = oCurrent2.innerHTML = this.innerHTML;
			oSpan.className = "local-con";
		}
	}
	oLocal.onmouseenter = function(){oSpan.className = "local-con on"};
	oLocal.onmouseleave = function(){oSpan.className = "local-con"};
}();
/*-------------------
	头部轮播
-------------------*/
+function(){
	var oCon = document.getElementById("banner-con");
	var oPrev = oCon.querySelector("p.prev");
	var oNext = oCon.querySelector("p.next");
	var oBtn = oCon.querySelectorAll(".banner-btn i");
	var oImg = oCon.querySelectorAll("img");
	var length = oBtn.length;	//长度
	var index = 0;		        //当前序号
	var timer = setInterval(play2,2000);	//定时器

	for(var i=0;i<length;i++){	//小按钮
		oBtn[i].index = i;
		oBtn[i].onmouseenter = function(){
			play(this.index);
		}
	}
	oNext.onclick = function(){play(index+1)};
	oPrev.onclick = function(){play(index-1)};

	oCon.onmouseenter = function(){		//鼠标离开时清除定时器
		clearInterval(timer);
	};
	oCon.onmouseleave = function(){		//鼠标停留时添加定时器
		timer = setInterval(play2,2000);
	};

	function play2(){play(index+1)}		//定时器向下走

	function play(x){		//切换函数
		if(x>=length){x=0}
		if(x<0){x=length-1}
		oBtn[index].className = "";
		move(oImg[index],{opacity:0},500);
		index = x;
		oBtn[index].className = "on";
		move(oImg[index],{opacity:1},500);

	}
}();
/*-------------------
	头部选项卡1
-------------------*/
+function(){
	var oBtn = document.getElementById("item1");
	var oSpan = oBtn.querySelectorAll("p span");
	var oCon = oBtn.querySelectorAll(".con div");
	var oI = oBtn.querySelector(".line2");
	oSpan[0].onmouseenter = function(){	//左边选项
		oCon[0].className = "con1 on";
		oCon[1].className = "con1";
		oI.style.left = "-3px";
	};
	oSpan[1].onmouseenter = function(){	//右边选项
		oCon[1].className = "con1 on";
		oCon[0].className = "con1";
		oI.style.left = "45px";
	};
}();
/*-------------------
	头部选项卡2
-------------------*/
+function(){	
	//第一层选项的元素
	var oBox = document.getElementById("item2");
	var oI = oBox.querySelector(".top");	//遮罩层
	var oItem = oBox.querySelectorAll(".ul-item li");
	//第二层选项元素
	var oCon = oBox.querySelector(".con");
	var oBtn = oBox.querySelectorAll(".con .ul-title li");
	var oLi = oBox.querySelectorAll(".con .ul-con li");
	var i_border = oBox.querySelector("i.border");
	var i_close = oBox.querySelector("i.close");
	var length = oBtn.length;	//选项长度
	var index = 0;		//当前显示的序号
	
	//显示第二层内容
	for(var j=0;j<4;j++){
		oItem[j].index = j;
		oItem[j].onmouseenter = function(){
			var This = this;
			setTimeout(function(){	//100毫秒后显示
				oCon.style.top = 0;
				visible(This.index);	//当前序号
				oI.style.display = "block";	//遮挡后面内容
			},100);
		}
	}
	//点击关闭当前,显示原内容
	i_close.onclick = function(){
		oCon.style.top = "200px";
		setTimeout(function(){
			oI.style.display = "none";
		},1000);	//1秒后恢复
	};
	//第二层选项切换
	for(var i=0;i<length;i++){
		oBtn[i].index = i;
		oBtn[i].onmouseenter = function(){
			visible(this.index);	//当前序号
		}
	}
	//改变内容的函数
	function visible(x){
		var y;
		oBtn[index].className = "";	
		oLi[index].className = "";	//清空类名隐藏
		index = x;		//改变当前序号
		oBtn[index].className = "on";
		oLi[index].className = "on";//添加类名显示

		y=(x>1)?index*47+1:index*47;
		i_border.style.left =  y + "px";//头顶滚动条
	}
}();
/*-------------------
	sec1倒计时
-------------------*/
+function(){
	var oSpan = document.querySelectorAll(".main-sec1 .title-right span");
	setInterval(function(){
		var now = new Date();
		var time = new Date(2018,1,16);     //距离时间，月份加1
		var hh = Math.floor((time-now)/1000/60/60)%24;  //模24小时
		var min = Math.floor((time-now)/1000/60)%60;    //模60分钟
		var ss = Math.floor((time-now)/1000)%60;        //模60秒
		
		oSpan[0].innerHTML = add(hh);
		oSpan[1].innerHTML = add(min);
		oSpan[2].innerHTML = add(ss);
	},1000);
	function add(x){
		return x<10?"0"+x:""+x;     //返回两位数，并且为字符串
	}
}();
/*-------------------
	sec1商品轮播
-------------------*/
+function(){
	var oCon = document.querySelector(".main-sec1 .sec1-con");
	var oUl = oCon.querySelector(".con-left ul");
	var oBtn = oCon.querySelectorAll(".con-left .btn");
	var oImg = oCon.querySelectorAll(".con-right img");
	var oBtn2 = oCon.querySelectorAll(".con-right p i");
	var index = 0;	//右边的当前序号

	//左边轮播，调用时间版运动框架
	for(var i=0;i<2;i++){
		oBtn[i].index = i;
		oBtn[i].onclick = function(){
			var k = this.index?0:-2000;	//根据序号来确定左、右按钮
			move(oUl,{left:k},500,function(){
				oUl.style.left = "-1000px";
			})
		}
	}
	move(oImg[0],{opacity:1},500);	//初始显示

	//右边选项卡
	for(i=0;i<2;i++){
		oBtn2[i].index = i;
		oBtn2[i].onmouseenter = function(){
			var This=this.index;	//当前序号
			oBtn2[index].className = "";
			move(oImg[index],{opacity:0},500);
			index = This;	        //改变当前序号
			move(oImg[index],{opacity:1},500);
			oBtn2[index].className = "on";
			
		}
	}
}();
/*-------------------
	sec2轮播
-------------------*/
//”会买专辑“商品轮播
+function(){
	var oSec2 = document.getElementById("sec2"),
		oCon = oSec2.querySelector(".con2 .content"),
		oLi = oSec2.querySelectorAll(".con2 .content ul li"),
		oBtn = oSec2.querySelectorAll(".con2 .content .btn i"),
		oDiv = oSec2.querySelector(".con2 .content .btn2"),
		oBtn2 = oSec2.querySelectorAll(".con2 .content .btn2 i"),
		index = 0;	//当前显示的li序号

	//自动轮播
	var timer = setInterval(function(){
		var i = index;
		play(++i);
	},2000);

	//小按钮
	for(var i=0;i<oBtn.length;i++){
		oBtn[i].index = i;
		oBtn[i].onmouseenter = function(){
			play(this.index);
		}
	}
	//左右按钮
	oBtn2[0].onclick = function(){
		var i = index;
		play(--i);
	};
	oBtn2[1].onclick = function(){
		var i = index;
		play(++i);
	};

	//鼠标移动到上面时
	oCon.onmouseenter = function(){
		clearInterval(timer);
		oDiv.style.display = "block";
	};
	oCon.onmouseleave = function(){
		timer = setInterval(function(){
			var i = index;
			play(++i);
		},2000);
		oDiv.style.display = "none";
	};
	move(oLi[0],{opacity:1},500);

	//内容改变的函数
	function play(x){
		if(x>2){x=0}else if(x<0){x=2}
		oBtn[index].className = "";
		move(oLi[index],{opacity:0},500);
		index = x;
		move(oLi[index],{opacity:1},500);
		oBtn[index].className = "on";
	}
}();
//”排行榜“商品轮播
+function(){
	var oBtn = document.querySelectorAll("#sec2 .con3 .content .top a");
	var oDiv = document.querySelectorAll("#sec2 .con3 .content .bottom .b-con");
	var oLine = document.querySelector("#sec2 .con3 .content .line2");
	var index = 0;
	for(var i=0;i<oBtn.length;i++){
		oBtn[i].index = i;
		oBtn[i].onmouseenter = function(){
			oDiv[index].className = "b-con";
			index = this.index;
			oDiv[index].className = "b-con show";
			oLine.style.left =  index * 76 + 10 + "px";
		}
	}
}();
/*-------------------
	sec3商品轮播
-------------------*/
+function(){
	var sec3 = document.getElementById("sec3"),
		oUl = sec3.querySelector(".con2 .con3"),
		oLi = sec3.querySelectorAll(".con2 ul li"),
		oTab = sec3.querySelectorAll(".tab i"),
		oBtn = sec3.querySelectorAll(".btn i"),
		index = 0,
		length = oLi.length;
	var timer = null;
	//tab按钮
	for(var i=0;i<length;i++){
		oTab[i].index = i;
		oTab[i].onmouseenter = function(){
			change(this.index);
		}
	}
	//左右按钮
	for(i=0;i<2;i++){
		oBtn[i].index = i;
		oBtn[i].onclick = function(){
			var x = index;
			if(this.index){
				x = ++x%length;
			}else{
				if(--x<0){x = length-1}
			}
			change(x);
		}
	}
	//停止轮播
	oUl.onmouseenter = function(){clearInterval(timer)};

	//开始轮播
	oUl.onmouseleave = function(){timer = setInterval(auto,2000)};

	//自动轮播
	timer = setInterval(auto,2000);
	function auto(){
		var x = index;
		x = ++x%length;
		change(x);
	}

	//变化函数
	function change(x){
		oLi[index].className = "";
		oTab[index].className = "";
		index = x;
		oLi[index].className = "on";
		oTab[index].className = "on";
	}
}();
/*-------------------
	sec5商品轮播
-------------------*/
+function(){
	var oSec = document.getElementById("sec5"),
		oUl = oSec.querySelector(".sec5-con .con3 .video"),
		oLi = oUl.querySelectorAll(".img li img"),
		oP = oUl.querySelectorAll(".wrap ul li"),
		oTab = oUl.querySelectorAll(".tab i"),
		oBtn = oUl.querySelectorAll(".btn span"),
		index = 0,
		length = oLi.length;
	var timer = null;
	
	//tab按钮
	for(var i=0;i<length;i++){
		oTab[i].i = i;
		oTab[i].onmouseenter = function(){change(this.i)}
	}
	//左右按钮
	for(i=0;i<2;i++){
		oBtn[i].index = i;
		oBtn[i].onclick = function(){
			var x = index;
			if(this.index){
				x = ++x%length;
			}else{
				if(--x<0){x = length-1}
			}
			change(x);
		}
	}

	//停止轮播
	oUl.onmouseenter = function(){clearInterval(timer)};

	//开始轮播
	oUl.onmouseleave = function(){timer = setInterval(auto,2000)};

	//自动轮播
	timer = setInterval(auto,2000);
	function auto(){
		var x = index;
		x = (++x)%length;
		change(x);
	}

	change(0);//初始显示
	//变化函数
	function change(x){
		oP[index].className = "";
		oTab[index].className = "";
		move(oLi[index],{opacity:0},500);
		index = x;
		move(oLi[index],{opacity:1},500);
		oP[index].className = "on";
		oTab[index].className = "on";
	}
}();
/*-------------------
  sec7、sec9商品轮播
-------------------*/
+function(){
	var sec7 = document.getElementById("sec7"),
		sec9 = document.getElementById("sec9"),
		sec1 = sec7.querySelector(".sec7-con1 .left .con4 ul"),
		sec2 = sec7.querySelector(".sec7-con1 .right .con4 ul"),
		sec3 = sec7.querySelector(".sec7-con2 .left .con4 ul"),
		sec4 = sec7.querySelector(".sec7-con2 .right .con4 ul"),
		sec5 = sec9.querySelector(".sec7-con3 .left .con4 ul"),
		sec6 = sec9.querySelector(".sec7-con3 .right .con4 ul"),

		oBtn_1 = sec7.querySelectorAll(".sec7-con1 .left .con4 .btn span"),
		oBtn_2 = sec7.querySelectorAll(".sec7-con1 .right .con4 .btn span"),
		oBtn_3 = sec7.querySelectorAll(".sec7-con2 .left .con4 .btn span"),
		oBtn_4 = sec7.querySelectorAll(".sec7-con2 .right .con4 .btn span"),
		oBtn_5 = sec9.querySelectorAll(".sec7-con3 .left .con4 .btn span"),
		oBtn_6 = sec9.querySelectorAll(".sec7-con3 .right .con4 .btn span");
	
	//创建6个小轮播
	play(sec1,oBtn_1);
	play(sec2,oBtn_2);
	play(sec3,oBtn_3);
	play(sec4,oBtn_4);
	play(sec5,oBtn_5);
	play(sec6,oBtn_6);

	function play(ul,obj){
		var now = 0;
		for(var i=0;i<2;i++){
			obj[i].index = i;
			obj[i].onclick = function(){
				if(this.index){
					if(++now>2){now = 0}
				}else{
					if(--now<0){now = 2}
				}
				move(ul,{left:(-now *  285 + 10)},500);
			}
		}
	}
}();

/*-------------------
  图片懒加载
-------------------*/
$(function(){
    var $img = $("img");

    $img.each(function(){
        $(this).attr("data-original",$(this).prop("src")).prop("src","");
    });

    $img.lazyload({
        threshold : 50,     //提前显示
        effect : "fadeIn",      //淡入效果
        skip_invisible : false, //加载隐藏图片
        failure_limit : 10      //当图像不连续时，控制加载行为，令插件找到 10 个不在可见区域的图片时才停止搜索
    });
});