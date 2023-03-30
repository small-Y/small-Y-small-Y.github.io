//
AddRoom = function (container, config) {
    return {
        init: function () {
            if (opcpath != "" && opcpath.split(".").length > 2) {
                TUI.env.mobile.backAppFrame(name, self.location.href.substring(0, self.location.href.indexOf("addRoom.tjs")) + "addRoom.tjs?opcpath=" + opcpath.split(".").slice(0, opcpath.split(".").length - 1).join("."), {});
            } else {
                 TUI.env.mobile.backAppFrame(name, self.location.href.substring(0, self.location.href.indexOf("index.tjs")), {});

               // window.location.href = "/Mobile/ElectPay/";

            }

            $.ajax({
                type: 'post',
                url: "srv/GetAllRoom.tjs",
                dataType: "json",
                data: { "opcpath": opcpath },
                error: function (result) {
                    window.location.href = "/Mobile/ElectPay/";
                },
                success: function (result) {
                    if (result.success) {

                        var len = result.gData.length;
                        //     var h = '<div class="article-list" style="overflow: auto; -webkit-overflow-scrolling: touch; ">';
                        var h = '<div class="main"><div class="message">';
                        if (len > 0) {
                            h += '<div class="weui_cells weui_cells_access" id="group_list">'
                            for (var i = 0; i < len; i++) {
                                //if (result.gData[i].szOPCFullName.split(".").length > 2) { 
                                //    TUI.env.mobile.setAppTitle(result.gData[i].szOPCFullName.split(".")[result.gData[i].szOPCFullName.split(".").length - 2]);
                                //}
                                h += ' <a class="weui_cell" href="javascript:;">'
                                h += '  <div class="weui_cell_bd weui_cell_primary  group" id="' + result.gData[i].szOPCFullPath + '">'
                                h += '  <p>' + result.gData[i].szOPCFullName.split(".")[result.gData[i].szOPCFullName.split(".").length - 1] + '</p>'
                                h += ' </div>'
                                h += '<div class="weui_cell_ft">'
                                h += ' </div>'
                                h += ' </a>'
                            }

                            h += '  </div>';
                        }
                        var llen = result.nData.length;


                        if (llen > 0) {
                            h += '   <div class="weui_cells weui_cells_radio"  id="room_list" >'
                            for (var ii = 0; ii < llen; ii++) {
                                h += ' <label class="weui_cell weui_check_label" for="x' + ii + '">'
                                if (result.nData[ii].bOnLineFlag == "在线") {
                                    h += '<img src="css/images/red.png" height="20px" width="20px" style="vertical-align: middle;">'
                                } else {
                                    h += '<img src="css/images/gray.png" height="20px" width="20px" style="vertical-align: middle;">'

                                }
                               // h += ' <p>' + result.nData[ii].bOnLineFlag + '</p>'
                                h += ' <div class="weui_cell_bd weui_cell_primary" id="' + result.nData[ii].szOPCFullPath + '" data-name="' + result.nData[ii].szOPCFullName + '">'

                                h += ' <p>' + result.nData[ii].szOPCFullName.split(".")[result.nData[ii].szOPCFullName.split(".").length - 1] + '</p>'
                                h += ' </div>'

                                h += ' <div class="weui_cell_ft">'
                                h += ' <input type="radio" class="weui_check" name="radio1" id="x' + ii + '" data-key="' + result.nData[ii].szOPCFullPath + '" >'
                                h += ' <span class="weui_icon_checked"></span>'
                                h += ' </div>'

                                h += ' </label>'
                                //  h += '  <p>余额：' + result.nData[ii].remaining + ' 元</p>'
                            }
                            h += '  </div>';
                        }
                        h += '  </div></div>';

                        $("body").html(h);

                        $("#group_list").css("margin-top", 0);
                        if (len == 0) {
                            $("#room_list").css("margin-top", 0);
                        }

                        $('#group_list').find(".weui_cell_bd.weui_cell_primary.group").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                            if (self.location.href.indexOf("addRoom.tjs") > 0) {
                                TUI.env.mobile.openAppFrame($(this).text(), self.location.href.substring(0, self.location.href.indexOf("addRoom.tjs")) + "addRoom.tjs?opcpath=" + $(this).attr("id"));

                                //TUI.env.mobile.openAppFrame($(this).text(), self.location.href.substring(0, self.location.href.indexOf("addRoom.tjs")) + "addRoom.tjs?opcpath=" + $(this).attr("id"), {
                                //    backurl: self.location.href.substring(0, self.location.href.indexOf("addRoom.tjs")) + "addRoom.tjs?opcpath=" + $(this).attr("id").split(".").slice(0, $(this).attr("id").split(".").length-1).join("."),

                                // ok: "确定",
                                // handle: this,
                                //fn: function (e) {

                                // }
                                //});


                            } else {
                                TUI.env.mobile.openAppFrame($(this).text(), self.location.href + "addRoom.tjs?opcpath=" + $(this).attr("id"));
                            }




                            return false;
                        });
                        $('#room_list').find(".weui_cell_bd.weui_cell_primary").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                            // TUI.env.AddRoom.SaveMyRoom($(this).attr("id"), $(this).data("name"));

                            $.showLoading("房间绑定中");
                            //$("input[type=checkbox]:checked")
                            //$("input[type=radio]:checked")
                            //var al = $("input[type=radio]:checked");
                            //roomList = "";
                            //for (var i = 0, len = al.length; i < len; i++) {
                            //    roomList += $(al[i]).data("key") + ",";
                            //}
                            //roomList = roomList.substring(0, roomList.length - 1);

                            $.ajax({
                                type: 'post',
                                url: "srv/SaveMyRoom.tjs",
                                dataType: "json",
                                data: { "roomList": $(this).attr("id"), "userID": TUI.env.us.userID, "roomName": $(this).data("name") },
                                error: function (result) {
                                    $.hideLoading();
                                    window.location.href = "/Mobile/ElectPay/";
                                },
                                success: function (result) {
                                    $.hideLoading();
                                    if (result.success) {
                                        //$.alert("绑定成功！", "成功！");
                                        $.toast("绑定成功");

                                    } else {

                                        $.toast(result.msg, "forbidden");

                                        //$.alert("绑定失败！", "失败！");
                                    }

                                }
                            });


                            return false;
                        });


                    } else {

                        window.location.href = "/Mobile/ElectPay/";
                    }
                }
            });
            //  this.updateToken();
        },
        SaveMyRoom: function (roomList, roomName) {

            $.showLoading("房间绑定中");
            //$("input[type=checkbox]:checked")
            //$("input[type=radio]:checked")
            //var al = $("input[type=radio]:checked");
            //roomList = "";
            //for (var i = 0, len = al.length; i < len; i++) {
            //    roomList += $(al[i]).data("key") + ",";
            //}
            //roomList = roomList.substring(0, roomList.length - 1);

            $.ajax({
                type: 'post',
                url: "srv/SaveMyRoom.tjs",
                dataType: "json",
                data: { "roomList": roomList, "userID": TUI.env.us.userID, "roomName": roomName },
                error: function (result) {
                    $.hideLoading();
                    window.location.href = "/Mobile/ElectPay/";
                },
                success: function (result) {
                    $.hideLoading();
                    if (result.success) {
                        //$.alert("绑定成功！", "成功！");
                        $.toast("绑定成功");

                    } else {

                        $.toast(result.msg, "forbidden");

                        //$.alert("绑定失败！", "失败！");
                    }

                }
            });

        },
        show: function (speed) {
            TUI.env.status = "Mobile";
        },
        hide: function (speed) {

        }
    }
}
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
            TUI.env.AddRoom = new AddRoom();
            TUI.env.AddRoom.init();
            TUI.env.AddRoom.show("normal");
        }
    });

});

