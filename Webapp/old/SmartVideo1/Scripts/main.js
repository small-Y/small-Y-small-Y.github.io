//主程序入口
$(document).ready(function () {
	App.init();
	App.addResizeHandler(function(){
		var height=($(window).height()-120);
		$("#videolist").css('height', height+17);
		$("#playVideo").css('height', height-67);
		$("#playVideo").find('img').css('max-height', height-67);
	});
	App.runResizeHandlers();
	App.load();
	//
    $("#startingCover").remove();
	$("#mainFrame").show();
});
