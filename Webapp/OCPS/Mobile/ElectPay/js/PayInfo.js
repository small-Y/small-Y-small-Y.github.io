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
//主程序入口
$(document).ready(function () {
    $("body").html('<div class="weui_panel_bd">'
        +'<a href="javascript:void(0);" class="weui_media_box weui_media_appmsg">'
        +'     <div class="weui_media_hd">'
        +'      <i class="weui_icon_msg weui_icon_success paySuccess"></i>'
        +'     </div>'
        +'    <div class="weui_media_bd">'
        +'      <h1 class="weui_media_title">支付成功</h1>'
        +'    </div>'
        +'  </a>'
        +'</div>'
        +'<div class="weui_cell">'
        +'          <div class="weui_cell_bd weui_cell_primary" style="text-align: center;">'
        +'            <strong>公寓预付费微信充值平台</strong>'
        +'          </div>'
        +'</div>'

        +'<div class="weui_cell weui_cell_info">'
        +'           <div class="weui_cell_bd weui_cell_primary">'
        +'            <div class="weui_cells_title">房间名称</div>'
        +'          </div>'
        + '          <div class="weui_cell_ft weui_cell_ft_pay"  id="ReceiveUserName">离线</div>'
        +'</div>'
        +'<div class="weui_cell weui_cell_info">'
        +'          <div class="weui_cell_bd weui_cell_primary">'
        +'            <div class="weui_cells_title">充值金额</div>'
        +'         </div>'
        + '         <div class="weui_cell_ft weui_cell_ft_pay"  id="AmountPay">离线</div>'
        +'</div>'
        +'<div class="weui_cell weui_cell_info">'
        +'           <div class="weui_cell_bd weui_cell_primary">'
        +'            <div class="weui_cells_title">充值前金额</div>'
        +'          </div>'
        + '          <div class="weui_cell_ft weui_cell_ft_pay"  id="PreBalance">离线</div>'
        +'</div>'
        +'<div class="weui_cell weui_cell_info">'
        +'           <div class="weui_cell_bd weui_cell_primary">'
        +'            <div class="weui_cells_title">充值后金额</div>'
        +'          </div>'
        + '          <div class="weui_cell_ft weui_cell_ft_pay"  id="Balance">离线</div>'
        + '</div>'
        + '<div class="weui_cell weui_cell_info">'
        + '           <div class="weui_cell_bd weui_cell_primary">'
        + '            <div class="weui_cells_title">充值完成时间</div>'
        + '          </div>'
        + '          <div class="weui_cell_ft weui_cell_ft_pay"  id="CompleteTime">离线</div>'
        + '</div>'
        +'<div class="weui_cell" >'
        + '</div>'
        + '<div class="weui_cell_info">'
        + '	<h1 style="text-align:right;" id="remaining">离线</h1>'
        + '</div>'
        );

    $.ajax({
        type: 'post',
        url: "srv/GetPayInfo.tjs",
        dataType: "json",
        data: { "PayID": PayID },
        error: function (result) {
            $.hideLoading();
            window.location.href = "/Webapp/Payment/Mobile/ElectPay";
        },
        success: function (result) {
            $.hideLoading();
            if (result.success) {
                $("#ReceiveUserName").text(result.ReceiveUserName.split(".").slice(1).join("."));
                $("#AmountPay").text(result.AmountPay);
                $("#PreBalance").text(result.PreBalance);
                $("#Balance").text(result.Balance);
                $("#remaining").text(result.remaining);
                $("#CompleteTime").text(result.CompleteTime);

            } else {
                $.toast(result.msg, "forbidden");

            }
                   }
    });


});