//setTimeout(function () {
//    $.hideLoading();
//}, 3000)

//$(document).on("click", "#show-toast", function () {
//    $.toast("操作成功", function () {
//        console.log('close');
//    });
//})
//.on("click", "#show-toast-cancel", function () {
//    $.toast("取消操作", "cancel", function (toast) {
//        console.log(toast);
//    });
//})
//.on("click", "#show-toast-forbidden", function () {
//    $.toast("禁止操作", "forbidden");
//})
//.on("click", "#show-toast-text", function () {
//    $.toast("纯文本", "text");
//})

//$(document).on("click", "#show-alert", function () {
//    $.alert("AlphaGo 就是天网的前身，人类要完蛋了！", "警告！");
//});
//$(document).on("click", "#show-confirm", function () {
//    $.confirm("您确定要删除文件<<苍井空全集>>吗?", "确认删除?", function () {
//        $.toast("文件已经删除!");
//    }, function () {
//        //取消操作
//    });
//});
//$(document).on("click", "#show-prompt", function () {
//    $.prompt("名字不能超过6个字符，不得出现不和谐文字", "输入姓名", function (text) {
//        $.alert("您的名字是:" + text, "角色设定成功");
//    }, function () {
//        //取消操作
//    });
//});
//$(document).on("click", "#show-custom", function () {
//    $.modal({
//        title: "Hello",
//        text: "我是自定义的modal",
//        buttons: [
//          { text: "支付宝", onClick: function () { $.alert("你选择了支付宝"); } },
//          { text: "微信支付", onClick: function () { $.alert("你选择了微信支付"); } },
//          { text: "取消", className: "default" },
//        ]
//    });
//});