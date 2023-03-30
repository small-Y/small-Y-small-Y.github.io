//主程序入口
$(document).ready(function () {
	App.init();
	App.addResizeHandler(function(){
		var height=($(window).height()-120);
		$("#TreeView1").css('height', height-20);
		$("#TreeView2").css('height', height-20);
		$("#TreeView3").css('height', height-20);
		var height=($(window).height()-45);
		$("#profile").css('height', height-57);
		$("#tab_kpi").css('height', height-65);
		$("#tab_kvdb").css('height', height-65);
		$("#tab_rdc").css('height', height-65);
		$("#console").css('height', height-$('#tab_kvdb').find('.m-heading-1').height()-120);
		$("#recordset").css('height', height-$('#tab_rdc').find('.m-heading-1').height()-125);
	});
	App.runResizeHandlers();
	App.load();
	//
    $("#startingCover").remove();
	$("#mainFrame").show();
});
