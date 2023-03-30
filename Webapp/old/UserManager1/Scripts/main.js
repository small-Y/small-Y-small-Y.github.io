//主程序入口
$(document).ready(function () {
	App.init();
	App.addResizeHandler(function(){
		var height=($(window).height()-120);
		$("#TreeView1").css('height', height-20);
		$("#TreeView2").css('height', height-20);
		$("#TreeView3").css('height', height-20);
		$("#tab_1_1").css('height', height+10);
		$("#tab_1_2").css('height', height+10);
		$(".table-scrollable").css({height:(height-88),overflow:"auto"});
	});
	App.runResizeHandlers();
	App.load();
	//
    $("#startingCover").remove();
	$("#mainFrame").show();
});
