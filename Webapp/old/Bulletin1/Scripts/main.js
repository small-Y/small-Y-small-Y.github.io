//主程序入口
$(document).ready(function () {
	App.init();
	App.addResizeHandler(function(){
		var height=($(window).height()-120);
		$("#bulletinList").css('height', height-15);
		$("#bulletinInfo").css('height', height+60);
	});
	App.runResizeHandlers();
	App.load();
	//
    $("#startingCover").remove();
	$("#mainFrame").show();
});
