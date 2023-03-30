//主程序入口
$(document).ready(function () {
	$.ajax({
	    type: 'get',
	    url: "/System/srv/login.ejs",
	    dataType: "json",
	    error: function (result) {
	        window.location.href = "/API/My/Login/?goto=" + escape("/Webapp/SmartApp/Mobile/MyOffice");
	    },
	    success: function (result) {
	        //初始化用户信息
	        TUI.env.us = result;
	        //
	        TUI.env.myapp = new MyApp();
	        TUI.env.myapp.init();
	        TUI.env.myapp.show("normal");
	    }
	});
});
function frameload(e) {
    $(e.contentDocument).find('.NodeAction').on(TUI.env.ua.clickEventUp, { handle: e }, function (e) {
        $.ajax({
            type: 'post',
            url: "/Project/SmartApp/API/webvr/pushActionTask",
            data: { OPCFilter: $(e.currentTarget).attr("name"), RuleID: $(e.currentTarget).attr("id") },
            dataType: "json",
            context: e.data.handle,
            error: function (result) {
                alert("远程服务故障，请检查网络或稍后再试！");
            },
            success: function (result) {
                $.toast("发送远程控制指令成功，控制状态可查询控制中心！", "success");
            }
        });
    });
}
MyApp = function (container, config) {
    return {
        init: function () {
            $('.back').bind("click", { handle: this }, function (e) {
                if (TUI.env.wx != undefined) {
                    window.location.href = document.referrer;
                } else {
                    try {
                        api.closeFrame();
                    } catch (ex) {
                        window.location.href = document.referrer;
                    }
                }
                return false;
            });
            this.loadData();
        },
        loadData: function () {
            $.ajax({
                type: 'get',
                url: "/Project/SmartApp/API/webvr/OfficeRoom",
                dataType: "json",
                context: this,
                error: function (result) {
                    $.toast("网络不给力", "forbidden");
                },
                success: function (result) {
                    $(".user-list").empty();
                    for (var i = 0; i < result.length; i++) {
                        var content = "";
                        var hj = 0, cz = 0, db = 0, sxt = 0;
                        if (result[i].VideoID != "") {
                            sxt++;
                        }
                        for (var j = 0; j < result[i].listNode.length; j++) {
                            var DeviceType = result[i].listNode[j].DeviceType;
                            switch (DeviceType) {
                                case "CO2":
                                case "TH":
                                case "LUX":
                                    hj++;
                                    break;
                                case "ISH":
                                    cz++;
                                    break;
                                case "CIE":
                                    db++;
                                    break;
                                default:
                                    break;
                            }
                        }
                        var item = $('<div class="weui_panel weui_panel_access"><div class="weui_media_box weui_media_text" >' +
                                                '   <p class="weui_media_desc weui_panel_ft" style="font-size:20px;padding-left:0px;border-bottom: 1px solid #e5e5e5;color: #333;">' + TUI.Utils.getRightPathName(result[i].GroupFullName, 2) + '</p>' +
                                                '    <p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">房间面积：&nbsp;&nbsp;<b>' + result[i].ObjectInfo.Area + '&nbsp;㎡</b></p>' +
                                                '    <p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">人员数量：&nbsp;&nbsp;<b>' + result[i].ObjectInfo.Peoples + '&nbsp;人</b></p>' +
                                                '    <p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">入住部门：&nbsp;&nbsp;<b>' + result[i].Organize + '</b></p>' +
                                                '    <p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">智能设备：&nbsp;&nbsp;<i class="icon iconfont icon-chazuo"></i>&nbsp;' + cz + '&nbsp;&nbsp;<i class="icon iconfont icon-shexiangtou"></i>&nbsp;' + sxt + '&nbsp;&nbsp;<i class="icon iconfont icon-dianbiao"></i>&nbsp;' + db + '&nbsp;&nbsp;<i class="icon iconfont icon-huanjing"></i>&nbsp;' + hj + '&nbsp;&nbsp;<i class="icon iconfont icon-chapai"></i>&nbsp;0&nbsp;&nbsp;<i class="icon iconfont icon-chuanganqi1"></i>&nbsp;0</p>' +
                                                '</div></div>');
                        item.bind("click", { handle: this, config: result[i] }, function (e) {
                            $("#tab_select").animate({ left: "0px" });
                            //
                            $('#tab_select').find('.subtitle_bar').empty();
                            $('#tab_select').find('.subtitle_bar').html('<span class="left"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>' + TUI.Utils.getRightPathName(e.data.config.GroupFullName, 2) + '</b></span>');
                            $('#tab_select').find('.subtitle_body').html('<div class="article-list" id="webvr"></div>');
                            
                            var map = new TUI.WebVR("webvr");
                            map.init({ 
                                server: "http://cloud.thingslabs.com",
                                path: e.data.config.ObjectInfo.VRTag, 
                                option: {
                                    rotate: { "longitude": 0, "latitude": 0 }
                                },
                                fn: function (psv, config) {
                                    $.ajax({
                                        type: 'get',
                                        url: "/API/System/SmartApp/Facility/" + config.data.tag.split(".").join("/") + "?v=2",
                                        dataType: "json",
                                        context: config,
                                        error: function (result) {
                                        },
                                        success: function (result) {
                                            if (result.OPCNodeList != undefined) {
                                                for (var i = 0; i < result.OPCNodeList.length; i++) {
                                                    map.addSceneAR({
                                                        "id": result.OPCNodeList[i].NodeID,
                                                        "data": {
                                                            "color": result.OPCNodeList[i].OnLineFlag ? "green" : "red",
                                                            "url": "/Project/SmartApp/API/webvr/getNodePannel?fullTag=" + result.OPCNodeList[i].NodeFullTag + "&TagName=" + result.OPCNodeList[i].NodeName,
                                                            "usedata": result.OPCNodeList[i],
                                                            "fn": function (psv, config) {
                                                                //var html = $(config.psv.panel.content).html();
                                                                $(config.psv.panel.content).html("<iframe id='iframe1' onload='frameload(this)' src='/Project/SmartApp/API/webvr/getNodePannel?fullTag=" + config.data.usedata.NodeFullTag + "&TagName=" + config.data.usedata.NodeName + "' marginwidth=0 marginheight=0 frameBorder=0 width='100%'  height='99%' style='overflow: auto;'></iframe>");
                                                                
                                                            }
                                                        },
                                                        "longitude": result.OPCNodeList[i].Longitude,
                                                        "latitude": result.OPCNodeList[i].Latitude,
                                                        "tooltip": {
                                                            "content": result.OPCNodeList[i].NodeName
                                                        }
                                                    }, (i == result.OPCNodeList.length - 1) ? true : false);
                                                }
                                            }
                                            //加载视频摄像位置
                                            if (result.MyGroup != undefined) {
                                                if (result.MyGroup.VideoID != "") {
                                                    map.addSceneAR({
                                                        "id": result.MyGroup.GroupID,
                                                        "data": {
                                                            "color": "green",
                                                            "url": "/Project/SmartApp/API/webvr/getVideoPannel?VideoID=" + result.MyGroup.VideoID + "&TagName=" + result.MyGroup.GroupName + "【摄像机】",
                                                            "usedata": result.MyGroup,
                                                            "fn": function (psv, config) {
                                                                //var html = $(config.psv.panel.content).html();
                                                                $(config.psv.panel.content).html("<iframe id='iframe1' src='/Project/SmartApp/API/webvr/getVideoPannel?VideoID=" + config.data.usedata.VideoID + "&TagName=" + config.data.usedata.GroupName + "' marginwidth=0 marginheight=0 frameBorder=0 width='100%'  height='99%' style='overflow: auto;'></iframe>");

                                                            }
                                                        },
                                                        "longitude": result.MyGroup.Longitude,
                                                        "latitude": result.MyGroup.Latitude,
                                                        "tooltip": {
                                                            "content": result.MyGroup.GroupName + "【摄像机】"
                                                        }
                                                    }, true);
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                            map.show();
                            
                            $('#tab_select').find('.left').bind("click", { handle: this }, function (e) {
                                $('#tab_select').animate({ left: "100%" }, function () {
                                    $('#tab_select').find('.subtitle_body').empty();
                                    $('#tab_select').hide();
                                });
                                return false;
                            });
                            $('#tab_select').find('.save').bind("click", { handle: this }, function (e) {
                                $('#tab_select').animate({ left: "100%" }, function () {
                                    $('#tab_select').find('.subtitle_body').empty();
                                    $('#tab_select').hide();
                                });
                                return false;
                            });
                            //
                            $('#tab_select').show();
                            $('#tab_select').animate({ left: "0px" });
                            return false;
                        });
                        $(".user-list").append(item);
                    }
                }
            });
        },
		show: function (speed) {

        },
        hide: function (speed) {

        }
    };
};
