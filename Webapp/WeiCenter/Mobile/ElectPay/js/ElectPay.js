ElectPay = function (container, config) {
    return {
        init: function () {
            this.getMyRoom();
            //   TUI.env.mobile.updateToken();
        },
        //取得绑定的房间列表
        getMyRoom: function () {
			//


            var tHtml = '<div class="titlebar" data-path="addroom"  data-name="addroom"><span class="back"><i class="icon iconfont">&#xe610;</i>&nbsp;&nbsp;&nbsp;</span>'
                + '<span class="title"><b>我的房间</b></span></div>'
			+ '<div class="content">'
			+ '</div>'
            $("#tab_main").html(tHtml);
            //var addHtml = '<div class="weui_cells weui_cells_access" id="room_list">'
            //+ ' <a class="weui_cell" href="javascript:;">'
            //+ '  <div class="weui_cell_bd weui_cell_primary" id="add_room">'
            //+ '  <p>添加</p>'
            //+ ' </div>'
            //+ ' </a>'
            //+ '  </div>';


            var addHtml = '<div class="navAdd" id="add_room">'
                          + '<a href="javascript:;" id="show-actions" ><i class="icon iconfont" style="font-size:40px;color:#fff">&#xe616;</i></a>'
                        +'</div>';

            $.showLoading();
            $.ajax({
                type: 'post',
                url: "srv/GetMyRoom.tjs",
                dataType: "json",
                data: { "userID": TUI.env.us.userName },
                error: function (result) {
					debugger;
                    window.location.href = "/WebApp/CCPS/Mobile/ElectPay/";
                },
                success: function (result) {
                    //初始化用户房间信息
                    if (result.success) {
                        var len = result.data.length;
                        var h = '<div class="weui_cells weui_cells_access" id="room_list">'
                        for (var i = 0; i < len; i++) {
                            h += ' <a class="weui_cell" href="javascript:;">'
                            h += '  <div class="weui_cell_bd weui_cell_primary myRoom" id="' + result.data[i].T_RoomID + '">'
                            h += '  <p>' + result.data[i].T_RoomName.split(".").slice(1).join(".") + '</p>'
                            h += ' </div>'
                            h += ' <div   class="weui_icon_cancel_content" style="width:40px;text-align: right;"  data-roomID="' + result.data[i].T_RoomID + '"><div class="weui_icon_cancel"></div></div>'
                            h += ' </a>'
                        }

                        //h += ' <a class="weui_cell" href="javascript:;">'
                        //h += '  <div class="weui_cell_bd weui_cell_primary" id="add_room">'
                        //h += '  <p>添加</p>'
                        //h += ' </div>'
                        //h += ' </a>'
                        h += '  </div>';
                        h += '<div class="navAdd" id="add_room">'
                        h += '<a href="javascript:;" id="show-actions" ><i class="icon iconfont" style="font-size:40px;color:#fff">&#xe616;</i></a>'
                        h += '</div>';

                        $(".content").html(h);
                    } else {
                        $(".content").html(addHtml);
                    }
                    $("#room_list").css("margin-top", 0);

                    $('#room_list').find(".weui_icon_cancel_content").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                        // TUI.env.mobile.openAppFrame("绑定房间", self.location.href + "addRoom.tjs?opcpath=");
                        var roomID = $(this).data("roomID");
                        $.ajax({
                            type: 'post',
                            url: "srv/DelMyRoom.tjs",
                            dataType: "json",
                            data: { "userID": TUI.env.us.userName, "roomID": roomID },
                            error: function (result) {
                                $.hideLoading();
                                window.location.href = "/WebApp/CCPS/Mobile/ElectPay/";
                            },
                            success: function (result) {
                                $.hideLoading();
                                if (result.success) {
                                    //$.alert("绑定成功！", "成功！");
                                    $.toast("解绑成功", function () {
                                        window.location.href = "/WebApp/CCPS/Mobile/ElectPay/";

                                    });

                                } else {
                                    $.toast(result.msg, "forbidden");
                                    //$.alert("绑定失败！", "失败！");
                                }


                            }
                        });

                        return false;
                    });



                    $('#room_list').find(".weui_cell_bd.weui_cell_primary.myRoom").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                        TUI.env.ElectPay.roomInfo($(this).attr("id"), "房间信息");
                        return false;
                    });

                    $('#add_room').bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                        TUI.env.ElectPay.addRoom("", "");
                        return false;
                    });
                    $.hideLoading();
                }
            });

            $('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                //e.preventDefault();
                //  window.location.href = "/webmobile/";
                //TUI.env.mobile.closeApp();
                //return false;
				//alert(1);
				if (TUI.env.wx != undefined) {
					//alert(2);
                    window.location.href = document.referrer;
                } else {
                    try {
						//alert(3);
                        api.closeFrame();
                    } catch (ex) {
						//alert(ex.message)
                        window.location.href = document.referrer;
                    }
                }
                return false;
            });

        },
        addRoom: function (opcpath, name) {
            var Tname = "房间选择"
            if (name == "") { } else {
                Tname = name.split(".")[name.split(".").length - 1]
            }


            var tHtml = '<div class="titlebar" data-path="addroom"  data-name="addroom"><span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>'
                + Tname + '</b></span><span class="save"  style="float:right;padding:8px 10px 5px 10px;color:#ef4f4f;">绑定</span></div>'
                + '<div class="content">'
                + '</div>'
            $("#tab_main").html(tHtml);
            $.showLoading();
            $.ajax({
                type: 'post',
                url: "srv/GetAllRoom.tjs",
                dataType: "json",
                data: { "opcpath": opcpath },
                error: function (result) {
                    window.location.href = "/WebApp/CCPS/Mobile/ElectPay/";
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
                                h += '  <div class="weui_cell_bd weui_cell_primary  group" id="' + result.gData[i].szOPCFullPath + '" data-name="' + result.gData[i].szOPCFullName + '">'
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
                                h += ' <input type="radio" class="weui_check" name="radio1" id="x' + ii + '" data-key="' + result.nData[ii].szOPCFullPath + '" data-name="' + result.nData[ii].szOPCFullName + '">'
                                h += ' <span class="weui_icon_checked"></span>'
                                h += ' </div>'

                                h += ' </label>'
                                //  h += '  <p>余额：' + result.nData[ii].remaining + ' 元</p>'
                            }
                            h += '  </div>';
                        }
                        h += '  </div></div>';

                        $(".content").html(h);

                        $("#group_list").css("margin-top", 0);
                        if (len == 0) {
                            $("#room_list").css("margin-top", 0);
                        }

                        $('#group_list').find(".weui_cell_bd.weui_cell_primary.group").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                            TUI.env.ElectPay.addRoom($(this).attr("id"), $(this).data("name"));
                            return false;
                        });

                        $('.titlebar').find(".save").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {

                            var al = $("input[type=radio]:checked");
                            if (al.length != 1) {
                                $.toast("请选择一个房间！", "cancel");
                                return false;

                            }
                            $.ajax({
                                type: 'post',
                                url: "srv/SaveMyRoom.tjs",
                                dataType: "json",
                                data: { "roomList": al.data("key"), "userID": TUI.env.us.userName, "roomName": al.data("name") },
                                error: function (result) {
                                    $.hideLoading();
                                    window.location.href = "/WebApp/CCPS/Mobile/ElectPay/";
                                },
                                success: function (result) {
                                    $.hideLoading();
                                    if (result.success) {
                                        //$.alert("绑定成功！", "成功！");
                                        $.toast("绑定成功", function () {
                                            TUI.env.ElectPay.getMyRoom();
                                        });


                                    } else {

                                        $.toast(result.msg, "forbidden");

                                        //$.alert("绑定失败！", "失败！");
                                    }

                                }
                            });

                            return false;

                        })


                    } else {

                        window.location.href = "/WebApp/CCPS/Mobile/ElectPay/";
                    }
                    $.hideLoading();
                }

            });
            $('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                //TUI.env.ElectPay.setTitle($('.titlebar').data("path").split(".").slice(0, $('.titlebar').data("path").split(".").length - 1).join("."),
                //    $('.titlebar').data("name").split(".").slice(0, $('.titlebar').data("name").split(".").length - 1).join("."),
                //    $('.titlebar').data("name").split(".")[$('.titlebar').data("name").split(".").length - 1]);
                if (opcpath.split(".").length > 2 && opcpath != "") {
                    TUI.env.ElectPay.addRoom(opcpath.split(".").slice(0, opcpath.split(".").length - 1).join("."), name.split(".").slice(0, name.split(".").length - 1).join("."));
                } else {

                    TUI.env.ElectPay.getMyRoom();
                }

                return false;
            });
        },
        roomInfo: function (opcpath, name) {
            TUI.env.ElectPay.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");

            var tHtml = '<div class="titlebar" data-path="addroom"  data-name="addroom"><span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>充值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></span>'
                + '<span  style="float:right;padding:4px 15px 0px 10px;"> <a href="javascript:;" id="show-actions" ><i class="icon iconfont" style="font-size:22px;color:#ef4f4f">&#xe610;</i></a></span></div>'
                 + '<div class="content">'
                 + '</div>';

            $("#tab_main").html(tHtml);
            $('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                TUI.env.ElectPay.getMyRoom();
                return false;
            });


            $(".content").html(' <div class="weui_panel_bd">'
				+ ' <a href="javascript:void(0);" class="weui_media_box weui_media_appmsg"  style="padding: 0px 0px 0px 15px;">'
				+ ' <div class="weui_media_hd">'
				+ '   <img class="weui_media_appmsg_thumb" src="css/images/icon.png" alt="">'
				+ ' </div>'
				+ ' <div class="weui_media_bd">'
				+ '   <p class="weui_media_desc"  style="font-size:18px;">剩余金额</p>'
				+ ' </div>'
				+ '</a>'
				+ '<div class="weui_media_bd"  style="padding: 0px 0px 0px 15px;">'
				+ ' <span style="font-size:36px;" id="remaining">1000</span>'
				+ '</div>'
				+ '</div>'
				+ '<div class="weui_cell">'
				+ ' <div class="weui_cell_bd weui_cell_primary"><form action="#" onsubmit="return false;">'
				+ '    <input class="pay_money"   type="number" name="number" id="pay_money" placeholder="请输入充值金额,最小为1元">'
				+ '  </form> </div>'
				+ '</div>'

				+ '<div class="weui_cell  weui_cell_info" style="padding: 0px 0px 0px 0px;">'
				+ '<div class="weui_cell_bd weui_cell_primary">'
				+ ' <div class="weui_cells_title">房间名</div>'
				+ '</div>'
				+ ' <div class="weui_cell_ft weui_cell_ft_pay" id="roomName"></div>'
				+ '</div>'
					+ '<div class="weui_cell weui_cell_info">'
				+ '<div class="weui_cell_bd weui_cell_primary">'
				+ ' <div class="weui_cells_title">房间状态</div>'
				+ '</div>'
				+ ' <div class="weui_cell_ft weui_cell_ft_pay"  id="OnLineFlag">在线</div>'
				+ '</div>'
					+ '<div class="weui_cell weui_cell_info">'
				+ '<div class="weui_cell_bd weui_cell_primary">'
				+ ' <div class="weui_cells_title">监测时间</div>'
				+ '</div>'
				+ ' <div class="weui_cell_ft  weui_cell_ft_pay" id="dataTime"></div>'
				+ '</div>'
				+ '<div class="weui_cell_bd weui_cell_primary" style="padding: 0px 10px 0px 10px;">'
				
				+ '	<form action="http://pay.bjut.edu.cn/payment/pay/payment_appPay.action" method="post" id="sb_pay">'
				+ '		<input type="hidden" name="sign" id="sign" value=">">'
				+ '		<input type="hidden" name="sysid" id="sysid" value="">'
				+ '		<input type="hidden" name="data" id="data" value="">'
				+ '		<input type="hidden" name="subsysid"   id="subsysid" value="">'
				//+ '		<input type="submit">'
				+ '	</form>'

				+ '<a href="javascript:;" class="weui_btn weui_btn_warn payment"  >充值</a>'
				+ '</div>'
            );
            this.getPayRoomInfo(opcpath);

            $('#show-actions').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                $.actions({
                    onClose: function () {
                        console.log("close");
                    },
                    actions: [
                      {
                          text: "充值记录",
                          className: "color-primary",
                          onClick: function () {
                              TUI.env.ElectPay.getRoomCharge(opcpath, new Date().Format("yyyy-MM-dd hh:mm:ss"));
                          }
                      },
                      {
                          text: "消费记录",
                          className: "color-warning",
                          onClick: function () {
                              TUI.env.ElectPay.getConsume(opcpath);
                          }
                      }
                    ]
                });
                return false;
            });

            $('.content').find(".weui_btn.weui_btn_warn.payment").bind('click', { handle: this }, function (e) {
                var payMoney = $("#pay_money").val();
				$.showLoading();

                var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                if (!isNum.test(payMoney)) {
                    //$.toast("输入的金额有误！", "cancel");
					$.hideLoading();
                    $.alert("输入的金额有误!", "错误！");
                    return;
                }

                if (parseFloat(payMoney) < 0.01 || parseFloat(payMoney) > 200) {
                    // $.toast("单笔限额为0.01元到200元！", "cancel");
                    $.alert("单笔限额为0.01元到200元!", "错误！");
					$.hideLoading();
                    return;
                }



                $.ajax({
                    type: 'post',
                    url: "srv/RequestPay.tjs",
                    dataType: "json",
                    data: { "userID": TUI.env.us.userName, "roomID": opcpath, "roomName": TUI.env.ElectPay.roomName, "payMoney": payMoney },
                    error: function (result) {
						$.hideLoading();
                        $.toast("网络异常", "forbidden");
                    },
                    success: function (result) {

                        if (result.success) {
							//赋值
							$("input[name='sign']").val(result.sign);
							$("input[name='sysid']").val(result.sysid);
							$("input[name='data']").val(result.data);
							$("input[name='subsysid']").val(result.subsysid);
							//提交
							 document.getElementById("sb_pay").submit();
							
							$.hideLoading();

                        } else {
							$.hideLoading();
                            $.alert(result.msg, "错误！");

                        }

                    }
                });

            });
        },
        SuccessPay: function (PayID) {
            $.ajax({
                type: 'post',
                url: "srv/SuccessPay.tjs",
                dataType: "json",
                data: { "PayID": PayID },
                error: function (result) {
                    $.toast("网络异常", "forbidden");
                },
                success: function (result) {

                }
            });
        },
        ErrorPay: function (PayID, ResultType) {
            $.ajax({
                type: 'post',
                url: "srv/ErrorPay.tjs",
                dataType: "json",
                data: { "PayID": PayID, "ResultType": ResultType },
                error: function (result) {
                    $.toast("网络异常", "forbidden");
                },
                success: function (result) {

                }
            });

        },
        Payment: function (opcpath) {

            var tHtml = '			<div class="titlebar" data-path="addroom"  data-name="addroom"><span class="back"><i class="icon iconfont" >&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>充值&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></span></div>'
     + '<div class="content">'
     + '</div>'
            $("#tab_main").html(tHtml);


            TUI.env.ElectPay.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            $(".content").html('<div class="weui_cells weui_cells_form">'
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
                    + '    <input class="mytxt"  type="number" id="pay_money" placeholder="请输入充值金额">'
                    + '  </div>'
                    + '</div>'
                    + '<div class="weui_cell">'
                    + '</div>'
                    + '   <div class="weui_panel_bd">'
                    + '        <div class="weui_media_box">'
                    + '            <div class="weui_media_bd Payment">'
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
                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
                            "timeStamp": " 1395712654",         //时间戳，自1970年以来的秒数     
                            "nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串     
                            "package": "prepay_id=u802345jgfjsdfgsdg888",
                            "signType": "MD5",         //微信签名方式：     
                            "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                        },
                        function (res) {
                            if (res.err_msg == "get_brand_wcpay_request：ok") { }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                        }
                    );
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }

            });
            $('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                TUI.env.ElectPay.roomInfo(opcpath, "房间信息");
                return false;
            });
            //  TUI.env.mobile.backAppFrame("房间信息", self.location.href.substring(0, self.location.href.indexOf("Payment.tjs")) + "RoomInfo.tjs?opcpath=" + opcpath, {});
            this.getRoomRemaining(opcpath);

        },
        getRoomRemaining: function (opcpath) {
            $.showLoading();
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
                    $.hideLoading();
                }
            });

        },
        getPayRoomInfo: function (opcpath) {

            $.showLoading();
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
                    TUI.env.ElectPay.roomName = result.szOPCFullName
                    $("#roomName").text(result.szOPCFullName.split(".").slice(1).join("."));
                    $("#OnLineFlag").text(OnLineFlag);
                    $("#dataTime").text(result.DataTime);

                    $("#remaining").text(result.remaining);
                    $.hideLoading();
                }
            });


        },
        getRoomInfo: function (opcpath) {

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

                    $("#main_info").html('<div class="msg-list">'
                    + ' <div class="weui_panel_hd weui_cells_access weui_cells_info" style="font-size:16px;color:#666;">'
                    + result.szOPCFullName.split(".").slice(1).join(".")
                    + '</div>'
                    //+ '   <div class="weui_panel_bd">'
                    //+ '        <div class="weui_media_box">'
                    //+ '            <div class="weui_media_bd">'
                    //+ '               <table border="1" bordercolor="#eee"> <tbody>'
                    //+ '                 <tr><td width="80px">在线状态</td><td>' + OnLineFlag + '</td></tr>'
                    //+ '                 <tr><td width="80px">电表余额</td><td class="remaining">' + result.remaining + '&nbsp;&nbsp;元</td></tr>'
                    //+ '                 <tr><td width="80px">上月用电</td><td>' + result.lastData + '&nbsp;&nbsp;元</td></tr>'
                    //+ '                 <tr><td width="80px">本月用电</td><td>' + result.Data + '&nbsp;&nbsp;元</td></tr>'
                    //+ '                 <tr><td width="80px">监测时间</td><td>' + result.DataTime + '</td></tr>'
                    //+ '                 <tr><td colspan="2"><a href="javascript:;" class="weui_btn weui_btn_warn payment">充值</a></td></tr>'
                    //+ '              </tbody></table>'
                    //+ '        </div>'
                    //+ '    </div>'
                    //+ '</div>'

                  + '</div>');
                    //$(".remaining").css("color", "red");
                    //$('.msg-list').find(".weui_btn.weui_btn_warn.payment").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                    //    TUI.env.ElectPay.Payment(opcpath);
                    //   // TUI.env.mobile.openAppFrame($(this).text(), self.location.href.substring(0, self.location.href.indexOf("RoomInfo.tjs")) + "Payment.tjs?opcpath=" + opcpath);

                    //})

                }
            });

        },
        getRoomCharge: function (opcpath, startDate) {
            TUI.env.ElectPay.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");

            var tHtml = '<div class="titlebar"><span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>充值记录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></span></div>'
                 + '<div class="content">'
                 + '</div>'
            $("#tab_main").html(tHtml);


            $('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                TUI.env.ElectPay.roomInfo(opcpath, '充值');
                return false;
            });


            $(".content").html('<div class="weui-pull-to-refresh-layer">'
		                     + '	<div class="pull-to-refresh-arrow"></div>'
		                     + '	<div class="pull-to-refresh-preloader"></div>'
		                     + '	<div class="down">下拉刷新</div>'
		                     + '	<div class="up">释放刷新</div>'
		                     + '	<div class="refresh">正在刷新</div>'
		                     + '</div>'
                            + '<div class="weui_panel weui_panel_access" id="room_info">'
                            + '<div class="weui_panel_bd" id="main_info">'
                            + '</div>'
                            + '<div class="weui_panel weui_panel_access" >'
                            //+ ' <div class="weui_panel_hd weui_cells_access" style="font-size:16px;color:#666;">'
                            //+ '售退电记录'
                            //+ '</div>'
                            + '     <div class="weui_panel_bd charge_info" id="charge_info">'
                            + '     </div>'
                            + '</div>'
                            + '</div>'

                            + '<div class="weui-infinite-scroll"><div class="infinite-preloader"></div>'
                            + '  正在加载'
                            + ' </div>');

            $("#charge_info").html('<div style="width:100%;-Webkit-overflow-scrolling: touch;" id="roomCharge">'
               // + '    <ul></ul>'
                + '</div>'
                );
            $('.content').pullToRefresh().on("pull-to-refresh", function () {
                // FUI.env.myapp.readMessage();
                TUI.env.ElectPay.getRoomInfo(opcpath);
                TUI.env.ElectPay.startDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
                $("#roomCharge").empty();
                TUI.env.ElectPay.getChargeDetail(opcpath, TUI.env.ElectPay.startDate);
                $('.content').pullToRefreshDone();
            });

            this.loading = false;
            $('.content').infinite().on("infinite", function () {
                if (TUI.env.ElectPay.loading) return;
                TUI.env.ElectPay.loading = true;
                TUI.env.ElectPay.getChargeDetail(opcpath, TUI.env.ElectPay.startDate);
            });
            $("#room_info").css("margin-top", 0);

            this.getRoomInfo(opcpath);
            this.getChargeDetail(opcpath, this.startDate);

        },
        getConsume: function (opcpath) {

            var tHtml = '<div class="titlebar"><span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>消费记录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></span></div>'
                 + '<div class="content">'
                 + '</div>'
            $("#tab_main").html(tHtml);


            $('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                TUI.env.ElectPay.roomInfo(opcpath, '充值');
                return false;
            });
            var year = new Date().Format("yyyy年");
            var month = new Date().Format("M月");

            $(".content").html(
                             '<div class="weui_panel weui_panel_access" id="Consume_info">'
                            + '<div class="weui_panel_bd" id="main_info">'
                            + ' <div class="weui_panel_hd weui_cells_access weui_cells_info" style="font-size:16px;color:#666;" id="consume_room_name">'
                            + '</div>'
                             + '<div class="weui_cell">'
                                + '<div class="weui_cell_hd"><label for="name" class="weui_label">选择月份</label></div>'
                                + ' <div class="weui_cell_bd weui_cell_primary">'
                                + ' <input class="weui_input" id="myMonth" type="text" value="' + year + ' ' + month + '" readonly="">'
                                + '</div>'
                                + '</div>'
                            + '</div>'
                            + '<div class="weui_panel weui_panel_access" >'
                            + '     <div class="weui_panel_bd charge_info" id="Consume_Detail">'
                            + '     </div>'
                            + '</div>'
                            + '</div>'
                            
                            );

            $("#Consume_Detail").html('<div style="width:100%;-Webkit-overflow-scrolling: touch;" id="roomConsume">'
               // + '    <ul></ul>'
                + '</div>'
                );

            $("#Consume_info").css("margin-top", 0);
            $("#myMonth").picker({
                title: "选择月份",
                cols: [
                  {
                      textAlign: 'center',
                      values: [new Date().getFullYear() + "年", new Date().getFullYear() - 1 + "年", new Date().getFullYear() - 2 + "年", new Date().getFullYear() - 3 + "年"]
                  },
                  {
                      textAlign: 'center',
                      values: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                  }
                ],
                onChange: function (p, v, dv) {
                    year = v[0];
                    month = v[1];
                },
                onClose: function (p, v, d) {
                    TUI.env.ElectPay.getConsumeDetail(opcpath, year.replace("年", ""), month.replace("月", ""));
                }
            });

            TUI.env.ElectPay.getConsumeDetail(opcpath, year.replace("年", ""), month.replace("月", ""));
            //$("#myMonth").picker("setValue", ["2016年", "6月"]);


        },
        getConsumeDetail: function (opcpath, year, month) {
            $.showLoading();
            $.ajax({
                type: 'post',
                url: "srv/getConsumeDetail.tjs",
                dataType: "json",
                data: { "opcpath": opcpath, "year": year, "month": month },
                error: function (result) {
                    $.toast("网络异常", "forbidden");
                },
                success: function (result) {
                    if (result.success) {
                        $("#consume_room_name").text(result.szOPCFullName.split(".").slice(1).join("."));
                        //for (var i = 0, len = result.Data.length; i < len; i++) {
                        //    $("#roomConsume").append(
                        //           ' <div class="weui_media_box weui_media_text">'
                        //           + '   <h4 class="weui_media_title">' + result.Data[i] + '</h4>'
                        //           + '   <p class="weui_media_desc"> ' + result.Data[i].RecordDateTime + ' ' + result.Data[i].DoType + '' + result.Data[i].AmmeterData + '元。</p>'
                        //            + '</div>'
                        //            );
                        //}
                        $("#roomConsume").empty();
                        var lastDay = new Date(year, month, 0).getDate();
                        $("#roomConsume").append(
                                //' <div class="weui_media_box weui_media_text">'
                                //+ '   <h4 class="weui_media_title">' + result.Data["total"] + '</h4>'
                                //+ '   <p class="weui_media_desc"> 总用电量：' + result.Data["total"] + '度。</p>'
                                //+ '</div>'
                                    '<div class="weui_cell">'
                                    + '<div class="weui_cell_bd weui_cell_primary">'
                                    + '<p>' + year + '年' + month + '月</p>'
                                    + '</div>'
                                    + '<div class="weui_cell_ft">月总用电量：' + result.Data["total"] + '度</div>'
                                    + '</div>'
                            );

                        for (var i = 1; i <= lastDay; i++) {

                            $("#roomConsume").append(
                                    //' <div class="weui_media_box weui_media_text">'
                                    //+ '   <h4 class="weui_media_title">' + i + '日</h4>'
                                    //+ '   <p class="weui_media_desc"> 用电：' + result.Data["D" + i] + '度。</p>'
                                    //+ '</div>'

                                    '<div class="weui_cell">'
                                    + '<div class="weui_cell_bd weui_cell_primary">'
                                    //+ '<p>' + year + "年" + month + "月" + i + '日</p>'
                                      + '<p>' + i + '日</p>'
                                    + '</div>'
                                    + '<div class="weui_cell_ft"> 日用电：' + result.Data["D" + i] + '度</div>'
                                    + '</div>'

                                );




                        }

                    }
                    $.hideLoading();
                }
            });

        },
        getChargeDetail: function (opcpath, startDate) {
            $.showLoading();

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
                        TUI.env.ElectPay.startDate = result.endDate;

                        for (var i = 0, len = result.Data.length; i < len; i++) {

                            //$("#charge_info").find("ul").append('<li class="li-msg">'
                            //                                        + '	<div class="item-msg">'
                            //                                        + '		<div class="imsg-icon two">'
                            //                                        + '			<div class="content bg-color-blue"></div>'
                            //                                        + '		</div>'
                            //                                        + '		<div class="imsg-line "></div>'
                            //                                        + '		<div class="imsg-allow two"></div>'
                            //                                        + '		<div class="imsg-content two">' + result.Data[i].RecordDateTime + ' ' + result.Data[i].DoType + '' + result.Data[i].AmmeterData + '元。</div>'
                            //                                        + '	</div>'
                            //                                        + '</li>'
                            //                                        );
                            $("#roomCharge").append(
                                   ' <div class="weui_media_box weui_media_text">'
                                   + '   <h4 class="weui_media_title">' + result.Data[i].Operator + '</h4>'
                                   + '   <p class="weui_media_desc"> ' + result.Data[i].RecordDateTime + ' ' + result.Data[i].PayUserName + result.Data[i].DoType + '' + result.Data[i].AmmeterData + '元。</p>'
                                    + '</div>'
                                    );
                        }

                    }
                    $.hideLoading();
                    TUI.env.ElectPay.loading = false;
                }
            });

        },
        updateToken: function () {
            $.ajax({
                type: 'get',
                url: '/API/WeiXin/AccessToken',
                dataType: "json",
                context: this,
                error: function (result) {
                },
                success: function (result) {
                    TUI.env.wx = result;
                    TUI.env.wx.ready = false;
                    //
                    wx.config({
                        debug: false,
                        appId: result.appid,
                        timestamp: result.timestamp,
                        nonceStr: result.nonceStr,
                        signature: result.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'uploadImage', 'getNetworkType', 'openLocation', 'getLocation', 'closeWindow', 'scanQRCode', 'showOptionMenu', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem']
                    });
                    //
                    wx.ready(function () {
                        TUI.env.wx.ready = true;
                    });
                    //
                    setTimeout("TUI.env.ElectPay.updateToken();", (result.expires - result.lasttime) * 1000);
                }
            });
        },
        setTitle: function (path, pathname, name) {
            $(".titlebar").attr("data-path", path);
            $(".titlebar").attr("data-name", pathname);
            $(".titlebar").find(".title").html("<b>" + name + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>");
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

    if (TUI.env.us != null) {
        TUI.env = top.TUI.env;
        //
        TUI.env.ElectPay = new ElectPay();
        TUI.env.ElectPay.init();
        TUI.env.ElectPay.show("normal");
    }
    else {
        $.ajax({
            type: 'get',
            url: "/System/srv/login.ejs",
            dataType: "json",
            error: function (result) {
                alert("登录失败！");
            },
            success: function (result) {
                //初始化用户信息
                TUI.env.us = result;
                //
                TUI.env.ElectPay = new ElectPay();
                TUI.env.ElectPay.init();
                TUI.env.ElectPay.show("normal");
                //TUI.env.ElectPay.updateToken();
            }
        });
    }

});