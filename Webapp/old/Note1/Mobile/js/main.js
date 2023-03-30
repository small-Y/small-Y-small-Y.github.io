MyApp = function (container, config) {
    return {
        init: function () {
            this.container = container;
            this.config = config ? config : {};
			this.pagestart=0;
			this.pagenumber=10;
			this.loading=false;
			//
			this.loadNote();
			//
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
		loadNote: function () {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
			}
			//
			$('#tab_body').empty();
			$('#tab_body').html('<div class="content">'
							+'		<div class="note-list"></div>'
							+'		<div class="weui-infinite-scroll">'
							+'			<div class="infinite-preloader"></div>'
							+'			正在加载...'
							+'		</div>'
							+' </div>');
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
														+'		<div class="weui_cells_title">便签标题</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input id="title" class="weui_input" placeholder="输入便签标题..."/>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">便签内容</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<textarea id="content" class="weui_textarea" placeholder="请输入便签内容" rows="6"></textarea>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">&nbsp;</div>'
														+'	</div></div>');
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
						$.toast("便签标题不能为空", "forbidden");
						return;
					}
					var content=$('#content').prop("value");
					if(content=="")
					{
						$.toast("便签内容不能为空", "forbidden");
						return;
					}
					//
					$('#tab_main').animate({left:"100%"},function(){
						$('#tab_main').find('.subtitle_body').empty();
						$('#tab_main').hide();
					});
					//
					$.ajax({
						type: 'PUT',
						url: "/API/Note",
						data:{title:title,content:content},
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
							$('#tab_body').find('.note-list').empty();
							TUI.env.mobile.pagestart=0;
							TUI.env.mobile.readNote();
						}
					});
					return false;
				});
				//
				$('#tab_main').show();
				$('#tab_main').animate({left:"0px"});
			});

			$('#tab_body').find('.content').infinite().on("infinite", function() {
				if(TUI.env.mobile.loading
					|| TUI.env.mobile.pagestart==0)
				{
					return;
				}
				//
				TUI.env.mobile.loading=true;
				TUI.env.mobile.readNote();
			});
			//
			this.pagestart=0;
			this.readNote();
        },
		readNote:function(){
			$.ajax({
					type: 'get',
					url: "srv/getNoteList.tjs?pagestart="+this.pagestart+"&pagenumber="+this.pagenumber,
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
						$('#tab_body').find(".content").pullToRefreshDone();
						//
						var count=0;
						for(var key in result.data)
						{
							var panel=$('<div class="weui_panel weui_panel_access">'
								+'		<div class="weui_panel_hd"  style="font-size:12pt;color:#666;"><b>'+key+'</b><span class="number">'+result.data[key].length+'</span></div>'
								+'		<div class="weui_panel_bd"></div>'
								+'</div>');
							//
							for(var i=0;i<result.data[key].length;i++)
							{
								count++;
								var item=$('<div class="weui_media_box weui_media_text" style="padding:10px 15px 15px 15px;">'
										+'	  <p class="weui_media_title" style="font-size: 15px;">'+result.data[key][i].T_Title+'<span style="float:right;">'+TUI.Utils.parseDate(result.data[key][i].T_Time).Format("hh:mm:ss")+'</span></p>'
										+'	  <p class="weui_media_desc" style="font-size: 15px;">'+result.data[key][i].T_Content+'</p>'
										+'	  <div class="msgbtn">'
										+'		<div class="share"><div class="lable">编辑</div></div>'
										+'		<div class="remove"><div class="lable">删除</div></div>'
										+'	   </div>'
										+'	</div>');
								//
								item.bind("swipe", function (event) {
									if(event.direction === 'left') {
										$(this).animate({left:"-120px"});
									}
									else if(event.direction === 'right') {
										$(this).animate({left:"0px"});
									}
								});
								//
								item.find(".share").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: item,config:result.data[key][i]}, function (e) {
									$(e.data.handle).animate({left:"0px"});
									var content=e.data.config.T_Content.replace(/<br>/g, "\n");
									content=content.replace(/&nbsp;/g, " ");
									//
									$('#tab_main').find('.subtitle_bar').empty();
									$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">确定</span>');
									$('#tab_main').find('.subtitle_body').html('<div class="content"><div class="article-list">'
																			+'		<div class="weui_cells_title">便签标题</div>'
																			+'		<div class="weui_cells weui_cells_form">'
																			+'			<div class="weui_cell">'
																			+'				<div class="weui_cell_bd weui_cell_primary">'
																			+'					<input type="hidden" id="noteid" value="'+e.data.config.T_NoteCode+'"/><input id="title" value="'+e.data.config.T_Title+'" class="weui_input" placeholder="输入便签标题..."/>'
																			+'				</div>'
																			+'			</div>'
																			+'		</div>'
																			+'		<div class="weui_cells_title">便签内容</div>'
																			+'		<div class="weui_cells weui_cells_form">'
																			+'			<div class="weui_cell">'
																			+'				<div class="weui_cell_bd weui_cell_primary">'
																			+'					<textarea id="content" class="weui_textarea" placeholder="请输入便签内容" rows="6">'+content+'</textarea>'
																			+'				</div>'
																			+'			</div>'
																			+'		</div>'
																			+'		<div class="weui_cells_title">&nbsp;</div>'
																			+'	</div></div>');
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
										var noteid=$('#noteid').prop("value");
										var title=$('#title').prop("value");
										if(title=="")
										{
											$.toast("便签标题不能为空", "forbidden");
											return;
										}
										var content=$('#content').prop("value");
										if(content=="")
										{
											$.toast("便签内容不能为空", "forbidden");
											return;
										}
										//
										$('#tab_main').animate({left:"100%"},function(){
											$('#tab_main').find('.subtitle_body').empty();
											$('#tab_main').hide();
										});
										//
										$.ajax({
											type: 'POST',
											url: "/API/Note",
											data:{id:noteid,title:title,content:content},
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
												$('#tab_body').find('.note-list').empty();
												TUI.env.mobile.pagestart=0;
												TUI.env.mobile.readNote();
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
								item.find(".remove").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: item,config:result.data[key][i]}, function (e) {
									$.confirm("此操作将不可撤销，您是否删除该便签？", "确认删除便签?", function() {
										$.ajax({
												type: 'DELETE',
												url: "/API/Note",
												data:{id:e.data.config.T_NoteCode},
												dataType: "json",
												context:e.data.handle,
												error: function (result) {
													
												},
												success: function (result) {
													if(result.flag)
													{
														this.remove();
													}
												}
										});
									}, function() {
									   $.toast("取消操作", "cancel", function(toast) {
										  console.log(toast);
										});
									});
									return false;
								});
								//
								item.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[key][i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									e.data.handle.openNote(e.data.config);
									return false;
								});
								//
								panel.find(".weui_panel_bd").append(item);
							}
							//
							$('#tab_body').find('.note-list').append(panel);
						}
						//
						this.pagestart+=count;
						if(count==TUI.env.mobile.pagenumber)
						{
							this.loading=false;
						}
						else
						{
							if(count==0)
								$('#tab_body').find('.note-list').append('<div style="padding:10px;text-align: center;">没有更多内容</div>');
							$('#tab_body').find(".weui-infinite-scroll").remove();
						}
					}
				});
		},
		openNote: function (config) {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			//
		    $('#tab_main').find('.subtitle_bar').empty();
		    $('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">分享</span>');
		    $('#tab_main').find('.subtitle_body').html('<div class="article-list write-pad" style="height:100%;background:rgb(255, 255, 252) url(./images/notes-lines.png) left top;line-height: 54px;">'
													+'		<div class="title">' + config.T_Title+ '</div>'
													+'		<div class="note">' + config.T_Content+ '<br><span style="float:right;">' + TUI.Utils.parseDate(config.T_Time).Format("yyyy年MM月dd日")+ '</span></div>'
													+'</div>');
			//
			$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				$('#tab_main').animate({left:"100%"},function(){
					$('#tab_main').find('.subtitle_body').empty();
					$('#tab_main').hide();
				});
				return false;
			});
			//
			$('#tab_main').find('.ok').bind(TUI.env.ua.clickEventUp, { handle: this,config:config}, function (e) {
				$('#tab_main').animate({left:"100%"},function(){
					$('#tab_main').find('.subtitle_body').empty();
					$('#tab_main').hide();
				});
				//
				$.ajax({
					type: 'PUT',
					url: "/API/Contact/Community",
					data:{subject:config.T_Title,content:config.T_Content,apptag:"Note"},
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
				window.location.href="/API/My/Login/?goto="+escape("/Webapp/Note/Mobile/");
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
