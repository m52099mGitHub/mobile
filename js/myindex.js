// JavaScript Document
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
/*图片预加载*/
function fnLoad()
{
	var iTime=new Date().getTime();
	var oW=id("welcome");
	var arr=[""];
	var bImgLoad=true;
	var bTime=false;
	var oTimer=0;
	bind(oW,"webkitTransitionEnd",end);
	bind(oW,"transitionend",end);
	oTimer=setInterval(function(){
		if(new Date().getTime()-iTime>=5000)
		{
			bTime=true;
		}	
		if(bImgLoad&&bTime)
		{
			clearInterval(oTimer);
			oW.style.opacity=0;
		}
	},1000);
	function end()
	{
		removeClass(oW,"pageShow");
		fnTab();
	}
	/*for(var i=0;i<arr.length;i++)
	{
		var oImg=new Image();
		oImg.src=arr[i];
		oImg.onload=function()
		{
			
		}
		
	}*/
}

//图片切换按钮
function fnTab()
{
	var oTab=id("tabPic");//图片
	var oList=id("picList");
	var aNav=oTab.getElementsByTagName("nav")[0].children;
	var iNow=0;//当前选中图片
	var iX=0;//
	var iW=view().w;//640px,屏幕宽度
	var oTimer=0;//定时器
	var iStartTouchX=0;//手指
	var iStartX=0;
	bind(oTab,"touchstart",fnStart);
	bind(oTab,"touchmove",fnMove);
	bind(oTab,"touchend",fnEnd);
	auto();
	if(!window.BfnScore)
	{
		fnScore();
		window.BfnScore=true;
	}
	function auto()//自动切换
	{
		oTimer=setInterval(function(){
			iNow++;	
			iNow=iNow%aNav.length;
			tab();
		},2000);
	}
	function fnStart(ev)//手指按下
	{
		oList.style.transition="none";
		ev=ev.changedTouches[0];//
		iStartTouchX=ev.pageX;//手指在屏幕上的位置
		iStartX=iX;
		clearInterval(oTimer);
	}
	function fnMove(ev)//手指移动
	{
		ev=ev.changedTouches[0];
		var iDis=ev.pageX-iStartTouchX;//手指滑动的距离
		iX=iStartX+iDis;
		oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
	}
	function fnEnd()//手指弹起
	{
		iNow=iX/iW;//
		iNow=-Math.round(iNow);
		if(iNow<0)
		{
			iNow=0;
		}
		if(iNow>aNav.length-1)
		{
			iNow=aNav.length-1;
		}
		tab();
		auto();
	}
	/*bind(document,"touchmove",function(){
		ev.preventDefault();
	});*/
	function tab()
	{
		iX=-iNow*iW;//x轴方向偏移
		oList.style.transition="0.5s";
		oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
		for(var i=0;i<aNav.length;i++)
		{
			removeClass(aNav[i],"active");
		}
		addClass(aNav[iNow],"active");
	}
}
function fnScore()
{
	var oScore=id("score");
	var aLi=oScore.getElementsByTagName("li");
	var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
	for(var i=0;i<aLi.length;i++)
	{
		fn(aLi[i]);
	}
	function fn(oLi)
	{
		var aNav=oLi.getElementsByTagName("a");
		var oInput=oLi.getElementsByTagName("input")[0];
		for(var i=0;i<aNav.length;i++)
		{
			aNav[i].index=i;
			bind(aNav[i],"touchstart",function(){
				for(var i=0;i<aNav.length;i++)
				{
					if(i<=this.index)
					{
						addClass(aNav[i],"active");
					}					
					else
					{
						removeClass(aNav[i],"active");
					}
				}
				oInput.value=arr[this.index];
			});
		}
	}

	fnIndex();
}

