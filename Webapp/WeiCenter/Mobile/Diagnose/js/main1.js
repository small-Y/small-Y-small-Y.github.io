//主程序入口
$(document).ready(function () {
	//TUI.env.mobile = null;
	if (window != top && top.TUI) {
		TUI.env.mobile = top.TUI.env.mobile;
	}
	$.ajax({
	    type: 'get',
	    url: "/System/srv/login.ejs",
	    dataType: "json",
	    error: function (result) {
	        window.location.href = "/API/My/Login/?goto=" + escape("/Webapp/Calendar/Mobile/");
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

MyApp = function (container, config) {
    return {
        checklist: [
                { key: "A", title: "能源管理", child: [{ name: "设施设备在线率", key: "A" },{ name: "待机功耗检查", key: "B" }],result:[] },
                { key: "B", title: "给水管网", child: [{ name: "设施设备在线率", key: "A" }, { name: "管网漏水", key: "B" }, { name: "水平衡测试", key: "C" }, { name: "大口径小流量", key: "D" }], result: [] },
                { key: "C", title: "地源热泵", child: [{ name: "设施设备在线率", key: "A" }, { name: "空耗运行", key: "B" }, { name: "末端开启不足", key: "C" }, { name: "能效检测", key: "D" }], result: [] },
                { key: "D", title: "配变电所", child: [{ name: "设施设备在线率", key: "A" }, { name: "变压器温度", key: "B" }, { name: "最大需量监测", key: "C" }, { name: "启用出线柜跳闸", key: "D" }], result: [] },
                { key: "E", title: "VRV空调", child: [{ name: "设施设备在线率", key: "A" },  { name: "滤网清洁", key: "B" }], result: [] },
                { key: "F", title: "环境指标", child: [{ name: "设施设备在线率", key: "A" }, { name: "室内二氧化碳浓度", key: "B" }, { name: "车库一氧化碳浓度", key: "C" }], result: [] },
                { key: "G", title: "雨水回用", child: [{ name: "设施设备在线率", key: "A" }, { name: "运行成本", key: "B" }, { name: "补水量检查", key: "C" }], result: [] },
                { key: "H", title: "太阳能光伏", child: [{ name: "设施设备在线率", key: "A" }, { name: "光伏电量使用率", key: "B" }], result: [] }
        ],
        isall: true,
        buildList:[],
        checkmap: {},
        steps:0,
        progress: false,
        reset:false,
        resultlist: [],
        resultmap: {},
        level: [
            { level: 1, name: "健康", color: "#35aa47", start: 90, end: 100 },
            { level: 2, name: "亚健康", color: "#eecc00", start: 60, end: 89 },
            { level: 3, name: "立即处理", color: "#cc0000", start: 0, end: 59 }
        ],
        init: function () {
            this.checkmap["A"] = this.checklist[0];
            this.checkmap["B"] = this.checklist[1];
            this.checkmap["C"] = this.checklist[2];
            this.checkmap["D"] = this.checklist[3];
            this.checkmap["E"] = this.checklist[4];
            this.checkmap["F"] = this.checklist[5];
            this.checkmap["G"] = this.checklist[6];
            this.checkmap["H"] = this.checklist[7];
            $("#btns").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                if ($("#checklist").find(".on").length == 0) {
                    $.toast("未选择诊断项目", "forbidden");
                    return false;
                }
                if (e.data.handle.progress == true) {
                    return false;
                }
                if (e.data.handle.reset == true) {
                    e.data.handle.loadCheckList();
                    $("#checklist").show();
                    $("#btnTitle").show();
                    $("#btnTitle1").hide();
                    $("#resultlist1").hide();
                    $("#btnShare").hide();
                    $("#Score").hide();
                    TUI.env.myapp.reset = false;
                    return false;
                }
                $("#btnShare").hide();
                $("#btnTitle1").html("诊断中...");
                $("#Score").css("color", TUI.env.myapp.level[0].color);
                $("#Score").html('100<font style="font-size: 15pt;">分</font>');
                e.data.handle.progress = true;
                e.data.handle.resultmap = {};
                e.data.handle.resultlist = [];
                e.data.handle.steps = 0;
                TUI.Comet.close();
                if (TUI.Comet.connect()) {
                    if (!TUI.Comet.onlisten()) {
                        $.toast("连接失败", "forbidden");
                    }
                }
                else {
                    $.toast("连接失败", "forbidden");
                }
                $("#checklist").hide();
                $("#btnTitle").hide();
                $("#btnTitle1").show();
                $("#resultlist1").show();
                $("#Score").show();
                $("#resultlist").empty();
                $(".circular").css("-webkit-animation", "loading 3s linear infinite");
                $("#checklist").find(".on").each(function () {
                    var item = $('<a class="weui_cell check' + $(this)[0].id + '" href="javascript:;" >'
                              + ' <div class="weui_cell_hd">'
                              + '      <img src="css/img/' + $(this)[0].id + '.png" alt="icon" style="width:20px;margin-right:5px;display:block">'
                              + '  </div>'
                              + '  <div class="weui_cell_bd weui_cell_primary">'
                              + '      <p style="font-size: 10pt;">开始诊断...</p>'
                              + '  </div>'
                              + '  <div class="weui_cell_ft">'
                              + '  </div>'
                              + '</a>');
                    TUI.env.myapp.resultmap[$(this)[0].id] = TUI.env.myapp.resultlist.length;
                    TUI.env.myapp.resultlist.push(TUI.env.myapp.checkmap[$(this)[0].id]);
                    item.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: TUI.env.myapp.checkmap[$(this)[0].id] }, function (e) {
                        $('#detaillist').html('<img  src="css/img/waiting.gif" style="margin-top: 50%;margin-left: 45%;height:50px;"></img>');
                        $("#title").html(e.data.handle.title);
                        $('#btnShare').hide();
                        $('#back').show();
                        $("#main").hide();
                        $('#tab_main').show();
                        $('#tab_main').animate({ left: "0px" });

                        $.ajax({
                            type: 'get',
                            url: "/Project/GBMS/API/detail"+e.data.handle.key,
                            dataType: "json",
                            context: this,
                            error: function (result) {
                                $.toast("网络异常", "forbidden");
                            },
                            success: function (result) {
                                if (result.flag) {
                                    $('#detaillist').empty();
                                    for (var i = 0; i < result.buildlist.length; i++) {
                                        var item = $('<div class="weui_panel weui_panel_access">'
                                                    + '		<div class="weui_panel_hd"  style="font-size:16px;color:#666;">' + (result.buildlist[i].count == 0 ? '<i class="weui_icon_success_circle"></i>' : '<i class="weui_icon_info_circle"></i>') + '&nbsp;' + result.buildlist[i].name.split(".")[1] + '<span class="close">收起</span></div>'
                                                    + '		<div class="weui_panel_bd"></div>'
                                                    + '</div>');
                                        item.find('.close').bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: item}, function (e) {
                                            if ($(this).html() == "收起") {
                                                $(this).html("展开");
                                                $(e.data.handle).find(".weui_panel_bd").hide();
                                            }
                                            else {
                                                $(this).html("收起");
                                                $(e.data.handle).find(".weui_panel_bd").show();
                                            }
                                        });
                                        for (var j = 0; j < result.buildlist[i].list.length; j++) {
                                            var subitem = $('<div class="weui_media_box weui_media_text" style="padding:10px 15px 5px 15px;">'
                                                    + '	  <p class="weui_media_title" style="font-size: 15px;"><b>' + result.buildlist[i].list[j].name + '</b></p>'
                                                    + '	  <p class="weui_media_desc" style="font-size: 15px;">' + result.buildlist[i].list[j].info+'</p>'
                                                    + '	  <ul class="weui_media_info" style="margin-top:6px;line-height: 16px;">'
                                                    + '		<li class="weui_media_info_meta">' + TUI.Utils.dateMessage(new Date()) + '</li>'
                                                    + '	  </ul>'
                                                    + '	  <div class="msgbtn">'
                                                    + '		<div class="share"><div class="lable">转发</div></div>'
                                                    + '	   </div>'
                                                    + '	</div>');
                                            subitem.bind("swipe", function (event) {
                                                if (event.direction === 'left') {
                                                    $(this).animate({ left: "-60px" });
                                                }
                                                else if (event.direction === 'right') {
                                                    $(this).animate({ left: "0px" });
                                                }
                                            });
                                            subitem.find(".share").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: item, info: result.buildlist[i].list[j] }, function (e) {
                                                $(e.data.handle).animate({ left: "0px" });
                                                //
                                                $('#tab_main1').find('.subtitle_bar').empty();
                                                $('#tab_main1').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>消息分发</b></span><span class="save">发送</span>');
                                                $('#tab_main1').find('.subtitle_body').html('<div class="article-list">'
                                                                                        + '		<div class="weui_cells_title">处理意见</div>'
                                                                                        + '		<div class="weui_cells weui_cells_form">'
                                                                                        + '			<div class="weui_cell">'
                                                                                        + '				<div class="weui_cell_bd weui_cell_primary">'
                                                                                        + '					<textarea id="mycontent" class="weui_textarea" placeholder="请输入你的意见" rows="3"></textarea>'
                                                                                        + '				</div>'
                                                                                        + '			</div>'
                                                                                        + '		</div>'
                                                                                        + '		<div class="weui_cells_title">选择人员</div>'
                                                                                        + '		<div class="weui_cells weui_cells_checkbox"></div>'
                                                                                        + '</div>');
                                                //
                                                var myContact = null;
                                                $.ajax({
                                                    type: 'get',
                                                    url: "/API/Contact",
                                                    dataType: "json",
                                                    context: this,
                                                    error: function (result) {
                                                        $.toast("网络异常", "forbidden");
                                                    },
                                                    success: function (result) {
                                                        if (!result.flag) {
                                                            alert(result.info);
                                                            return;
                                                        }
                                                        //
                                                        for (var i = 0; i < result.data.length; i++) {
                                                            if (result.data[i].userName != TUI.env.us.userName) {
                                                                var item = $('<label class="weui_cell weui_check_label" for="' + result.data[i].userName + '">'
                                                                        + '	  <div class="weui_cell_hd">'
                                                                        + '		<input type="checkbox" class="weui_check" name="checkuser" id="' + result.data[i].userName + '" value="' + result.data[i].userName + '">'
                                                                        + '		<i class="weui_icon_checked"></i>'
                                                                        + '	  </div>'
                                                                        + '	  <div class="weui_cell_bd weui_cell_primary">'
                                                                        + '		<p>' + result.data[i].fullName + '</p>'
                                                                        + '	  </div>'
                                                                        + '	</label>');
                                                                //
                                                                $('#tab_main1').find('.subtitle_body .weui_cells_checkbox').append(item);
                                                            }
                                                        }
                                                    }
                                                });
                                                //
                                                $('#tab_main1').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                                                    $('#tab_main1').animate({ left: "100%" }, function () {
                                                        $('#tab_main1').find('.subtitle_body').empty();
                                                        $('#tab_main1').hide();
                                                    });
                                                    return false;
                                                });
                                                //
                                                $('#tab_main1').find('.save').bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this, text: e.data.info }, function (e) {
                                                    var toUser = [];
                                                    $("input[name='checkuser']").each(function () {
                                                        if (true == $(this).prop("checked")) {
                                                            toUser[toUser.length] = $(this).prop('value');
                                                        }
                                                    });
                                                    //
                                                    if (toUser.length > 0) {
                                                        var mycontent = $('#mycontent').prop("value");
                                                        $.ajax({
                                                            type: 'PUT',
                                                            url: "/API/Sayma",
                                                            data: {
                                                                to: toUser.join(),  call: e.data.text.info + "，处理意见" + mycontent
                                                            },
                                                            dataType: "json",
                                                            context: this,
                                                            error: function (result) {
                                                                $.toast("禁止操作", "forbidden");
                                                            },
                                                            success: function (result) {
                                                                $.toast("发送成功", function () {
                                                                    console.log('close');
                                                                });
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        $.toast("取消操作", "cancel", function (toast) {
                                                            console.log(toast);
                                                        });
                                                    }
                                                    //
                                                    $('#tab_main1').animate({ left: "100%" }, function () {
                                                        $('#tab_main1').find('.subtitle_body').empty();
                                                        $('#tab_main1').hide();
                                                    });
                                                    return false;
                                                });
                                                //
                                                $('#tab_main1').show();
                                                $('#tab_main1').animate({ left: "0px" });
                                                return false;
                                            });
                                            item.find(".weui_panel_bd").append(subitem);
                                        }
                                        
                                        $("#detaillist").append(item);
                                    }

                                }
                            }
                        });
                    });
                    $("#resultlist").append(item);
                    if (!TUI.Comet.addsrv("tjs", "srv/checkItem" + $(this)[0].id + ".tjs?score=" + (100 / $("#checklist").find(".on").length), TUI.env.myapp.loadMsg)) {
                        $.toast("连接失败", "forbidden");
                    }
                });
            });
            $("#btnShare").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                var items = [];
                var count = 0;
                var info = [];
                for (var i = 0; i < TUI.env.myapp.resultlist.length; i++) {
                    items.push(TUI.env.myapp.resultlist[i].title);
                    if (TUI.env.myapp.resultlist[i].result[TUI.env.myapp.resultlist[i].result.length - 1].count != 0) {
                        count += TUI.env.myapp.resultlist[i].result[TUI.env.myapp.resultlist[i].result.length - 1].count;
                        info.push(TUI.env.myapp.resultlist[i].title + "共" + TUI.env.myapp.resultlist[i].result[TUI.env.myapp.resultlist[i].result.length - 1].count + "处");
                    } 
                }
                var content = "";
                if (count == 0) {
                     content = "通过对所有建筑最近二天内各项设施的运行情况进行诊断分析，主要包括" + items.join("、") + "，最终得分为" + $("#Score").text() + "，未发现异常点！";
                } else {
                     content = "通过对所有建筑最近二天内各项设施的运行情况进行诊断分析，主要包括" + items.join("、") + "，最终得分为" + $("#Score").text() + "，总共发现了" + count + "处异常点，其中" + info.join("，") + "，建议立即处理！";
                }
                $.prompt('分享内容', '确认分享到社区',
                     function (input) {
                        var config = { subject: "建筑诊断APP", content: input, apptag: "Diagnose" };
                        $.ajax({
                            type: 'PUT',
                            url: "/API/Contact/Community",
                            data: config,
                            dataType: "json",
                            context: this,
                            error: function (result) {
                                $.toast("分享成功");
                            },
                            success: function (result) {
                                $.toast("分享成功");
                            }
                        });
                    },
                     function () {
                         $.toast("取消操作");
                    }
                );
                $("#weui-prompt-input").val(content);
            });
            $("#back").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                $('#tab_main').animate({ left: "100%" }, function () {
                    $('#tab_main').hide();
                    $("#main").show();
                    $('#btnShare').show();
                    $("#title").html("建筑诊断");
                    $("#back").hide();
                });
                
            });
            $("#buildlist").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                $(e.data.handle).animate({ left: "0px" });
                //
                $('#tab_main1').find('.subtitle_bar').empty();
                $('#tab_main1').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="title"><b>选择建筑</b></span><span class="save">确定</span>');
                $('#tab_main1').find('.subtitle_body').html('<div class="article-list">'
                                                        + '		<div class="weui_cells_title">建筑列表</div>'
                                                        + '		<div class="weui_cells weui_cells_checkbox"></div>'
                                                        + '</div>');
                //
                var myBuild = null;
                $.ajax({
                    type: 'get',
                    url: "/API/System/GBMS/ObjectClass/GreenBuild",
                    dataType: "json",
                    context: this,
                    error: function (result) {
                        $.toast("网络异常", "forbidden");
                    },
                    success: function (result) {
                        if (!result.flag) {
                            alert(result.info);
                            return;
                        }
                        //
                        for (var i = 0; i < result.length; i++) {
                            var item = $('<label class="weui_cell weui_check_label" for="' + result[i].userName + '">'
                                    + '	  <div class="weui_cell_hd">'
                                    + '		<input type="checkbox" class="weui_check" name="checkuser" id="' + result[i].GroupID + '" value="' + result[i].GroupID + '">'
                                    + '		<i class="weui_icon_checked"></i>'
                                    + '	  </div>'
                                    + '	  <div class="weui_cell_bd weui_cell_primary">'
                                    + '		<p>' + result[i].szName + '</p>'
                                    + '	  </div>'
                                    + '	</label>');
                            //
                            $('#tab_main1').find('.subtitle_body .weui_cells_checkbox').append(item);
                        }
                    }
                });
                //
                $('#tab_main1').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                    $('#tab_main1').animate({ left: "100%" }, function () {
                        $('#tab_main1').find('.subtitle_body').empty();
                        $('#tab_main1').hide();
                    });
                    return false;
                });
                //
                $('#tab_main1').find('.save').bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this}, function (e) {
                    var toUser = [];
                    $("input[name='checkuser']").each(function () {
                        if (true == $(this).prop("checked")) {
                            toUser[toUser.length] = $(this).prop('value');
                        }
                    });
                    //
                    if (toUser.length > 0) {
                        e.data.handle.buildList = toUser;
                    }
                    else {
                        $.toast("取消操作", "cancel", function (toast) {
                            console.log(toast);
                        });
                    }
                    //
                    $('#tab_main1').animate({ left: "100%" }, function () {
                        $('#tab_main1').find('.subtitle_body').empty();
                        $('#tab_main1').hide();
                    });
                    return false;
                });
                //
                $('#tab_main1').show();
                $('#tab_main1').animate({ left: "0px" });
                return false;
            });
            this.loadCheckList();
			this.onsize();
        },
        loadMsg: function (result) {
            var datas = result.split("|");
            for (var i = 0; i < datas.length; i++) {
                if (datas[i] == "") continue;
                console.log(datas[i]);
                var data = TUI.JSON.decode(datas[i]);
                TUI.env.myapp.resultlist[TUI.env.myapp.resultmap[data.key]].result.push(data);
                var score = $("#Score").text().replace("分","");
                score = TUI.Utils.floatPrecision(score - data.score, 0);
                $("#Score").html(score+'<font style="font-size: 15pt;">分</font>');
                if (score >= TUI.env.myapp.level[0].start && score <= TUI.env.myapp.level[0].end) {
                    $("#Score").css("color", TUI.env.myapp.level[0].color);
                } else if (score >= TUI.env.myapp.level[1].start && score <= TUI.env.myapp.level[1].end) {
                    $("#Score").css("color", TUI.env.myapp.level[1].color);
                } else if (score >= TUI.env.myapp.level[2].start && score <= TUI.env.myapp.level[2].end) {
                    $("#Score").css("color", TUI.env.myapp.level[2].color);
                } 
                $("#resultlist").find(".check" + data.key).find("p").text(data.info);
                if (data.complete == true) {
                    TUI.env.myapp.steps++;
                    $("#resultlist").find(".check" + data.key).find("p").text(data.completeinfo);
                    if (TUI.env.myapp.steps == TUI.env.myapp.resultlist.length) {
                        TUI.env.myapp.progress = false;
                        TUI.env.myapp.reset = true;
                        $("#btnTitle1").html("诊断完成");
                        $(".circular").css("-webkit-animation", "");
                        $("#btnShare").show();
                    }
                }
            }
        },
        loadCheckList: function () {
            $("#checklist").empty();
            for (var i = 0; i < this.checklist.length; i++) {
                var item = $('<a href="javascript:void(0);" class="weui_grid js_grid on" id=' + this.checklist[i].key + '><div class="weui_grid_icon"><img src="css/img/' + this.checklist[i].key + '.png" alt=""></div><p class="weui_grid_label">' + this.checklist[i].title + '</p><span class="weui_grid_select"><i class="icon iconfont">&#xe630;</i></span></a>');
                item.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                    $(e.currentTarget).toggleClass("on");
                });
                $("#checklist").append(item);
            }
		},
		show: function (speed) {

        },
        hide: function (speed) {

        },
        onsize: function () {
            $("#checklist").height($(window).height() - 305);
            $("#resultlist1").height($(window).height() - 305);
            $(".actionbtn").css({ left: ($(window).width() - 140) / 2 });
            $(".circular").css({ left: ($(window).width() - 180) / 2 });
        }
    };
};
