//睡眠函数
function sleep(time){
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while(true){
        if (new Date().getTime() > endTime){
            return;
        } 
    }
}   

