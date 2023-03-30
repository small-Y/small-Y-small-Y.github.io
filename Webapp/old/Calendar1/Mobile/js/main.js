MyApp = function (container, config) {
    return {
        init: function () {
            this.container = container;
            this.config = config ? config : {};
			//
			var tc = new Date();
			this.currDate= new Date();
			this.currDate.setFullYear(tc.getFullYear(),tc.getMonth(),tc.getDate());
			this.currDate.setHours(0,0,0,0);
			//
			$('#title_bar').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				if (TUI.env.wx.ready) {
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
			//
			$('#title_bar').find(".btn").bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				$('#tab_main').find('.subtitle_bar').empty();
				$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">确定</span>');
				$('#tab_main').find('.subtitle_body').html('<div class="content"><div class="article-list">'
														+'		<div class="weui_cells_title">日程时间</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input class="weui_input" id="startdate" type="text" value="'+e.data.handle.currDate.Format("yyyy-MM-dd")+'">'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">日程安排</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input id="title" class="weui_input" placeholder="请输入日程安排主题..."/>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">日历内容</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<textarea id="content" class="weui_textarea" placeholder="请输入日程安排内容" rows="6"></textarea>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">&nbsp;</div>'
														+'	</div></div>');
				//
				$("#startdate").calendar();
				//
				$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
					$('#tab_main').animate({left:"100%"},function(){
						$('#tab_main').find('.subtitle_body').empty();
						$('#tab_main').hide();
					});
					return false;
				});
				//
				$('#tab_main').find('.ok').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
					var title=$('#title').prop("value");
					if(title=="")
					{
						$.toast("日程安排主题不能为空", "forbidden");
						return;
					}
					var content=$('#content').prop("value");
					if(content=="")
					{
						$.toast("日程安排内容不能为空", "forbidden");
						return;
					}
					var startdate=$('#startdate').prop("value");
					//
					$('#tab_main').animate({left:"100%"},function(){
						$('#tab_main').find('.subtitle_body').empty();
						$('#tab_main').hide();
					});
					//
					$.ajax({
						type: 'PUT',
						url: "/API/Calendar",
						data:{title:title,content:content,allDay:true,start:startdate},
						dataType: "json",
						context:this,
						error: function (result) {
							 $.toast("禁止操作", "forbidden");
						},
						success: function (result) {
							$.toast("保存成功", function() {
							  console.log('close');
							});
							//
							TUI.env.mobile.currDate=TUI.Utils.parseDate(startdate);
							TUI.env.mobile.currDate.setHours(0,0,0,0);
							TUI.env.mobile.loadCalendar(TUI.env.mobile.currDate);
						}
					});
					return false;
				});
				//
				$('#tab_main').show();
				$('#tab_main').animate({left:"0px"});
			});
			//
			$('#tab_body').find(".weekbar").bind("swipe", function (event) {
													if(event.direction === 'left') {
														TUI.env.mobile.currDate=TUI.env.mobile.currDate.DateAdd("d",7);
														TUI.env.mobile.loadCalendar(TUI.env.mobile.currDate);
													}
													else if(event.direction === 'right') {
														TUI.env.mobile.currDate=TUI.env.mobile.currDate.DateAdd("d",-7);
														TUI.env.mobile.loadCalendar(TUI.env.mobile.currDate);
													}
												});
			//
			this.loadCalendar(this.currDate);
			this.updateToken();
        },
		updateToken: function () {
			$.ajax({
                type: 'get',
                url: '/API/WeiXin/AccessToken',
                dataType: "json",
				context:this,
                error: function (result) {
                },
                success: function (result) {
					TUI.env.wx=result;
					TUI.env.wx.ready=false;
					//
					if(result.appid!="")
					{
						wx.config({
							debug: false,
							appId: result.appid,
							timestamp:result.timestamp,
							nonceStr:result.nonceStr,
							signature:result.signature,
							jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','stopRecord','onVoiceRecordEnd','translateVoice','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','chooseImage','uploadImage','getNetworkType','openLocation','getLocation','closeWindow','scanQRCode','showOptionMenu','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem'] 
						});
						//
						wx.ready(function(){
							TUI.env.wx.ready=true;
						});
						//
						setTimeout("TUI.env.mobile.updateToken();",(result.expires-result.lasttime)*1000);
					}
				}
			});
        },
		loadCalendar: function (selDate) {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
			}
			//
			var weekNum=selDate.getDay();
			var weekDay=["日","一","二","三","四","五","六"];
			var tc1=selDate.DateAdd("d",-weekNum);
			var tc2=selDate.DateAdd("d",7-weekNum);
			var weekHtml="";
			$('#title_bar').find('.dateTitle').html(selDate.Format("yyyy年MM月"));
			$('#tab_body').find('.weekbar').empty();
			while(tc1<tc2)
			{
				var notwork=(tc1.getDay()==0 || tc1.getDay()==6)?' style="color:#ccc;"':'';
				if(selDate.getDate()==tc1.getDate())
					var item=$('<div class="weekDay"><p class="dayNum"'+notwork+'>'+weekDay[tc1.getDay()]+'</p><div class="dateNum active">'+tc1.getDate()+'</div><p'+notwork+'>'+tc1.getLunar(3)+'</p></div>');
				else
					var item=$('<div class="weekDay"><p class="dayNum"'+notwork+'>'+weekDay[tc1.getDay()]+'</p><div class="dateNum"'+notwork+'>'+tc1.getDate()+'</div><p'+notwork+'>'+tc1.getLunar(3)+'</p></div>');
				//
				item.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:tc1}, function (e) {
					e.data.handle.currDate=e.data.config;
					e.data.handle.loadCalendar(e.data.config);
				});
				//
				$('#tab_body').find('.weekbar').append(item);
				//
				tc1=tc1.DateAdd("d",1);
			}
			//
			$.ajax({
					type: 'GET',
					url: "srv/getCalendarList.tjs?startTime="+selDate.Format("yyyy-MM-dd")+"&endTime="+(selDate.DateAdd("d",1)).Format("yyyy-MM-dd"),
					dataType: "json",
					context:this,
					error: function (result) {
						$.toast("网络不给力", "forbidden");
					},
					success: function (result) {
						if(!result.flag)
						{
							alert(result.info);
							return;
						}
						//
						$('#tab_body').find('.daylist').empty();
						if(result.weather)
						{
							var item=$('<div class="weui_panel weui_panel_access">'
									+'		<div class="weui_panel_hd" style="padding: 0px;">'
									+'			<div class="weui_media_box" style="color: #666;font-size:12pt;padding:0px;height: 100px;overflow: hidden;">'
									+'				<div class="lt"><span style="font-size:28pt;">'+result.weather.day+'</span><br><span style="font-size:14pt;">'+result.weather.cop+'</span></div>'
									+'				<div class="rt1"><i class="icon-weather-'+result.weather.code1+'"></i></div>'
									+'				<div class="rt2">'+result.weather.text+'<p>'+result.weather.low+'~'+result.weather.high+'℃</p></div>'
									+'			</div>'
									+'		</div>'
									+'</div>');
							//
							$('#tab_body').find('.daylist').append(item);
						}
						//
						if(result.msg.length==0)
						{
							$('#tab_body').find('.daylist').append('<div style="padding:10px;text-align: center;">没有日程事件</div>');
							return;
						}
						//
						for(var i=0;i<result.msg.length;i++)
						{
							var userOperate='';
							if(result.msg[i].appname=="日 历")
							{
								userOperate='<span class="callendar_edit">编辑日程</span>';
							}
							else
							{
								userOperate='<span style="float: right;">'+result.msg[i].appname+'</span>';
							}
							//
							var item=$('<div class="weui_panel weui_panel_access">'
									+'		<div class="weui_panel_hd weui_cells_access"><b style="color: black;font-size: 10.5pt;">'+result.msg[i].title+'</b>'+userOperate+'</div>'
									+'		<div class="weui_panel_hd" style="padding: 0px;">'
									+'			<div class="weui_media_box" style="font-size:12pt;padding: 0px 5px 8px 15px;overflow: hidden;">'
									+'				<div class="weui_media_bd">'
									+'					<div style="margin: 10px 3px 5px 0px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;">'+unescape(unescape(result.msg[i].content))+'</div>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'</div>');
							//
							item.find(".callendar_edit").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,msg:result.msg[i]}, function (e) {
								$('#tab_main').find('.subtitle_bar').empty();
								$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">确定</span>');
								$('#tab_main').find('.subtitle_body').html('<div class="content"><div class="article-list">'
																		+'		<div class="weui_cells_title">日程时间</div>'
																		+'		<div class="weui_cells weui_cells_form">'
																		+'			<div class="weui_cell">'
																		+'				<div class="weui_cell_bd weui_cell_primary">'
																		+'					<input type="hidden" id="msgid" value="'+e.data.msg.id+'">'
																		+'					<input class="weui_input" id="startdate" type="text" value="'+TUI.Utils.parseDate(e.data.msg.time).Format("yyyy-MM-dd")+'">'
																		+'				</div>'
																		+'			</div>'
																		+'		</div>'
																		+'		<div class="weui_cells_title">日程安排</div>'
																		+'		<div class="weui_cells weui_cells_form">'
																		+'			<div class="weui_cell">'
																		+'				<div class="weui_cell_bd weui_cell_primary">'
																		+'					<input id="title" class="weui_input" placeholder="请输入日程安排主题..." value="'+e.data.msg.title+'"/>'
																		+'				</div>'
																		+'			</div>'
																		+'		</div>'
																		+'		<div class="weui_cells_title">日历内容</div>'
																		+'		<div class="weui_cells weui_cells_form">'
																		+'			<div class="weui_cell">'
																		+'				<div class="weui_cell_bd weui_cell_primary">'
																		+'					<textarea id="content" class="weui_textarea" placeholder="请输入日程安排内容" rows="6">'+e.data.msg.content.replace(/<br>/g, "\n")+'</textarea>'
																		+'				</div>'
																		+'			</div>'
																		+'		</div>'
																		+'		<div class="weui_cells_title">&nbsp;</div>'
																		+'	</div></div>');
								//
								$("#startdate").calendar();
								//
								$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
									$('#tab_main').animate({left:"100%"},function(){
										$('#tab_main').find('.subtitle_body').empty();
										$('#tab_main').hide();
									});
									return false;
								});
								//
								$('#tab_main').find('.ok').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
									var title=$('#title').prop("value");
									if(title=="")
									{
										$.toast("日程安排主题不能为空", "forbidden");
										return;
									}
									var content=$('#content').prop("value");
									if(content=="")
									{
										$.toast("日程安排内容不能为空", "forbidden");
										return;
									}
									var startdate=$('#startdate').prop("value");
									var msgid=$('#msgid').prop("value");
									//
									$('#tab_main').animate({left:"100%"},function(){
										$('#tab_main').find('.subtitle_body').empty();
										$('#tab_main').hide();
									});
									//
									$.ajax({
										type: 'POST',
										url: "/API/Calendar",
										data:{id:msgid,title:title,content:content,allDay:true,start:startdate},
										dataType: "json",
										context:this,
										error: function (result) {
											 $.toast("禁止操作", "forbidden");
										},
										success: function (result) {
											$.toast("保存成功", function() {
											  console.log('close');
											});
											//
											TUI.env.mobile.currDate=TUI.Utils.parseDate(startdate);
											TUI.env.mobile.currDate.setHours(0,0,0,0);
											TUI.env.mobile.loadCalendar(TUI.env.mobile.currDate);
										}
									});
									return false;
								});
								//
								$('#tab_main').show();
								$('#tab_main').animate({left:"0px"});
								return false;
							});
							//
							item.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.msg[i]}, function (e) {
								if(!navigator.onLine)
								{
									$.toast("网络不给力", "forbidden");
									return;
								}
								//
								e.data.handle.openCalendar(e.data.config);
								return false;
							});
							//
							$('#tab_body').find('.daylist').append(item);
						}
					}
			});
        },
		openCalendar: function (config) {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			//
			var imgHtml="";
			var previewImage={
								current:'',
								urls: []
							};
			if(config.imgfile!="" && config.imgfile!=undefined)
			{
				imgHtml+=('<img src="'+config.imgfile+'" width="100%" border="0" alt="" style="vertical-align: top;margin-bottom: 5px;"/>');
				previewImage.urls[previewImage.urls.length]=window.location.protocol+'//'+window.location.hostname+":"+window.location.port+config.imgfile;
			}
			//
		    $('#tab_main').find('.subtitle_bar').empty();
		    $('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">分享</span>');
		    $('#tab_main').find('.subtitle_body').html('<div class="article-list write-pad" style="height:100%;background:rgb(255, 255, 252) url(./images/notes-lines.png) left top;line-height: 54px;">'
													+'		<div class="title">' + unescape(unescape(config.title))+ '</div>'
													+'		<div class="note">' + unescape(unescape(config.content))+imgHtml+'<br><span style="float:right;">' + TUI.Utils.parseDate(config.time).Format("yyyy年MM月dd日")+ '</span></div>'
													+'</div>');
			//
			$('#tab_main').find('.subtitle_body .note img').bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,previewImage:previewImage}, function (e) {
				e.data.previewImage.current=$(this)[0].currentSrc;
				wx.previewImage(e.data.previewImage);
				return false;
			});
			//
			$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				$('#tab_main').animate({left:"100%"},function(){
					$('#tab_main').find('.subtitle_body').empty();
					$('#tab_main').hide();
				});
				return false;
			});
			//
			$('#tab_main').find('.ok').bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:config}, function (e) {
				$('#tab_main').animate({left:"100%"},function(){
					$('#tab_main').find('.subtitle_body').empty();
					$('#tab_main').hide();
				});
				//
				$.ajax({
					type: 'PUT',
					url: "/API/Contact/Community",
					data:{subject:config.title,content:config.content,imgurl:config.imgfile,apptag:"Calendar"},
					dataType: "json",
					context:this,
					error: function (result) {
						 $.toast("禁止操作", "forbidden");
					},
					success: function (result) {
						$.toast("分享社区成功", function() {
						  console.log('close');
						});
					}
				});
				return false;
			});
			//
			$('#tab_main').show();
			$('#tab_main').animate({left:"0px"});
		},
		show: function (speed) {
			TUI.env.status="Mobile";
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
				window.location.href="/API/My/Login/?goto="+escape("/Webapp/Calendar/Mobile/");
			},
			success: function (result) {
				//初始化用户信息
				TUI.env.us = result;
				//
				TUI.env.mobile = new MyApp();
				TUI.env.mobile.init();
				TUI.env.mobile.show("normal");
			}
		});
});
