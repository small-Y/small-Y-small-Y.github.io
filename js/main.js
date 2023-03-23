//改变轮播窗口大小
var LWidth = document.documentElement.clientWidth-20;
var LHeight = document.documentElement.clientHeight-20;

$(".banner").css({width:LWidth, height:LHeight});
$(".banner .img").css({width:LWidth*7, height:LHeight,left:-LWidth});
$(".banner .img img").css({width:LWidth, height:LHeight});


//轮播索引
var index =1;
var $div_img =$(".banner .img");
var $div_img_width =$(".banner .img").width()/7;





//轮播定时器

var timeer = setInterval(changeImage,2500);
function changeImage(){
    index++;
    $(".indicator span").removeClass("cur");
    $(".indicator span").eq(index-1).addClass("cur");
    if(index == 6){
        $(".indicator span").removeClass("cur");
        $(".indicator span").eq(0).addClass("cur");
    }
    $div_img.finish().animate({
        left :-$div_img_width*index
    },1000,function(){
        if(index >= 6){
            index =0;
            $(this).css("left",-$div_img_width);
            $(".indicator span").removeClass("cur");
            $(".indicator span").eq(index).addClass("cur");
        }
    });
}

//点击选择上下图片
$(".page span").hover(function(){
    //停止执行
    clearInterval(timeer);
},function(){
    //继续执行
    timeer = setInterval(changeImage,2500);
});


$(".page .next").click(function(){
    changeImage();
});
$(".page .prev").click(function(){
    index --;
    $(".indicator span").removeClass("cur");
    $(".indicator span").eq(index).addClass("cur");
    $div_img.finish().animate({
            left :-$div_img_width*index
        },500,function(){
            if(index <=0){
                index =5;
                $(this).css("left",-$div_img_width*index);
            }
        });	
});
//页面指示器
$(".indicator span").mouseenter(function(){
    //切换图片
    index= $(this).index()+1;
    clearInterval(timeer);
    $div_img.css("left",-$div_img_width*index);
});