MyApp = function (container, config) {
	return {
		init: function () {
			this.container = container;
			this.config = config ? config : {};
			//
			this.now =  new Date();
			// this.startTime = this.now.DateAdd('h',-1).Format("yyyy-MM-dd hh:00:00");
			this.startTime = this.now.Format("yyyy-MM-dd 00:00:00");
			this.endTime = this.now.Format("yyyy-MM-dd hh:mm:ss");
			
			this.updateToken();
			//
			window.addEventListener("popstate", function (e) {
				$('#tab_main').find('.subtitle_bar .back').trigger(TUI.env.ua.clickEventUp);
			}, false);
			//
			$('#title_bar').find('.back').bind(TUI.env.ua.clickEventUp, {handle: this}, function (e) {
				window.location.href = document.referrer;
				return false;
			});
			this.loadTab();
		},
		updateToken: function () {
			$.ajax({
				type: 'get',
				url: '/API/WeiXin/AccessToken',
				dataType: "json",
				context: this,
				error: function (result) {},
				success: function (result) {
					TUI.env.wx = result;
					TUI.env.wx.ready = false;
					//
					if (result.appid != "") {
						wx.config({
							beta:true,
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
						setTimeout("TUI.env.mobile.updateToken();", (result.expires - result.lasttime) * 1000);
					}
				}
			});
		},
		loadTab: function () {
			$("#tab_body").empty();
			$("#tab_body").append('<div class="content"></div>');
			var h = '<div class="chooseTab">'
			h += '<div class="weui_panel weui_panel_access">'
			h += '	<div class="weui_grids">'
			h += '		<a href="javascript:;" class="weui-grid js-grid" id="ECPS">'
			h += '          <div class="weui-grid__icon"><img src="images/ECPS.png" alt></div>'
			h += '          <p class="weui-grid__label">校园电能</p>'
			h += '      </a>'
			h += '		<a href="javascript:;" class="weui-grid js-grid" id="WCPS">'
			h += '          <div class="weui-grid__icon"><img src="images/WCPS.png" alt></div>'
			h += '          <p class="weui-grid__label">给水管网</p>'
			h += '      </a>'
			h += '		<a href="javascript:;" class="weui-grid js-grid" id="CCPS">'
			h += '          <div class="weui-grid__icon"><img src="images/CCPS.png" alt></div>'
			h += '          <p class="weui-grid__label">公寓预付费</p>'
			h += '      </a>'
			h += '		<a href="javascript:;" class="weui-grid js-grid" id="LCPS">'
			h += '          <div class="weui-grid__icon"><img src="images/LCPS.png" alt></div>'
			h += '          <p class="weui-grid__label">校园路灯</p>'
			h += '      </a>'
			h += '		<a href="javascript:;" class="weui-grid js-grid" id="PCPS">'
			h += '          <div class="weui-grid__icon"><img src="images/PCPS.png" alt></div>'
			h += '          <p class="weui-grid__label">变电所管理</p>'
			h += '      </a>'
			h += '		<a href="javascript:;" class="weui-grid js-grid" id="HCPS">'
			h += '          <div class="weui-grid__icon"><img src="images/HCPS.png" alt></div>'
			h += '          <p class="weui-grid__label">校园供暖</p>'
			h += '      </a>'
			h += '	</div>'
			h += '</div>'
			h += '</div>';
			$("#tab_body").find(".content").html(h);
			//
			$("#tab_body").find("#ECPS").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				e.preventDefault();
				var id=$(this).attr("id");
				var CPSName=$(this).find(".weui-grid__label").text();
				TUI.env.SearchMeter.showCPSNodeList(id,CPSName,'#');
				return false;
			});
			//
			$("#tab_body").find("#WCPS").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				e.preventDefault();
				var id=$(this).attr("id");
				var CPSName=$(this).find(".weui-grid__label").text();
				TUI.env.SearchMeter.showCPSNodeList(id,CPSName,'#');
				return false;
			});
			//
			$("#tab_body").find("#CCPS").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				e.preventDefault();
				var id=$(this).attr("id");
				var CPSName=$(this).find(".weui-grid__label").text();
				TUI.env.SearchMeter.showCPSNodeList(id,CPSName,'#');
				return false;
			});
			//
			$("#tab_body").find("#LCPS").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				e.preventDefault();
				var id=$(this).attr("id");
				var CPSName=$(this).find(".weui-grid__label").text();
				TUI.env.SearchMeter.showCPSNodeList(id,CPSName,'#');
				return false;
			});
			//
			$("#tab_body").find("#PCPS").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				e.preventDefault();
				var id=$(this).attr("id");
				var CPSName=$(this).find(".weui-grid__label").text();
				TUI.env.SearchMeter.showCPSNodeList(id,CPSName,'#');
				return false;
			});
			//
			$("#tab_body").find("#HCPS").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				e.preventDefault();
				var id=$(this).attr("id");
				var CPSName=$(this).find(".weui-grid__label").text();
				TUI.env.SearchMeter.showCPSNodeList(id,CPSName,'#');
				return false;
			});
			//
			$('#tab_body').show();
		},
		showCPSNodeList: function (id,CPSName,parent,NodeName) {
			// console.log(id,CPSName,NodeName);
			if(NodeName==undefined){
				var Tname=CPSName;
			}else{
				var Tname =NodeName.split(".")[NodeName.split(".").length - 1];
			}
			var tHtml = '<div class="content"></div>'
			$('#tab_main').find('.subtitle_bar').empty();
			$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>' + Tname + '</span><span class="save"  style="float:right;padding:8px 10px 5px 10px;color:#ef4f4f;"></span>');
			$('#tab_main').find('.subtitle_body').html(tHtml);
			var h = '<div class="main"></div>';
			$('#tab_main').find('.subtitle_body').find(".content").html(h);
			//
			$('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
				if(parent.split(".").length == 2){
					TUI.env.SearchMeter.showCPSNodeList(id,CPSName,parent.split(".").slice(0, parent.split(".").length - 1).join("."));
				}else if (parent.split(".").length > 2 && parent != "") {
                    TUI.env.SearchMeter.showCPSNodeList(id,CPSName,parent.split(".").slice(0, parent.split(".").length - 1).join("."),NodeName.split(".").slice(0, NodeName.split(".").length - 1).join("."));
                } else {
					TUI.env.SearchMeter.loadTab();
					//
					$('#tab_main').hide();
                }
                return false;
            });
			$.showLoading();
			$.ajax({
				type: 'get',
				url: '/Project/'+id+'/srv/getGroupNodeTree.ejs?appid=AppMap&parent='+parent,
				dataType: "json",
				context: this,
				error: function (result) {},
				success: function (result) {
					var h = '<div class="main"><div class="message">';
					h += '<div class="weui_cells weui_cells_access" id="Node_list">'
						for (var i = 0; i < result.length; i++) {
							h += ' <a class="weui_cell" href="javascript:;">'
							if(!result[i].children&&result[i].li_attr.type=='node'){
								if (result[i].li_attr.OnLineFlag) {
                                    h += '<img src="images/green.png" height="20px" width="20px" style="vertical-align: middle;">'
                                } else {
                                    h += '<img src="images/gray.png" height="20px" width="20px" style="vertical-align: middle;">'
                                }
							}
							h += '  <div class="weui_cell_bd weui_cell_primary node" id="' + result[i].id + '" data-tag="' + (result[i].li_attr.GroupFullTag==undefined ? result[i].li_attr.NodeFullTag : result[i].li_attr.GroupFullTag)+ '" data-name="' + (result[i].li_attr.GroupFullName==undefined?result[i].li_attr.NodeFullName:result[i].li_attr.GroupFullName)+'" data-children="' + result[i].children+'"data-online="'+result[i].li_attr.OnLineFlag+'"data-type="'+result[i].li_attr.type+'">'
							h += '  <p class="nodeName">' + result[i].text + '</p>'
							h += ' </div>'
							h += '<div class="weui_cell_ft">'
							h += ' </div>'
							h += ' </a>'
						}
					h += '  </div>';
					h += '  </div></div>';
					$('#tab_main').find('.subtitle_body').find(".content").find('.main').html(h);
					if(result.length == 0) {
						var h = '<div class="main"><div class="message">'; 
						h += '  <span style="line-height: 55px;font-size: 18px;padding-left: 30px;color:#999;">无设备</span>'
						h += '  </div></div>';
						$('#tab_main').find('.subtitle_body').find(".content").find('.main').html(h);
					}
					//
					$('#Node_list').find(".weui_cell_bd.weui_cell_primary.node").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
						var OnLineFlag=$(this).data("online");
						var ifchildren=$(this).data("children");
						var type=$(this).data("type");
						if(ifchildren=='false'&&type=='node'){
							TUI.env.SearchMeter.showNodeCord(id,CPSName,$(this).data("tag"),$(this).data("name"),OnLineFlag);
						}else if(ifchildren=='true'||type=='group'){
							TUI.env.SearchMeter.showCPSNodeList(id,CPSName,$(this).data("tag"),$(this).data("name"));
						}
						return false;
					});
					$.hideLoading();
				}
			});
			//
			$('#tab_main').show();
		},
		showNodeCord: function (id,CPSName,parent,NodeName,OnLineFlag) {
			// console.log(id,CPSName,parent,NodeName);
			var Tname = NodeName.split(".")[NodeName.split(".").length - 1];
            var tHtml = '<div class="content"></div>'
			$('#tab_main').find('.subtitle_bar').empty();
			$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>' + Tname + '</span><span class="save"  style="float:right;padding:8px 10px 5px 10px;color:#ef4f4f;"></span>');
			$('#tab_main').find('.subtitle_body').html(tHtml);
			//
			$.showLoading();
			if(id=='WCPS'){
				var TJSName = 'getWaterMeter';
			}else{
				var TJSName = 'getMeterData';
			}
			$.ajax({
				type: 'get',
				url: '/Project/'+id+'/SRV/monit/'+TJSName+'.ejs?path='+parent,
				dataType: "json",
				context: this,
				error: function (result) {},
				success: function (result) {
					if(id=='ECPS'){
						//属性值
						var EnergyItem = result.ObjectAttr[result.ObjectInfo.AttrMap.EnergyItem].EnumKey;
						var SubItem = result.ObjectAttr[result.ObjectInfo.AttrMap.SubItem].EnumKey;
						var EnergyType = result.ObjectAttr[result.ObjectInfo.AttrMap.EnergyType].EnumKey;
						var Price = result.ObjectAttr[result.ObjectInfo.AttrMap.Price].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.Price].AttrUnit;
						var Ratio = result.ObjectAttr[result.ObjectInfo.AttrMap.Ratio].EnumKey;
						var Level = result.ObjectAttr[result.ObjectInfo.AttrMap.Level].EnumKey;
						var TypeName = result.TypeName;
						var STNO = result.STNO;
						var OrganizeName = result.OrganizeName;
						var Other = result.ObjectAttr[result.ObjectInfo.AttrMap.IsPublic].AttrValue?'公共用电':'非公共用电'+ result.ObjectAttr[result.ObjectInfo.AttrMap.IsRoom].AttrValue?'房间用电':'非房间用电';
						//参量数据
						var TotalEnergy = result.OPCValueList[result.OPCValueMap.TotalEnergy].DataValue+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit;
						var Ep = result.OPCValueList[result.OPCValueMap.Ep].DataValue+' '+result.OPCValueList[result.OPCValueMap.Ep].DataUnit;
						var P = result.OPCValueList[result.OPCValueMap.P].DataValue+' '+result.OPCValueList[result.OPCValueMap.P].DataUnit;
						var DataOffset = result.OPCValueList[result.OPCValueMap.TotalEnergy].DataOffset+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit;
						var DayMeasure = result.OPCValueList[result.OPCValueMap.TotalEnergy].DayMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit;
						var DayMinMeasure = result.OPCValueList[result.OPCValueMap.TotalEnergy].DayMinMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.TotalEnergy].DayMinMeasureTime)+')';
						var MonthMeasure = result.OPCValueList[result.OPCValueMap.TotalEnergy].MonthMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit;
						var DayMaxMeasure = result.OPCValueList[result.OPCValueMap.TotalEnergy].DayMaxMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.TotalEnergy].DayMaxMeasureTime)+')';
						if(result.TypeName=='单相导轨式电能表'){
							var U = result.OPCValueList[result.OPCValueMap.U].DataValue+' '+result.OPCValueList[result.OPCValueMap.U].DataUnit; 
						}else{
							var Ua = result.OPCValueList[result.OPCValueMap.Ua].DataValue+' '+result.OPCValueList[result.OPCValueMap.Ua].DataUnit;
							var Ub = result.OPCValueList[result.OPCValueMap.Ub].DataValue+' '+result.OPCValueList[result.OPCValueMap.Ub].DataUnit;
							var Uc = result.OPCValueList[result.OPCValueMap.Uc].DataValue+' '+result.OPCValueList[result.OPCValueMap.Uc].DataUnit;
						}
						var MonthMinMeasure = result.OPCValueList[result.OPCValueMap.TotalEnergy].MonthMinMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalEnergy].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.TotalEnergy].MonthMinMeasureTime)+')';
						var OnLineTime = result.OnLineTime;
						//
						var h='<div class="msgBox">'
							h+='    <div class="msgBox-title">'
							h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
							h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							h+='    	 <div class="msgBox-EnergyItem msgBox-light"><b>用电分项：</b>'+EnergyItem+'</div>'
							h+='       <div class="msgBox-SubItem msgBox-light"><b>用电子项：</b>'+SubItem+'</div>'
							h+='       <div class="msgBox-EnergyType msgBox-light"><b>用电性质：</b>'+EnergyType+'</div>'
							h+='       <div class="msgBox-Price msgBox-light"><b>用电单价：</b><span>'+Price+'</span></div>'
							h+='       <div class="msgBox-Ratio msgBox-light"><b>计量倍率：</b><span>'+Ratio+'</span></div>'
							h+='       <div class="msgBox-Level msgBox-light"><b>计量级别：</b>'+Level+'</div>'
							h+='       <div class="msgBox-TypeName msgBox-light"><b>电表类型：</b>'+TypeName+'</div>'
							h+='       <div class="msgBox-TypeName msgBox-light"><b>通讯站号：</b>'+STNO+'</div>'
							h+='       <div class="msgBox-OrganizeName msgBox-light"><b>隶属部门：</b>'+OrganizeName+'</div>'
							h+='       <div class="msgBox-Other msgBox-light"><b>其他属性：</b>'+Other+'</div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							h+='       <div class="msgBox-TotalEnergy msgBox-light"><b>累计电量：</b>'+TotalEnergy+'</div>'
							h+='       <div class="msgBox-Ep msgBox-light"><b>表具示数：</b>'+Ep+'</div>'
							h+='       <div class="msgBox-P msgBox-light"><b>有功功率：</b>'+P+'</div>'
							h+='       <div class="msgBox-DataOffset msgBox-light"><b>当前用电：</b>'+DataOffset+'</div>'
							h+='       <div class="msgBox-DayMeasure msgBox-light"><b>今日用电：</b>'+DayMeasure+'</div>'
							h+='       <div class="msgBox-DayMinMeasure msgBox-light"><b>日最小用量：</b><span>'+DayMinMeasure+'</span></div>'
							h+='       <div class="msgBox-MonthMeasure msgBox-light"><b>本月用电：</b><span>'+MonthMeasure+'</span></div>'
							h+='       <div class="msgBox-Level msgBox-light"><b>最大日用电：</b>'+DayMaxMeasure+'</div>'
							if(result.TypeName=='单相导轨式电能表'){
								h+='       <div class="msgBox-Ua msgBox-light"><b>实时电压：</b>'+U+'</div>'
							}else{
								h+='       <div class="msgBox-Ua msgBox-light"><b>A相电压：</b>'+Ua+'</div>'
								h+='       <div class="msgBox-Ub msgBox-light"><b>B相电压：</b>'+Ub+'</div>'
								h+='       <div class="msgBox-Uc msgBox-light"><b>C相电压：</b>'+Uc+'</div>'
							}
							h+='       <div class="msgBox-MonthMinMeasure msgBox-light"><b>最小月用电：</b>'+MonthMinMeasure+'</div>'
							h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
							h+='    </div>'
							h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
					}else if(id=='WCPS'){
						var tc = new Date();
					    var now = new Date(tc.getFullYear(),tc.getMonth(),tc.getDate(),0,0,0,0);
						//属性值
						var Use = result.WaterMeter.ObjectInfo.AttrMap["Use"] == undefined ? '总表':result.WaterMeter.ObjectAttr[result.WaterMeter.ObjectInfo.AttrMap.Use].EnumKey;
						var DN = result.WaterMeter.ObjectAttr[result.WaterMeter.ObjectInfo.AttrMap.DN].AttrValue+' '+result.WaterMeter.ObjectAttr[result.WaterMeter.ObjectInfo.AttrMap.DN].AttrUnit;
						var NodeAddress = result.WaterMeter.NodeAddress;
						var Price = result.WaterMeter.ObjectAttr[result.WaterMeter.ObjectInfo.AttrMap.Price].AttrValue+' '+result.WaterMeter.ObjectAttr[result.WaterMeter.ObjectInfo.AttrMap.Price].AttrUnit;
						var IsLeakage = result.WaterMeter.ObjectInfo.IsLeakage?(result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.Leakage].DataValue>0&&TUI.Utils.parseDate(result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.Leakage].DataTime)>=now?'<span style="background-color: #D84C49;color: #fff;padding: 3px 6px;">可能漏水</span> ('+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.Leakage].DayMinMeasure+'吨/小时)':'没有漏水'):'不检测';
						var STNO = result.WaterMeter.STNO;
						//参量数据
						var AllFlux = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DataValue+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DataUnit;
						var TotalFlux = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.TotalFlux].DataValue+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.TotalFlux].DataUnit;
						var InstFlux = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.InstFlux].DataValue+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.InstFlux].DataUnit;
						var HourMeasure = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].HourMeasure+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DataUnit;
						var DayMeasure = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DayMeasure+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DataUnit;
						var MonthMeasure = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].MonthMeasure+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DataUnit;
						var MonthMeasureMoney = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].MonthMeasure*result.WaterMeter.ObjectAttr[result.WaterMeter.ObjectInfo.AttrMap.Price].AttrValue+' 元';
						var DayMinMeasure = result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DayMinMeasure+' '+result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DataUnit+' ('+TUI.Utils.dateMessage(result.WaterMeter.OPCValueList[result.WaterMeter.OPCValueMap.AllFlux].DayMinMeasureTime)+')';
						var OnLineTime = result.WaterMeter.OnLineTime;
						//
						var h='<div class="msgBox">'
							h+='    <div class="msgBox-title">'
							h+='        <div class="msgBox-title-img"><img src="images/'+(result.WaterMeter.OnLineFlag?'green':'gray')+'.png"></div>'
							h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							h+='    	 <div class="msgBox-Use msgBox-light"><b>水资源用途：</b>'+Use+'</div>'
							h+='       <div class="msgBox-DN msgBox-light"><b>水表口径：</b>'+DN+'</div>'
							h+='       <div class="msgBox-NodeAddress msgBox-light"><b>安装地址：</b>'+NodeAddress+'</div>'
							h+='       <div class="msgBox-Price msgBox-light"><b>水费单价：</b><span>'+Price+'</span></div>'
							h+='       <div class="msgBox-IsLeakage msgBox-light"><b>漏水检测：</b><span>'+IsLeakage+'</span></div>'
							h+='       <div class="msgBox-STNO msgBox-light"><b>水表号：</b>'+STNO+'</div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							h+='    	 <div class="msgBox-AllFlux msgBox-light"><b>累计流量：</b>'+AllFlux+'</div>'
							h+='    	 <div class="msgBox-TotalFlux msgBox-light"><b>水表示数：</b>'+TotalFlux+'</div>'
							h+='    	 <div class="msgBox-InstFlux msgBox-light"><b>瞬时流量：</b>'+InstFlux+'</div>'
							h+='    	 <div class="msgBox-HourMeasure msgBox-light"><b>当前用水：</b>'+HourMeasure+'</div>'
							h+='       <div class="msgBox-DayMeasure msgBox-light"><b>今日用水：</b>'+DayMeasure+'</div>'
							h+='       <div class="msgBox-MonthMeasure msgBox-light"><b>本月用水：</b><span>'+MonthMeasure+'</span></div>'
							h+='       <div class="msgBox-MonthMeasureMoney msgBox-light"><b>本月水费：</b>'+MonthMeasureMoney+'</div>'
							h+='       <div class="msgBox-DayMinMeasure msgBox-light"><b>最小日用水：</b>'+DayMinMeasure+'</div>'
							h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
							h+='    </div>'
							h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
					}else if(id=='CCPS'){
						//属性值
						var AmountOfAlarm = result.ObjectAttr[result.ObjectInfo.AttrMap.AmountOfAlarm].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.AmountOfAlarm].AttrUnit;
						var AlarmLoad = result.ObjectAttr[result.ObjectInfo.AttrMap.AlarmLoad].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.AlarmLoad].AttrUnit;
						var MaxUnPay = result.ObjectAttr[result.ObjectInfo.AttrMap.MaxUnPay].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.MaxUnPay].AttrUnit;
						var MaxOnPay = result.ObjectAttr[result.ObjectInfo.AttrMap.MaxOnPay].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.MaxOnPay].AttrUnit;
						var TypeName = result.TypeName;
						var STNO = result.STNO;
						//参量数据
						var Ep = result.OPCValueList[result.OPCValueMap.Ep].DataValue+' '+result.OPCValueList[result.OPCValueMap.Ep].DataUnit;
						var SurplusAmount = result.OPCValueList[result.OPCValueMap.SurplusAmount].DataValue+' '+result.OPCValueList[result.OPCValueMap.SurplusAmount].DataUnit;
						var HourMeasure = result.OPCValueList[result.OPCValueMap.Ep].HourMeasure+' '+result.OPCValueList[result.OPCValueMap.Ep].DataUnit;
						var DayMeasure = result.OPCValueList[result.OPCValueMap.Ep].DayMeasure+' '+result.OPCValueList[result.OPCValueMap.Ep].DataUnit;
						var AlarmWord = TUI.Utils.trim(result.OPCValueList[result.OPCValueMap.AlarmWord].FormatValue);
						var Durations = result.OPCValueList[result.OPCValueMap.Durations].DataValue+' '+result.OPCValueList[result.OPCValueMap.Durations].DataUnit;
						var OnLineTime = result.OnLineTime;
						//
						var h='<div class="msgBox">'
							h+='    <div class="msgBox-title">'
							h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
							h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							h+='       <div class="msgBox-AmountOfAlarm msgBox-light"><b>报警金额：</b>'+AmountOfAlarm+'</div>'
							h+='       <div class="msgBox-AlarmLoad msgBox-light"><b>报警负荷：</b>'+AlarmLoad+'</div>'
							h+='       <div class="msgBox-MaxUnPay msgBox-light"><b>允许透支金额：</b>'+MaxUnPay+'</div>'
							h+='       <div class="msgBox-MaxOnPay msgBox-light"><b>允许囤积金额：</b><span>'+MaxOnPay+'</span></div>'
							h+='       <div class="msgBox-TypeName msgBox-light"><b>电表类型：</b><span>'+TypeName+'</span></div>'
							h+='       <div class="msgBox-STNO msgBox-light"><b>表号：</b>'+STNO+'</div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							h+='    	 <div class="msgBox-Ep msgBox-light"><b>总用电量：</b>'+Ep+'</div>'
							h+='    	 <div class="msgBox-SurplusAmount msgBox-light"><b>总剩余金额：</b>'+SurplusAmount+'</div>'
							h+='    	 <div class="msgBox-HourMeasure msgBox-light"><b>当前用电：</b>'+HourMeasure+'</div>'
							h+='    	 <div class="msgBox-DayMeasure msgBox-light"><b>今日用电：</b>'+DayMeasure+'</div>'
							h+='       <div class="msgBox-AlarmWord msgBox-light"><b>报警状态：</b><span>'+AlarmWord+'</span></div>'
							h+='       <div class="msgBox-Durations msgBox-light"><b>恶性负载发生持续时间阀值：</b>'+Durations+'</div>'
							h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
							h+='    </div>'
							h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
					}else if(id=='LCPS'){
						if(result.ObjectInfo.ObjectTag=="GGSB"){
							//属性值
							var JQD = result.ObjectAttr[result.ObjectInfo.AttrMap.JQD].EnumKey;
							var GH = result.ObjectAttr[result.ObjectInfo.AttrMap.GH].EnumKey;
							var LC = result.ObjectAttr[result.ObjectInfo.AttrMap.LC].EnumKey;
							var XXD = result.ObjectAttr[result.ObjectInfo.AttrMap.XXD].EnumKey;
							var Address = result.ObjectAttr[result.ObjectInfo.AttrMap.Address].AttrValue;
							var U = result.ObjectAttr[result.ObjectInfo.AttrMap.U].EnumKey;
							var TypeName = result.TypeName;
							var STNO = result.STNO;
							//参量数据
							var Illminance = result.OPCValueList[result.OPCValueMap.Illminance].DataValue+' '+result.OPCValueList[result.OPCValueMap.Illminance].DataUnit;
							var OnLineTime = result.OnLineTime;
							//
							var h='<div class="msgBox">'
								h+='    <div class="msgBox-title">'
								h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
								h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='       <div class="msgBox-JQD msgBox-light"><b>精确度：</b>'+JQD+'</div>'
								h+='       <div class="msgBox-GH msgBox-light"><b>功耗：</b>'+GH+'</div>'
								h+='       <div class="msgBox-LC msgBox-light"><b>量程：</b>'+LC+'</div>'
								h+='       <div class="msgBox-XXD msgBox-light"><b>线性度：</b><span>'+XXD+'</span></div>'
								h+='       <div class="msgBox-Address msgBox-light"><b>安装位置：</b><span>'+Address+'</span></div>'
								h+='       <div class="msgBox-U msgBox-light"><b>工作电压：</b><span>'+U+'</span></div>'
								h+='       <div class="msgBox-TypeName msgBox-light"><b>设备类型：</b>'+TypeName+'</div>'
								h+='       <div class="msgBox-STNO msgBox-light"><b>表号：</b>'+STNO+'</div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='    	 <div class="msgBox-Illminance msgBox-light"><b>光通量：</b>'+Illminance+'</div>'
								h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
								h+='    </div>'
								h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
						}else if(result.ObjectInfo.ObjectTag=="LDZM"){
							//属性值
							var DGSL = result.ObjectAttr[result.ObjectInfo.AttrMap.DGSL].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.DGSL].AttrUnit;
							var FHDJ = result.ObjectAttr[result.ObjectInfo.AttrMap.FHDJ].EnumKey;
							var DGLX = result.ObjectAttr[result.ObjectInfo.AttrMap.DGLX].EnumKey;
							var ZMLX = result.ObjectAttr[result.ObjectInfo.AttrMap.ZMLX].EnumKey;
							var TypeName = result.TypeName;
							var STNO = result.STNO;
							//参量数据
							var channel = result.OPCValueList[result.OPCValueMap.channel].DataValue==0?'关闭':'开启';
							var I = result.OPCValueList[result.OPCValueMap.I].DataValue+' '+result.OPCValueList[result.OPCValueMap.I].DataUnit;
							var OnLineTime = result.OnLineTime;
							//
							var h='<div class="msgBox">'
								h+='    <div class="msgBox-title">'
								h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
								h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='       <div class="msgBox-DGSL msgBox-light"><b>灯杆数量：</b>'+DGSL+'</div>'
								h+='       <div class="msgBox-FHDJ msgBox-light"><b>防护等级：</b>'+FHDJ+'</div>'
								h+='       <div class="msgBox-DGLX msgBox-light"><b>灯杆类型：</b>'+DGLX+'</div>'
								h+='       <div class="msgBox-ZMLX msgBox-light"><b>照明类型：</b><span>'+ZMLX+'</span></div>'
								h+='       <div class="msgBox-TypeName msgBox-light"><b>设备类型：</b>'+TypeName+'</div>'
								h+='       <div class="msgBox-STNO msgBox-light"><b>表号：</b>'+STNO+'</div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='    	 <div class="msgBox-channel msgBox-light"><b>通道状态：</b>'+channel+'</div>'
								h+='    	 <div class="msgBox-I msgBox-light"><b>通道电流：</b>'+I+'</div>'
								h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
								h+='    </div>'
								h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
						}else if(result.ObjectInfo.ObjectTag=="controller"){
							//属性值
							var num = result.ObjectAttr[result.ObjectInfo.AttrMap.num].AttrValue+' '+result.ObjectAttr[result.ObjectInfo.AttrMap.num].AttrUnit;
							var Used = result.ObjectAttr[result.ObjectInfo.AttrMap.Used].EnumKey;
							var TypeName = result.TypeName;
							var STNO = result.STNO;
							//参量数据
							var longitude = result.OPCValueList[result.OPCValueMap.longitude].DataValue;
							var latitude = result.OPCValueList[result.OPCValueMap.latitude].DataValue;
							var State = result.OPCValueList[result.OPCValueMap.State].DataValue;
							var OnLineTime = result.OnLineTime;
							//
							var h='<div class="msgBox">'
								h+='    <div class="msgBox-title">'
								h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
								h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='       <div class="msgBox-num msgBox-light"><b>回路数量：</b>'+num+'</div>'
								h+='       <div class="msgBox-Used msgBox-light"><b>启用回路数：</b>'+Used+'</div>'
								h+='       <div class="msgBox-TypeName msgBox-light"><b>设备类型：</b>'+TypeName+'</div>'
								h+='       <div class="msgBox-STNO msgBox-light"><b>表号：</b>'+STNO+'</div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='    	 <div class="msgBox-longitude msgBox-light"><b>经度：</b>'+longitude+'</div>'
								h+='    	 <div class="msgBox-latitude msgBox-light"><b>纬度：</b>'+latitude+'</div>'
								h+='    	 <div class="msgBox-State msgBox-light"><b>开关状态：</b>'+State+'</div>'
								h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
								h+='    </div>'
								h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
						}
					}else if(id=='PCPS'){
							//
							var h='<div class="msgBox">'
							h+='    <div class="msgBox-title">'
							h+='        <div class="msgBox-title-img"><img src="images/'+(OnLineFlag?'green':'gray')+'.png"></div>'
							h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
							h+='    </div>'
							h+='    <div class="msgBox-body">'
							for (let m = 0; m < result.aaData.length; m++) {
								const ele = result.aaData[m];
								h+='       <div class="msgBox-light"><b>'+ele.ValueName+'：</b>'+ele.DataValue+'</div>'
							}
							h+='    </div>'
							h+='</div>';
						$('#tab_main').find('.subtitle_body').find(".content").html(h);
					}else if(id=='HCPS'){
						if(result.ObjectInfo.ObjectTag=="HeatMeter"){
							//属性值
							var DN = result.ObjectAttr[result.ObjectInfo.AttrMap.DN].EnumKey;
							var FlowSensorType = result.ObjectAttr[result.ObjectInfo.AttrMap.FlowSensorType].EnumKey;
							var InstallationMethod = result.ObjectAttr[result.ObjectInfo.AttrMap.InstallationMethod].EnumKey;
							var TypeName = result.TypeName;
							var STNO = result.STNO;
							//参量数据
							var TotalAllHeat = result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataValue+' '+result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataUnit;
							var P = result.OPCValueList[result.OPCValueMap.P].DataValue+' '+result.OPCValueList[result.OPCValueMap.P].DataUnit;
							var InstFlux = result.OPCValueList[result.OPCValueMap.InstFlux].DataValue+' '+result.OPCValueList[result.OPCValueMap.InstFlux].DataUnit;
							var InflowTemp = result.OPCValueList[result.OPCValueMap.InflowTemp].DataValue+' '+result.OPCValueList[result.OPCValueMap.InflowTemp].DataUnit;
							var OutflowTemp = result.OPCValueList[result.OPCValueMap.OutflowTemp].DataValue+' '+result.OPCValueList[result.OPCValueMap.OutflowTemp].DataUnit;
							var AbsTemp = result.OPCValueList[result.OPCValueMap.AbsTemp].DataValue+' '+result.OPCValueList[result.OPCValueMap.AbsTemp].DataUnit;
							var HourMeasure = result.OPCValueList[result.OPCValueMap.TotalAllHeat].HourMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataUnit;
							var DayMeasure = result.OPCValueList[result.OPCValueMap.TotalAllHeat].DayMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataUnit;
							var DayMinMeasure = result.OPCValueList[result.OPCValueMap.TotalAllHeat].DayMinMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.TotalAllHeat].DayMinMeasureTime)+')';
							var MonthMeasure = result.OPCValueList[result.OPCValueMap.TotalAllHeat].MonthMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataUnit;
							var DayMaxMeasure = result.OPCValueList[result.OPCValueMap.TotalAllHeat].DayMaxMeasure+' '+result.OPCValueList[result.OPCValueMap.TotalAllHeat].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.TotalAllHeat].DayMaxMeasureTime)+')';
							var OnLineTime = result.OnLineTime;
							//
							var h='<div class="msgBox">'
								h+='    <div class="msgBox-title">'
								h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
								h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='    	 <div class="msgBox-DN msgBox-light"><b>公称直径：</b>'+DN+'</div>'
								h+='       <div class="msgBox-FlowSensorType msgBox-light"><b>流量传感器类型：</b>'+FlowSensorType+'</div>'
								h+='       <div class="msgBox-InstallationMethod msgBox-light"><b>安装方式：</b>'+InstallationMethod+'</div>'
								h+='       <div class="msgBox-TypeName msgBox-light"><b>电表类型：</b>'+TypeName+'</div>'
								h+='       <div class="msgBox-TypeName msgBox-light"><b>通讯站号：</b>'+STNO+'</div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='    	 <div class="msgBox-TotalAllHeat msgBox-light"><b>累计热量：</b>'+TotalAllHeat+'</div>'
								h+='       <div class="msgBox-P msgBox-light"><b>瞬时功率：</b>'+P+'</div>'
								h+='       <div class="msgBox-InstFlux msgBox-light"><b>瞬时流量：</b>'+InstFlux+'</div>'
								h+='       <div class="msgBox-InflowTemp msgBox-light"><b>进水温度：</b>'+InflowTemp+'</div>'
								h+='       <div class="msgBox-OutflowTemp msgBox-light"><b>回水温度：</b>'+OutflowTemp+'</div>'
								h+='       <div class="msgBox-AbsTemp msgBox-light"><b>进回水温差：</b>'+AbsTemp+'</div>'
								h+='       <div class="msgBox-HourMeasure msgBox-light"><b>当前用热：</b>'+HourMeasure+'</div>'
								h+='       <div class="msgBox-AbsTemp msgBox-light"><b>今日用热：</b>'+DayMeasure+'</div>'
								h+='       <div class="msgBox-DayMinMeasure msgBox-light"><b>日最小用热：</b><span>'+DayMinMeasure+'</span></div>'
								h+='       <div class="msgBox-MonthMeasure msgBox-light"><b>本月用热：</b><span>'+MonthMeasure+'</span></div>'
								h+='       <div class="msgBox-DayMaxMeasure msgBox-light"><b>最大日用热：</b>'+DayMaxMeasure+'</div>'
								h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
								h+='    </div>'
								h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
						}else if(result.ObjectInfo.ObjectTag=="TEMP"){
							//参量数据
							var Temp = result.OPCValueList[result.OPCValueMap.Temp].DataValue+' '+result.OPCValueList[result.OPCValueMap.Temp].DataUnit;
							var DayMinParam = result.OPCValueList[result.OPCValueMap.Temp].DayMinParam+' '+result.OPCValueList[result.OPCValueMap.Temp].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.Temp].DayMinParamTime)+')';
							var DayMaxParam = result.OPCValueList[result.OPCValueMap.Temp].DayMaxParam+' '+result.OPCValueList[result.OPCValueMap.Temp].DataUnit+' ('+TUI.Utils.dateMessage(result.OPCValueList[result.OPCValueMap.Temp].DayMaxParamTime)+')';
							var OnLineTime = result.OnLineTime;
							//
							var h='<div class="msgBox">'
								h+='    <div class="msgBox-title">'
								h+='        <div class="msgBox-title-img"><img src="images/'+(result.OnLineFlag?'green':'gray')+'.png"></div>'
								h+='        <div class="msgBox-title-name"><span>'+Tname+'</span></div>'
								h+='    </div>'
								h+='    <div class="msgBox-body">'
								h+='    	 <div class="msgBox-Temp msgBox-light"><b>温度：</b>'+Temp+'</div>'
								h+='       <div class="msgBox-DayMinParam msgBox-light"><b>日最小温度：</b><span>'+DayMinParam+'</span></div>'
								h+='       <div class="msgBox-DayMaxParam msgBox-light"><b>最大日温度：</b>'+DayMaxParam+'</div>'
								h+='       <div class="msgBox-OnLineTime msgBox-light"><b>通讯时间：</b>'+OnLineTime+'</div>'
								h+='    </div>'
								h+='</div>';
							$('#tab_main').find('.subtitle_body').find(".content").html(h);
						}
					}
					
					$.hideLoading();
				}
			});
			//
			$('#tab_main').find('.back').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                e.preventDefault();
                TUI.env.SearchMeter.showCPSNodeList(id,CPSName,parent.split(".").slice(0, parent.split(".").length - 1).join("."),NodeName.split(".").slice(0, NodeName.split(".").length - 1).join("."));
                return false;
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
			window.location.href = "/API/My/Login/?goto=" + escape("/Webapp/WeiCenter/Mobile/SearchMeter/");
		},
		success: function (result) {
			//初始化用户信息
			TUI.env.us = result;
			//
			TUI.env.SearchMeter = new MyApp();
			TUI.env.SearchMeter.init();
			TUI.env.SearchMeter.show("normal");
		}
	});
});