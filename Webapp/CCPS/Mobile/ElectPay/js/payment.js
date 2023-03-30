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
Payment = function (container, config) {
    return {
        init: function () {
            this.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            $("body").html('<div class="weui_cells weui_cells_form">'
                    + '<div class="weui_cell">'
                    + '  <div class="weui_cell_hd"><label class="weui_label">房间名</label></div>'
                    + ' <div class="weui_cell_bd weui_cell_primary">'
                    + '    <label id="room_name">房间名</label>'
                    + '  </div>'
                    + '</div>'
                    + '<div class="weui_cell">'
                    + '  <div class="weui_cell_hd"><label class="weui_label">剩余金额</label></div>'
                    + ' <div class="weui_cell_bd weui_cell_primary">'
                    + '    <label  id="room_remaining">0</label>'
                    + '  </div>'
                    + '</div>'
                    + '<div class="weui_cell">'
                    + '  <div class="weui_cell_hd"><label class="weui_label">充值金额</label></div>'
                    + ' <div class="weui_cell_bd weui_cell_primary">'
                    + '    <input class="weui_input" type="number" id="pay_money" placeholder="请输入充值金额">'
                    + '  </div>'
                    + '</div>'
                    + '<div class="weui_cell">'
                    + '</div>'
                    + '   <div class="weui_panel_bd">'
                    + '        <div class="weui_media_box">'
                    + '            <div class="weui_media_bd">'
                    + '               <table><tbody>'
                    + '                 <tr>'
                    + '                     <td width="10px"></td><td width="120px"><a href="javascript:;" class="weui_btn weui_btn_primary  pay_number" data-number="5">5元</a></td>'
                    + '                     <td width="120px"><a href="javascript:;" class="weui_btn weui_btn_primary  pay_number" data-number="10">10元</a></td>'
                    + '                     <td width="120px"><a href="javascript:;" class="weui_btn weui_btn_primary  pay_number" data-number="20">20元</a></td>'
                    + '                     <td width="10px"></td>'
                    + '                 </tr>'
                    + '                 <tr>'
                    + '                     <td width="10px"></td><td width="120px"><a href="javascript:;" class="weui_btn weui_btn_primary  pay_number" data-number="30">30元</a></td>'
                    + '                     <td width="120px"><a href="javascript:;" class="weui_btn weui_btn_primary  pay_number" data-number="50">50元</a></td>'
                    + '                     <td width="120px"><a href="javascript:;" class="weui_btn weui_btn_primary  pay_number" data-number="100">100元</a></td>'
                    + '                     <td width="10px"></td>'
                    + '                 </tr>'
                    + '              </tbody></table>'
                    + '        </div>'
                    + '    </div>'
                    + '</div>');
            $(".weui_cells.weui_cells_form").css("margin-top", 0);


            $('table').find(".weui_btn.weui_btn_primary.pay_number").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                $("#pay_money").val($(this).data('number'));
            });

            TUI.env.mobile.backAppFrame("房间信息",  self.location.href.substring(0, self.location.href.indexOf("Payment.tjs"))+ "RoomInfo.tjs?opcpath=" + opcpath, {});
            this.GetRoomInfo(opcpath);

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

                    $("#room_name").text(result.szOPCFullName.split(".").slice(1).join("."));
                    $("#room_remaining").text(result.remaining);
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
            TUI.env.Payment = new Payment();
            TUI.env.Payment.init();
            TUI.env.Payment.show("normal");
        }
    });

});