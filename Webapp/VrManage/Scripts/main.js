﻿//主程序入口
$(document).ready(function () {
    App.init();
	App.addResizeHandler(function(){
		var height=($(window).height()-55);
		$("#profile1").css('height', height);
		$("#profile2").css('height', height-57);
		$("#tab_1_1").css('height', height-65);
		$("#tab_1_2").css('height', height-65);
		$(".table-scrollable").css({height:(height-100),overflow:"auto"});
	});
	App.runResizeHandlers();
	App.load();
	//
	$("#startingCover").remove();
	$("#mainFrame").show();
});
