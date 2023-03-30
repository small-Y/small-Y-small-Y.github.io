//主程序入口
$(document).ready(function () {
	//TUI.env.mobile = null;
	if (window != top && top.TUI) {
		TUI.env.mobile = top.TUI.env.mobile;
	}
	TUI.env.myapp = new MyApp();
	TUI.env.myapp.init();
	TUI.env.myapp.show("normal");
});

MyApp = function (container, config) {
    return {
        GroupID: 0,
        startTime: TUI.Utils.parseDate(new Date().Format("yyyy-MM-01 00:00:00")),
        endTime: new Date(),
        dataType: "1",
        unit: "度",
        unitname:"电",
        elecprice: 0,
        waterprice:0,
        GroupFullTag: "",
        GroupFullName: "",
        total: 0,
        list:[],
        init: function () {
			this.pagestart=0;
			this.pagenumber = 10;
			$('#btnBack').bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
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
			$("#btnBackList").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
			    $(".tab_pannel").show();
			    $("#btnRefresh").show();
			    $("#appmenu").show();
			    $(".detail").hide();
			    $("#btnBackList").hide();
			    $("#btnShare").hide();
			    $("#btnBack").show();
			    $(".title").html("<b>全部建筑</b>");
			    return false;
			});
			$(".detail").find(".weui-tabbar__item").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
			    $(".weui-tabbar__item").removeClass("weui-bar__item_on");
			    $(".weui-tabbar__item").find("img").each(function () {
			        var name = $(this).attr("name");
			        $(this).attr("src", "css/images/" + name + "-off.png");
			    });
			    $(e.currentTarget).addClass("weui-bar__item_on");
			    var name = $(e.currentTarget).find("img").attr("name");
			    $(e.currentTarget).find("img").attr("src", "css/images/" + name + "-on.png")
			    if (e.currentTarget.innerText.trim() == "分项能耗") {
			        e.data.handle.dataType = "1";
			        e.data.handle.unit = "度";
			        e.data.handle.unitname = "电";
			    } else if (e.currentTarget.innerText.trim() == "分户性质") {
			        e.data.handle.dataType = "2";
			        e.data.handle.unit = "度";
			        e.data.handle.unitname = "电";
			    } else if (e.currentTarget.innerText.trim() == "公共部分") {
			        e.data.handle.dataType = "3";
			        e.data.handle.unit = "度";
			        e.data.handle.unitname = "电";
			    } else if (e.currentTarget.innerText.trim() == "用水分类") {
			        e.data.handle.dataType = "4";
			        e.data.handle.unit = "吨";
			        e.data.handle.unitname = "水";
			    }
			    e.data.handle.loadBuildingDetailData();
			});
			$("#btnRefresh").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
			    e.data.handle.loadBuilding();
			});
			$("#btnShare").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
			    var content = "";
			    if (e.data.handle.startTime.getFullYear() == new Date().getFullYear() && e.data.handle.startTime.getMonth() == new Date().getMonth()) {
			        content = "截止到" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "，" + e.data.handle.GroupFullName +new Date().Format("yyyy年MM月")+ e.data.handle.totaltitle + "：" + e.data.handle.total + e.data.handle.unit + "，其中";

			    } else {
			        content = e.data.handle.GroupFullName + e.data.handle.startTime.Format("yyyy年MM月") + e.data.handle.totaltitle + "：" + e.data.handle.total + e.data.handle.unit + "，其中";
			    }
			    for (var i = 0; i < e.data.handle.list.length; i++) {
			        if (e.data.handle.list[i].name == "总用电量" || e.data.handle.list[i].name == "无" || e.data.handle.list[i].name == "其它公共"
                        || e.data.handle.list[i].name == "公共用电" || e.data.handle.list[i].name == "公共" || e.data.handle.list[i].name == "可再生能源") {
			            continue;
			        }
			        if (i == (e.data.handle.list.length - 1)) {
			            content += e.data.handle.list[i].name + "：" + e.data.handle.list[i].value.HourMeasure + e.data.handle.unit + "。";
			        } else {
			            content += e.data.handle.list[i].name + "：" + e.data.handle.list[i].value.HourMeasure + e.data.handle.unit + "，";
			        }
			    }
			    var config = { subject: "能源监管APP提示", content: content, apptag: "Energy" };
			    if (e.data.handle.imgUrl != "css/images/noimg.png") {
			        config.imgurl =  e.data.handle.imgUrl;
			    }
			    $.confirm("确认分享？", "社区分享", function () {
			        $.ajax({
			            type: 'PUT',
			            url: "/API/Contact/Community",
			            data:config,
			            dataType: "json",
			            context: this,
			            error: function (result) {
			                $.toast("分享成功");
			            },
			            success: function (result) {
			                $.toast("分享成功");
			            }
			        });
			    }, function () {
			        $.toast("取消操作", "", function (toast) {
			        });
			    });

			});
			this.loadList();
			this.onsize();
		},
        loadList: function () {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			this.loadBuilding();
		},
        loadBuilding: function () {
            $('#tab_main').find('.build-list').html('<img  src="css/images/waiting.gif" style="height: 90px;margin-top: 50%;margin-left: 35%;margin-bottom: 86%;"></img>');
			$.ajax({
				type: 'get',
				url: "/Project/BCPS/API/Building",
				dataType: "json",
				context:this,
				error: function (result) {
					//$('#tab_main').find('.content').pullToRefreshDone();
					$.toast("网络异常", "forbidden");
				},
				success: function (result) {
					if(result.flag)
					{
						$('#tab_main').find('.build-list').empty();
						for(var i=0;i<result.aaData.length;i++)
						{
							var item = $('<div id=' + result.aaData[i].Group.GroupID + ' class="weui-panel weui-panel_access" ><div class="weui-panel__bd">'
								    + '   <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg" style="padding-right: 5px;">'
								    // + '                <div class="weui-media__hd" style="width:80px;height:80px;">'
								    // + '                    <img class="weui-media__thumb" src="' + result.aaData[i].imgUrl+ '" alt="">'
								    // + '                </div>'
								    + '                <div class="weui-media__bd">'
								    + '                    <h4 class="weui-media__title">' + result.aaData[i].name +  '</h4>'
								    + '                   <p class="weui-media__desc" style="line-height: 1.5;">今日电量：<font class="today">' + TUI.Utils.floatPrecision(result.aaData[i].SumEnergy, 2) + '</font>&nbsp;度</p>'
								    + '                   <p class="weui-media__desc" style="line-height: 1.5;">今日水量：<font class="month">' + TUI.Utils.floatPrecision(result.aaData[i].SumTapWater + result.aaData[i].SumRecycledWater, 2) + '</font>&nbsp;吨</p>'
								    // + '                   <p class="weui-media__desc" style="line-height: 1.5;">入&nbsp;&nbsp;住&nbsp;&nbsp;率：<font>' + result.aaData[i].Occupancy + '</font>&nbsp;%</p>'
                                    + '                 <ul class="weui-media__info" style=" margin-top: -15px;padding-bottom: 0px;float: right;"><li class="weui-media__info__meta" style=" padding-right: 0px;">' + TUI.Utils.dateMessage(result.aaData[i].time) + '</li></ul>'
								    + '                </div>'
                                    + '<span class="weui-cell__ft" style="margin-top: -55px;"><i class="icon iconfont">&#xe61f;</i></span>'
								    + '            </a>'
								    + '        </div></div>');
							item.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this, item: result.aaData[i].Group, imgUrl: result.aaData[i].BigimgUrl }, function (e) {
								$(".tab_pannel").hide();
								$("#btnRefresh").hide();
								$("#appmenu").hide();
								$(".detail").show();
								$("#btnBackList").show();
								$("#btnBack").hide();
								$("#btnShare").show();
								$(".title").html("<b>" + e.data.item.GroupName + "</b>");
								e.data.handle.GroupFullTag = e.data.item.GroupFullTag;
								e.data.handle.GroupName = e.data.item.GroupName;
								e.data.handle.loadBuildingDetail();
								return false;
							});
							$('#tab_main').find('.build-list').append(item);
						}
					}
				}
			});
        },
        loadBuildingDetail: function () {
            $(".detail .content").empty();
            var html = $('<div id="EnergyActiveItem"  style="right:2px;position: absolute;left: 0px;"></div>'
                        + '<div id="EnergyActiveTime" style="right:2px;position: absolute;left: 0px;height: 260px;border: 1px #E5E5E5 solid;"></div>');
            $(".detail .content").append(html);
            this.loadBuildingDetailData();
        },
        loadBuildingDetailData: function () {
            if (this.dataType == "1") {
                this.classtag = "ElectMeter";
                this.attrtag = "ElecProperty";
                this.valuetag = "TotalE";
                this.totaltitle = "建筑总用电";
            }
            else if (this.dataType == "2") {
                this.classtag = "ElectMeter";
                this.attrtag = "TypeProperty";
                this.valuetag = "TotalProperty";
                this.totaltitle = "分户性质合计";
            }
            else if (this.dataType == "3") {
                this.classtag = "ElectMeter";
                this.attrtag = "ElectType";
                this.valuetag = "Public";
                this.totaltitle = "公共部分合计";
                price = this.elecprice;
            } else if (this.dataType == "4") {
                this.classtag = "WaterMeter";
                this.attrtag = "WaterType";
                this.totaltitle = "总用水量";
                this.valuetag = "TotalWater";
            }
            $.ajax({
                type: 'get',
                url: "/Project/BCPS/API/EnumList?classtag=" + this.classtag + "&attrtag=" + this.attrtag,
                dataType: "json",
                context: this,
                error: function (result) {
                    $.toast("网络异常", "forbidden");
                },
                success: function (result) {
                    $("#EnergyActiveItem").empty();
                    $("#EnergyActiveItem").append('<div style="top:0px;width: 100%;position: absolute;height: 110px;border: 1px #E5E5E5 solid;border-top: 0px;border-right: 0px;background-color: #05a972;color: #fff;"><div style="position: absolute;top: 15px;left: 0px;width:100%;text-align: center;" >' + this.totaltitle + '(' + this.unit + ')</div><div id="total"  style="position: absolute;top: 32px;left: 0;font-size: 50px;width: 100%;text-align: center;font-weight: bold;">---- </div><div id ="selectmonth" style="position: absolute;left: 10px;top: 15px;float: right;border: 1px #E5E5E5 solid;cursor: pointer;padding: 0px 5px;border-radius: 5px;font-size: 9pt;">' + this.startTime.getFullYear() + '年' + (this.startTime.getMonth() + 1) + '月</div></div>');
                    for (var i = 0; i < result.list.length; i++) {
                        var item = $('<div style="top:' + (110 + 80 * Math.floor(i / 2)) + 'px;left:' + (i % 2 == 0 ? "0" : "50") + '%;background-color: #FFFFFF;width: 50%;position: absolute;height: 80px;border: 1px #E5E5E5 solid;"><div class="itemimg"><img height="32" width="32" src="css/images/' + this.attrtag + result.list[i].EnumValue + '.png"></img></div><div class="itemtitle">' + result.list[i].EnumKey + '</div><div class="itemvalue" id="' + result.list[i].EnumKey + '">--- <font style="font-size:14px">' + this.unit + '</font></div></div>');
                        $("#EnergyActiveItem").append(item);
                    }
                    if (result.list.length % 2 != 0) {
                        var item = $('<div style="top:' + (110 + 80 * Math.floor(result.list.length / 2)) + 'px;left:50%;width: 50%;position: absolute;height: 80px;background-color: #FFFFFF;border: 1px #E5E5E5 solid;"><div class="itemimg"></div><div class="itemtitle"></div><div class="itemvalue"></div></div>');
                        $("#EnergyActiveItem").append(item);
                    }
                    $("#EnergyActiveItem").height(Math.ceil(result.list.length / 2) * 80 + 120);
                    $('#EnergyActiveTime').css({ top: Math.ceil(result.list.length / 2) * 80 + 120 });

                    $("#selectmonth").picker({
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
                        onClose: function (v) {
                            var year = v.value[0];
                            var month = v.value[1];
                            year = parseInt(year.replace("年", ""), 10);
                            month = parseInt(month.replace("月", ""), 10);
                            var start = new Date(year, month - 1, 1, 0, 0, 0);
                            var end;
                            if (start > new Date()) {
                                $.toast("请选择小于当前年月日期", "forbidden");
                                return;
                            }
                            $("#selectmonth").text(v.value[0] + v.value[1]);
                            if (new Date().getFullYear() == year && new Date().getMonth() == (month - 1)) {
                                TUI.env.myapp.endTime = new Date();
                            } else {
                                var d;
                                if (month == 12) {
                                    d = new Date(year + 1, month, 1, 0, 0, 0);
                                } else {
                                    d = new Date(year, month, 1, 0, 0, 0);
                                }
                                d.setDate(d.getDate() - 1);
                                TUI.env.myapp.endTime = d;
                            }
                            TUI.env.myapp.startTime = start;
                            TUI.env.myapp.loadData();
                        }
                    });
                }
            });
            this.loadData();
        },
        loadData: function () {
            this.Series = [];
            if (this.dataType == "1") {
                this.url = "/Project/ECPS/srv/map/getKPIData.tjs";
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=SumEnergy&groupby=Time&istree=1" });
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=HubLight&groupby=GroupObject&istree=1" });
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=AirEnergy&groupby=GroupObject&istree=1" });
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=FacilitiesEnergy&groupby=GroupObject&istree=1" });
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=HostEnergy&groupby=GroupObject&istree=1" });
            }
            else if (this.dataType == "2") {
                this.url = "/Project/ECPS/srv/map/getKPIData.tjs";
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=TotalEnergy&groupby=Time&istree=1&NodeObjetTag=ElectMeter&NodeAttrTag=EnergyType" });
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=TotalEnergy&groupby=NodeAttr&istree=1&NodeObjetTag=ElectMeter&NodeAttrTag=EnergyType" });
            } else if (this.dataType == "3") {
                this.url = "/Project/ECPS/srv/map/getKPIData.tjs";
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=TotalEnergy&groupby=Time&istree=1&NodeObjetTag=ElectMeter&NodeAttrTag=SubItem" });
                this.Series.push({ url: "/API/System/ECPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=TotalEnergy&groupby=NodeAttr&istree=1&NodeObjetTag=ElectMeter&NodeAttrTag=SubItem" });
            } else if (this.dataType == "4") {
                this.url = "/Project/BCPS/srv/map/getKPIData.tjs";
                this.Series.push({ url: "/API/System/BCPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=SumTapWater&groupby=Time&istree=1" });
                this.Series.push({ url: "/API/System/BCPS/Mining/Statistics/Day?startTime=" + this.startTime.Format("yyyy-MM-dd hh:mm:ss") + "&endTime=" + this.endTime.Format("yyyy-MM-dd hh:mm:ss") + "&GroupName=" + this.GroupName + "&keyvalue=SumRecycledWater&groupby=Time&istree=1" });
            }
            $('#EnergyActiveTime').html('<img  src="css/images/waiting.gif" style="height: 50px;margin-top: 20%;margin-left: 40%;margin-bootm: 30%;"></img>');
            $("#total").html("---- ");
            $.ajax({
                url: this.url,
                data: { Series: TUI.JSON.encode(this.Series) },
                type: "post",
                dataType: "json",
                context: this,
                error: function () {
                    $.toast("禁止操作", "forbidden");
                },
                success: function (result) {
                    var chart = [];
                    if (this.dataType == "1") {
                        this.total = 0;
                        chart.push({
                            type: "column",
                            name: this.startTime.Format("yyyy年MM月"),
                            dataLabels: { format: '{,.2f}' },
                            data: []
                        })
                        for (var i = 0; i < result[0].datas.data.length; i++) {
                            var dateTime = Date.UTC(result[0].datas.data[i].year, result[0].datas.data[i].month - 1, result[0].datas.data[i].day, 0, 0, 0, 0);
                            var fValueData = result[0].datas.data[i].value.DayMeasure;
                            var d = {
                                x: dateTime, name: result[0].datas.data[i].year + "年" + result[0].datas.data[i].month + "月" + result[0].datas.data[i].day + "日",
                                y: TUI.Utils.floatPrecision(fValueData, 2),
                            };
                            this.total += fValueData;
                            chart[0].data.push(d);
                        }
                        this.total = TUI.Utils.floatPrecision(this.total, 2);
                        $("#" + result[1].datas.data[0].key).html(TUI.Utils.floatPrecision(result[1].datas.data[0].value.DayMeasure, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                        $("#" + result[2].datas.data[0].key).html(TUI.Utils.floatPrecision(result[2].datas.data[0].value.DayMeasure, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                        $("#" + result[3].datas.data[0].key).html(TUI.Utils.floatPrecision(result[3].datas.data[0].value.DayMeasure, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                        $("#" + result[4].datas.data[0].key).html(TUI.Utils.floatPrecision(result[4].datas.data[0].value.DayMeasure, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                    } else if (this.dataType == "2") {
                        this.total = 0;
                        chart.push({
                            type: "column",
                            name: this.startTime.Format("yyyy年MM月"),
                            dataLabels: { format: '{,.2f}' },
                            data: []
                        })
                        for (var i = 0; i < result[0].datas.data.length; i++) {
                            var dateTime = Date.UTC(result[0].datas.data[i].year, result[0].datas.data[i].month - 1, result[0].datas.data[i].day, 0, 0, 0, 0);
                            var fValueData = result[0].datas.data[i].value.DayMeasure;
                            var d = {
                                x: dateTime, name: result[0].datas.data[i].year + "年" + result[0].datas.data[i].month + "月" + result[0].datas.data[i].day + "日",
                                y: TUI.Utils.floatPrecision(fValueData, 2),
                            };
                            this.total += fValueData;
                            chart[0].data.push(d);
                        }
                        this.total = TUI.Utils.floatPrecision(this.total, 2);
                        for (var j = 0; j < result[1].datas.data.length; j++) {
                            $("#" + result[1].datas.data[j].name).html(TUI.Utils.floatPrecision(result[1].datas.data[j].value.DayMeasure, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                        }
                    } else if (this.dataType == "3") {
                        this.total = 0;
                        chart.push({
                            type: "column",
                            name: this.startTime.Format("yyyy年MM月"),
                            dataLabels: { format: '{,.2f}' },
                            data: []
                        })
                        for (var i = 0; i < result[0].datas.data.length; i++) {
                            var dateTime = Date.UTC(result[0].datas.data[i].year, result[0].datas.data[i].month - 1, result[0].datas.data[i].day, 0, 0, 0, 0);
                            var fValueData = result[0].datas.data[i].value.DayMeasure;
                            var d = {
                                x: dateTime, name: result[0].datas.data[i].year + "年" + result[0].datas.data[i].month + "月" + result[0].datas.data[i].day + "日",
                                y: TUI.Utils.floatPrecision(fValueData, 2),
                            };
                            this.total += fValueData;
                            chart[0].data.push(d);
                        }
                        this.total = TUI.Utils.floatPrecision(this.total, 2);
                        for (var j = 0; j < result[1].datas.data.length; j++) {
                            $("#" + result[1].datas.data[j].name).html(TUI.Utils.floatPrecision(result[1].datas.data[j].value.DayMeasure, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                        }
                    } else if (this.dataType == "4") {
                        this.total = 0;
                        var SumTapWater = 0;
                        var SumRecycledWater = 0;
                        chart.push({
                            type: "column",
                            name: "自来水用量",
                            dataLabels: { format: '{,.2f}' },
                            data: []
                        });
                        chart.push({
                            type: "column",
                            name: "中水用量",
                            color: "rgb(144, 237, 125)",
                            dataLabels: { format: '{,.2f}' },
                            data: []
                        });
                        for (var i = 0; i < result[0].datas.data.length; i++) {
                            var dateTime = Date.UTC(result[0].datas.data[i].year, result[0].datas.data[i].month - 1, result[0].datas.data[i].day, 0, 0, 0, 0);
                            var fValueData = result[0].datas.data[i].value.DayMeasure;
                            var d = {
                                x: dateTime, name: result[0].datas.data[i].year + "年" + result[0].datas.data[i].month + "月" + result[0].datas.data[i].day + "日",
                                y: TUI.Utils.floatPrecision(fValueData, 2),
                            };
                            this.total += fValueData;
                            SumTapWater += fValueData;
                            chart[0].data.push(d);
                        }
                        for (var i = 0; i < result[1].datas.data.length; i++) {
                            var dateTime = Date.UTC(result[1].datas.data[i].year, result[1].datas.data[i].month - 1, result[1].datas.data[i].day, 0, 0, 0, 0);
                            var fValueData = result[1].datas.data[i].value.DayMeasure;
                            var d = {
                                x: dateTime, name: result[1].datas.data[i].year + "年" + result[1].datas.data[i].month + "月" + result[1].datas.data[i].day + "日",
                                y: TUI.Utils.floatPrecision(fValueData, 2),
                            };
                            this.total += fValueData;
                            SumRecycledWater += fValueData;
                            chart[1].data.push(d);
                        }
                        this.total = TUI.Utils.floatPrecision(this.total, 2);
                        $("#自来水").html(TUI.Utils.floatPrecision(SumTapWater, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                        $("#中水").html(TUI.Utils.floatPrecision(SumRecycledWater, 0) + ' <font style="font-size:10pt;">' + this.unit + '</font>');
                    }
                    

                    $('#EnergyActiveTime').highcharts({
                        chart: {
                            type: 'column',
                            marginTop: 40,
                            marginLeft: 50,
                            marginRight: 20
                        },
                        title: null,
                        exporting: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: null,
                        },
                        plotOptions: {
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: { 
                                minute: '%H:%M',
                                hour: '%H点',
                                day: '%m月%d日', 
                                week: '%m月%d日', 
                                month: '%Y年%m月', 
                                year: '%Y年' 
                            },
                            min: Date.UTC(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), 0, 0, 0, 0),
                            max: Date.UTC(this.endTime.getFullYear(), this.endTime.getMonth(), this.endTime.getDate(), 0, 0, 0, 0),
                        },
                        yAxis: [{
                            title: {
                                text: null
                            },
                            dataLabels: { format: '{y:,.2f}' }
                        }],
                        tooltip: {
                            shared: true,
                            valueDecimals: 2,
                            formatter: function () {
                                return this.points[0].key + ':' + this.points[0].y + TUI.env.myapp.unit;
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        series: chart
                    });
                    $("#total").html(TUI.Utils.formatNumber(this.total, "#,###.##"));
                }
            });
        },
		show: function (speed) {

        },
        hide: function (speed) {

        },
        onsize: function () {
            $(".detail .content").height($(window).height() - 100);
        }
    };
};
