﻿//主程序入口
$(document).ready(function () {
	App.init();
	App.addResizeHandler(function(){
		var height=($(window).height()-120);
		$("#userlist").css('height', height+17);
		$("#chatslist").css('height', height-70);
	});
	App.runResizeHandlers();
	App.load();
	//
    $("#startingCover").remove();
	$("#mainFrame").show();
});
