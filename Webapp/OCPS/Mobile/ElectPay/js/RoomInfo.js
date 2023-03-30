//
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
RoomInfo = function (container, config) {
    return {
        init: function () {
            this.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");

            TUI.env.mobile.backAppFrame(name, self.location.href.substring(0, self.location.href.indexOf("index.tjs")), {});
            $("body").html('<div class="main"><div class="message weui-pull-to-refresh">'
		                     + '<div class="weui-pull-to-refresh-layer">'
		                     + '	<div class="pull-to-refresh-arrow"></div>'
		                     + '	<div class="pull-to-refresh-preloader"></div>'
		                     + '	<div class="down">下拉刷新</div>'
		                     + '	<div class="up">释放刷新</div>'
		                     + '	<div class="refresh">正在刷新</div>'
		                     + '</div>'
                            + '<div class="weui_panel weui_panel_access">'
                            + '<div class="weui_panel_bd" id="main_info">'
                            + '</div>'
                            + '<div class="weui_panel weui_panel_access" >'
                            + ' <div class="weui_panel_hd weui_cells_access" style="font-size:16px;color:#666;">'
                            + '售退电记录'
                            + '</div>'
                            + '     <div class="weui_panel_bd charge_info" id="charge_info">'
                            + '     </div>'
                            + '</div>'
                            + '</div>'
                            + '<div class="weui-infinite-scroll"><div class="infinite-preloader"></div>'
                            + '  正在加载'
                            + '</div></div>'
                            + ' </div>');

            $("#charge_info").html('<div style="width:100%;overflow: auto;-Webkit-overflow-scrolling: touch;">'
                + '    <ul></ul>'
                + '</div>'
                );
            $('.message').pullToRefresh().on("pull-to-refresh", function () {
                // FUI.env.myapp.readMessage();
                TUI.env.RoomInfo.GetRoomInfo(opcpath);
                TUI.env.RoomInfo.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
                $("#charge_info").find("ul").empty();
                TUI.env.RoomInfo.getChargeDetail(opcpath, TUI.env.RoomInfo.startDate);
                $('.message').pullToRefreshDone();
            });

            this.loading = false;
            $('.message').infinite().on("infinite", function () {
                if (TUI.env.RoomInfo.loading) return;
                TUI.env.RoomInfo.loading = true;
                TUI.env.RoomInfo.getChargeDetail(opcpath,TUI.env.RoomInfo.startDate);
            });


            this.GetRoomInfo(opcpath);
            this.getChargeDetail(opcpath, this.startDate);

        },
        GetRoomInfo: function (opcpath) {
           
            $.ajax({
                type: 'post',
                url: "srv/GetRoomInfo.tjs",
                dataType: "json",
                data: { "opcpath": opcpath },
                error: function (result) {
                    $.toast("网络异常", "forbidden");
                },
                success: function (result) {
                    var OnLineFlag = (result.bOnLineFlag == true ? "在线" : "离线");
                    var img = "";
                    if (OnLineFlag == "在线") {
                        img = '<img src="css/images/red.png" height="20px" width="20px" style="vertical-align: middle;">'
                    } else {
                        img = '<img src="css/images/gray.png" height="20px" width="20px" style="vertical-align: middle;">'

                    }

                    $("#main_info").html('<div class="msg-list">'
                    + ' <div class="weui_panel_hd weui_cells_access" style="font-size:16px;color:#666;">'
                    + result.szOPCFullName.split(".").slice(1).join(".") + '<span class="weui_cell_ft" style="float:right"></span>'
                    + '</div>'
                    + '   <div class="weui_panel_bd">'
                    + '        <div class="weui_media_box">'
                    + '            <div class="weui_media_bd">'
                    + '               <table border="1" bordercolor="#eee"> <tbody>'
                    + '                 <tr><td width="80px">在线状态</td><td>' + OnLineFlag + '</td></tr>'
                    + '                 <tr><td width="80px">电表余额</td><td class="remaining">' + result.remaining + '&nbsp;&nbsp;元</td></tr>'
                    + '                 <tr><td width="80px">上月用电</td><td>' + result.lastData + '&nbsp;&nbsp;元</td></tr>'
                    + '                 <tr><td width="80px">本月用电</td><td>' + result.Data + '&nbsp;&nbsp;元</td></tr>'
                    + '                 <tr><td width="80px">监测时间</td><td>' + result.DataTime + '</td></tr>'
                    + '                 <tr><td colspan="2"><a href="javascript:;" class="weui_btn weui_btn_warn payment">充值</a></td></tr>'
                    + '              </tbody></table>'
                    + '        </div>'
                    + '    </div>'
                    + '</div>'

                  + '</div>');
                    $(".remaining").css("color", "red");
                    $('.msg-list').find(".weui_btn.weui_btn_warn.payment").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {

                        TUI.env.mobile.openAppFrame($(this).text(),  self.location.href.substring(0, self.location.href.indexOf("RoomInfo.tjs"))+ "Payment.tjs?opcpath=" + opcpath);

                    })
                   
                }
            });
        
        },
        getChargeDetail: function (opcpath, startDate) {
            $.ajax({
                type: 'post',
                url: "srv/getChargeDetail.tjs",
                dataType: "json",
                data: { "opcpath": opcpath, "TOP": 8, "startDate": startDate, "endDate": "" },
                error: function (result) {
                    $.toast("网络异常", "forbidden");
                },
                success: function (result) {
                    if (result.success) {
                        TUI.env.RoomInfo.startDate = result.endDate;

                        for (var i = 0, len = result.Data.length; i < len; i++) {
                            
                            $("#charge_info").find("ul").append('<li class="li-msg">'
                                                                    + '	<div class="item-msg">'
                                                                    + '		<div class="imsg-icon two">'
                                                                    + '			<div class="content bg-color-blue"></div>'
                                                                    + '		</div>'
                                                                    + '		<div class="imsg-line "></div>'
                                                                    + '		<div class="imsg-allow two"></div>'
                                                                    + '		<div class="imsg-content two">' + result.Data[i].RecordDateTime + ' ' + result.Data[i].DoType + '' + result.Data[i].AmmeterData + '元。</div>'
                                                                    + '	</div>'
                                                                    + '</li>'
                                                                    );
                        }

                    }
                    TUI.env.RoomInfo.loading = false;
                }
            });

        },
        show: function (speed) {
            TUI.env.status = "Mobile";
        },
        hide: function (speed) {

        }
    };
};
//
//主程序入口
$(document).ready(function () {

    $.ajax({
        type: 'get',
        url: "/System/srv/login.ejs",
        dataType: "json",
        error: function (result) {
            window.location.href = "/ElectPay/";
        },
        success: function (result) {
            TUI.env.mobile = null;
            if (window != top && top.TUI) {
                TUI.env.mobile = top.TUI.env.mobile;
            }

            //初始化用户信息
            TUI.env.us = result;
            //
            TUI.env.RoomInfo = new RoomInfo();
            TUI.env.RoomInfo.init();
            TUI.env.RoomInfo.show("normal");
        }
    });
    //  <div class="weui-pull-to-refresh-layer">
    //  <div class="pull-to-refresh-arrow"></div>
    //  <div class="pull-to-refresh-preloader"></div>
    //  <div class="down">下拉刷新</div>
    //  <div class="up">释放刷新</div>
    //  <div class="refresh">正在刷新</div>
    //</div>
    //$(document.body).pullToRefresh().on("pull-to-refresh", function () {
    //    setTimeout(function () {
    //        //TUI.env.RoomInfo = new RoomInfo();
    //        //TUI.env.RoomInfo.init();
    //        //TUI.env.RoomInfo.show("normal");
    //        $("#time").text(new Date);
    //        $(document.body).pullToRefreshDone();
    //    }, 2000);
    //});
    //document.body.ontouchmove = function (e) {
    //    e.preventDefault();
    //};





});