function fnInfo(oInfo,sInfo)//验证不通过时(未评论)
{
	oInfo.innerHTML=sInfo;//显示未评论信息
	oInfo.style.WebkitTransform=oInfo.style.transform="scale(1)";
	oInfo.style.opacity=1;
	setTimeout(function(){
		oInfo.style.WebkitTransform="scale(0)";
		oInfo.style.opacity=0;
	},1000);//未评论提示信息展示1秒
}
function fnIndex()
{
	var oIndex=id("index");
	var oBtn=oIndex.getElementsByClassName("btn")[0];
	var oInfo=oIndex.getElementsByClassName("info")[0];
	var bScore=false;
	bind(oBtn,"touchend",fnEnd);
	function fnEnd()
	{
		bScore=fnScoreChecked();
		if(bScore)
		{
			if(bTag())
			{
				fnIndexOut();		
			}
			else
			{
				fnInfo(oInfo,"给景区添加标签");	
			}
		}
		else
		{
			fnInfo(oInfo,"给景区评分");
		}
	}
	function fnScoreChecked()//评分选中
	{
		var oScore=id("score");
		var aInput=oScore.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++)
		{
			if(aInput[i].value==0)//有一项没评,value就为0,该项星星数为0
			{
				return false;//
			}
		}
		return true;
	}
	function bTag()
	{
		var oTag=id("indexTag");
		var aInput=oTag.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++)
		{
			if(aInput[i].checked)
			{
				return true;
			}
		}
		return false;
	}
}
function fnIndexOut()//遮罩
{
	var oMask=id("mask");
	var oIndex=id("index");
	var oNew=id("news");
	addClass(oMask,"pageShow");//显示遮罩
	addClass(oNew,"pageShow");
		fnNews();
	setTimeout(function(){
		oMask.style.opacity=1;	
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";
	},14);
	setTimeout(function(){
		oNew.style.transition="0.5s";
		oMask.style.opacity=0;	
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";	
		oNew.style.opacity=1;
		removeClass(oMask,"pageShow");
	},3000);//3s后新闻线索弹出
}
function fnNews()
{
	var oNews=id("news");
	var oInfo=oNews.getElementsByClassName("info")[0];
	var aInput=oNews.getElementsByTagName("input");
	aInput[0].onchange=function()
	{
		if(this.files[0].type.split("/")[0]=="video")//判断是否是video
		{
			fnNewsOut();
			this.value="";
		}
		else
		{
			fnInfo(oInfo,"请上传视频");//调用提示信息
		}
	};
	aInput[1].onchange=function()
	{
		if(this.files[0].type.split("/")[0]=="image")
		{
			fnNewsOut();
			this.value="";
		}
		else
		{
			fnInfo(oInfo,"请上传图片");
		}
	};
}
function fnNewsOut()//
{
	var oNews=id("news");
	var oForm=id("form");
	addClass(oForm,"pageShow");//
	oNews.style.cssText="";
	removeClass(oNews,"pageShow");
		formIn();
}
function formIn()//表单上传
{
	var oForm=id("form");
	var oOver=id("over");
	var aFormTag=id("formTag").getElementsByTagName("label");
	var oBtn=oForm.getElementsByClassName("btn")[0];
	var bOff=false;
	for(var i=0;i<aFormTag.length;i++)
	{
		bind(aFormTag[i],"touchend",function(){
			bOff=true;
			addClass(oBtn,"submit");
		});
	}
	bind(oBtn,"touchend",function(){
		if(bOff)
		{
			for(var i=0;i<aFormTag.length;i++)
			{
				aFormTag[i].getElementsByTagName("input")[0].checked=false;
			}
			bOff=false;
			addClass(oOver,"pageShow");
			removeClass(oForm,"pageShow");
			removeClass(oBtn,"submit");
			over();
		}
	});
}
function over()
{
	var oOver=id("over");
	var oBtn=oOver.getElementsByClassName("btn")[0];
	bind(oBtn,"touchend",function()
	{
		removeClass(oOver,"pageShow");
	});
}