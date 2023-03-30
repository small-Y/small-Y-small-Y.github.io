MyApp = function (container, config) {
    return {
        init: function () {
            this.container = container;
            this.config = config ? config : {};
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
				e.data.handle.loadVideo();
				return false;
			});
			
			//
			$('#tab_body').find('.content').infinite().on("infinite", function() {
				if(TUI.env.mobile.loading
					|| TUI.env.mobile.pagestart==0)
				{
					return;
				}
				//
				TUI.env.mobile.loading=true;
				TUI.env.mobile.loadVideo();
			});
			//
			this.pagestart=0;
			this.loading=true;
			this.loadVideo();
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
		loadVideo: function () {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
			}
			//
			$.ajax({
					type: 'get',
					url: "srv/getVideoList.tjs?pagestart="+this.pagestart,
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
						if(result.data.length==0)
						{
							$('#tab_body').find(".weui-infinite-scroll").remove();
						}
						else
						{
							for(var i=0;i<result.data.length;i++)
							{
								var imgStatus="images/green.png";
								if(result.data[i].VideoStatus!="正常")
									imgStatus="images/red.png";
								//
								var item=$('<div class="weui_panel weui_panel_access">'
											+'		<div class="weui_panel_hd weui_cells_access"><img src="'+imgStatus+'"  height="20px" width="20px" style="vertical-align: middle;"/>&nbsp;<span>'+result.data[i].VideoName+'</span><span style="float:right">'+TUI.Utils.dateMessage(result.data[i].VideoTime)+'</span></div>'
											+'		<div class="weui_panel_hd" style="padding: 0px;">'
											+'			<div class="weui_media_box" style="font-size:12pt;padding: 10px 10px 5px 15px;overflow: hidden;">'
											+'				<div class="weui_media_bd">'
											+'					<img style="width:100%;" src="/API/Video/'+result.data[i].VideoID+'?type=image" alt=""/>'
											+'				</div>'
											+'			</div>'
											+'		</div>'
											+'		<div class="weui_panel_bd weui_cells_access" style="color: #888;font-size: 9pt;text-align: center;padding:8px 15px 8px 20px">'
											+'			<span class="communityt_open" style="float: left;"><i class="icon iconfont" style="font-size:14pt">&#xe608;</i>&nbsp;<label>'+result.data[i].VideoOpen+'</label></span>'
											+'			<span class="community_suggestion"><i class="icon iconfont" style="margin-top: 2px;">&#xe636;</i>&nbsp;<label>'+result.data[i].VideoSuggest+'</label></span>'
											+'			<span class="community_good" style="float: right;"><i class="icon iconfont" style="font-size:14pt">&#xe61a;</i>&nbsp;<label>'+result.data[i].VideoLink+'</label></span>'
											+'		</div>'
											+'</div>');
								//
								item.find(".community_good").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									$.ajax({
												type: 'post',
												url: "srv/goodVideoCount.tjs",
												data:{videoid:e.data.config.VideoID},
												dataType: "json",
												context:this,
												error: function (result) {
													
												},
												success: function (result) {
													if(result.flag)
													{
														if(result.offset>0)
															$(this).addClass("active");
														else
															$(this).removeClass("active");
														//
														$(this).find("label").html(result.link);
													}
												}
									});
									return false;
								});
								//
								item.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									e.data.handle.openVideo(e.data.config);
									return false;
								});
								//
								$('#tab_body').find('.video-list').append(item);
							}
							//
							this.pagestart+=result.data.length;
							if(result.data.length==3)
							{
								this.loading=false;
							}
							else
							{
								$('#tab_body').find('.video-list').append('<div style="padding:10px;text-align: center;">没有更多视频</div>');
								$('#tab_body').find(".weui-infinite-scroll").remove();
							}
						}
					}
				});
		},
		openVideo: function (config) {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			//
			$.ajax({
						type: 'post',
						url: "srv/openVideoCount.tjs",
						data:{videoid:config.VideoID},
						dataType: "json",
						context:this,
						error: function (result) {
							
						},
						success: function (result) {
						}
			});
			//
			var imgStatus="images/green.png";
			if(config.VideoStatus!="正常")
				imgStatus="images/red.png";
			//
		    $('#tab_main').find('.subtitle_bar').empty();
		    $('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">分享</span>');
		    $('#tab_main').find('.subtitle_body').html('<div class="chats-list">'
													+'		<div class="weui_panel weui_panel_access">'
													+'			<div style="padding:0px;">'
													+'				<div class="weui_media_box" style="font-size:12pt;padding: 0px;overflow: hidden;">'
													+'					<div class="weui_media_bd">'
													+'						<img style="width:100%;" src="/API/Video/'+config.VideoID+'.vid?timestamp='+(new Date()).getTime()+'" alt=""/>'
													+'					</div>'
													+'				</div>'
													+'			</div>'
													+'			<div class="weui_panel_bd weui_cells_access" style="color: #888;font-size: 9pt;text-align: left;padding:5px 10px 10px 10px;">'
													+'				<img src="'+imgStatus+'"  height="20px" width="20px" style="vertical-align: middle;"/>&nbsp;<span>'+config.VideoName+'</span>'
													+'				<span style="float:right"><label class="vsuggest active">议论</label>&nbsp;&nbsp;&nbsp;<label class="vscreen">字幕</label></span>'
													+'			</div>'
													+'		</div>'							
													+'		<div class="weui_panel weui_panel_access suggestion"></div>'
													+'	</div>'
													+'	<div class="dosuggest">'
													+'		<div class="call">'
													+'			<form role="form" action="#" onsubmit="return false;">'
													+'				<input type="hidden" id="userCommunit" value="'+config.VideoID+'">'
													+'				<input type="text" id="userCall" value="" placeholder="我也说一句">'
													+'			</form>'
													+'		</div>'
													+'		<div class="image">'
													+'			<i class="icon iconfont">&#xe62b;</i>'
													+'			<lable style="color: #ff0000;font-size: 9pt;top: -10px;right: 3px;position: relative;"></lable>'
													+'		</div>'
													+'	</div>'
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
			TUI.env.mobile.serverIds=[];
			$('#tab_main').find(".dosuggest .image").bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				var lable=$(this).find("lable");
				var localIds = [];
				//微信图片上传
				function syncUpload(localIds){
					var localId = localIds.pop();
					//
					wx.uploadImage({
						localId: localId,
						isShowProgressTips: 1,
						success: function (res) {
							TUI.env.mobile.serverIds[TUI.env.mobile.serverIds.length]=res.serverId;
							lable.html(TUI.env.mobile.serverIds.length);
							//其他对serverId做处理的代码
							if(localIds.length > 0){
								syncUpload(localIds);
							}
						}
					});
				};
				//
				wx.chooseImage({
								success: function (res) {
									//
									localIds = res.localIds;
									syncUpload(localIds);
								}
							});
			});
			//
			TUI.env.mobile.vsuggest=true;
			$('#tab_main').find(".vsuggest").bind(TUI.env.ua.clickEventUp, { handle: this,config:config}, function (e) {
				$(this).addClass("active");
				$('#tab_main').find(".vscreen").removeClass("active");
				e.data.handle.loadSuggestion(config.VideoID,false);
				e.data.handle.vsuggest=true;
			});
			//
			$('#tab_main').find(".vscreen").bind(TUI.env.ua.clickEventUp, { handle: this,config:config}, function (e) {
				$(this).addClass("active");
				$('#tab_main').find(".vsuggest").removeClass("active");
				e.data.handle.loadVideoText(config.VideoID,false);
				e.data.handle.vsuggest=false;
			});
			//
			$('#userCall').keydown(function (e) {
					if (e.keyCode == 13) {
						var userCommunit=$("#userCommunit").prop("value");
						var userCall=$("#userCall").prop("value");
						//
						if(userCall=="")
						{
							return;
						}
						//
						if(TUI.env.mobile.vsuggest)
						{
							$.ajax({
								type: 'post',
								url: "srv/postSuggestion.tjs",
								data:{videoid:userCommunit,suggestion:escape(userCall),accesstoken:TUI.env.wx.access_token,media:TUI.JSON.encode(TUI.env.mobile.serverIds)},
								dataType: "json",
								context:this,
								error: function (result) {
									$.toast("网络不给力", "forbidden");
								},
								success: function (result) {
									if(result.flag)
									{
										$("#userCall").focus();
										$("#userCall").val("");
										//
										$.toast("评论成功", function() {
										  console.log('close');
										});
										//
										TUI.env.mobile.serverIds=[];
										TUI.env.mobile.loadSuggestion(result.videoid,true);
									}
								}
							});
						}
						else
						{
							$.ajax({
								type: 'post',
								url: "srv/postVideoText.tjs",
								data:{videoid:userCommunit,suggestion:escape(userCall),accesstoken:TUI.env.wx.access_token,media:TUI.JSON.encode(TUI.env.mobile.serverIds)},
								dataType: "json",
								context:this,
								error: function (result) {
									$.toast("网络不给力", "forbidden");
								},
								success: function (result) {
									if(result.flag)
									{
										$("#userCall").focus();
										$("#userCall").val("");
										//
										$.toast("推送字幕成功", function() {
										  console.log('close');
										});
										//
										TUI.env.mobile.serverIds=[];
										TUI.env.mobile.loadVideoText(result.videoid,true);
									}
								}
							});
						}
					}
			});
			//
			$('#tab_main').find('.ok').bind(TUI.env.ua.clickEventUp, { handle: this,config:config}, function (e) {
				var tc=new Date();
				$.ajax({
					type: 'PUT',
					url: "/API/Video/"+e.data.config.VideoID,
					data:{saveFile:"/Upload/Video/"+e.data.config.VideoID+"-"+tc.getTime()+".jpg"},
					dataType: "json",
					context:this,
					error: function (result) {
						 $.toast("禁止操作", "forbidden");
					},
					success: function (result) {
					}
				});
				//
				$.ajax({
					type: 'PUT',
					url: "/API/Contact/Community",
					data:{subject:e.data.config.VideoName,content:(e.data.config.VideoTitle==""?"直播分享^_^":e.data.config.VideoTitle),imgurl:"/Upload/Video/"+e.data.config.VideoID+"-"+tc.getTime()+".jpg",apptag:"SmartVideo"},
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
			this.loadSuggestion(config.VideoID,false);
			//
			$('#tab_main').show();
			$('#tab_main').animate({left:"0px"});
		},
		loadSuggestion: function (videoid,last) {
			$.ajax({
					type: 'get',
					url: "srv/getVideoSuggestion.tjs?videoid="+videoid,
					dataType: "json",
					context:this,
					error: function (result) {
						$.toast("网络不给力", "forbidden");
					},
					success: function (result) {
						if(!result.flag)
						{
							$.toast(result.info, "forbidden");
						}
						//
						$('#tab_main').find('.suggestion').empty();
						for(var i=0;i<result.data.length;i++)
						{
							var imgHtml="";
							var previewImage={
												current:'',
												urls: []
											};
							//
							for(var j=0;j<result.data[i].ImageFile.length;j++)
							{
								imgHtml+=('<img src="'+result.data[i].ImageFile[j]+'" width="'+(result.data[i].ImageFile.length==1?100:(result.data[i].ImageFile.length>2?33.33:50))+'%" border="0" alt="" style="vertical-align: top;padding: 3px 3px 0 0;box-sizing: border-box;"/>');
								previewImage.urls[previewImage.urls.length]=window.location.protocol+'//'+window.location.hostname+":"+window.location.port+result.data[i].ImageFile[j];
							}
							//
							var userOperate='';
							if(TUI.env.us.isUserAdmin 
								|| TUI.env.us.userName==result.data[i].T_UserID)
							{
								userOperate='<span class="suggest_delete">删除</span>';
							}
							//
							var item=$('<div class="weui_panel_hd weui_cells_access"><img src="' + result.data[i].T_UserImg+ '"  height="24px" width="24px" class="userimg"/>&nbsp;<b>'+result.data[i].T_UserName+'</b>&nbsp;'+TUI.Utils.dateMessage(result.data[i].T_Time)+'&nbsp;'+userOperate+'<span style="float:right">'+(i+1)+'楼</span></div>'
									+'	<div class="weui_panel_hd" style="padding:10px 15px 5px 15px">'
									+'		<div class="weui_media_box" style="color:#666;font-size:12pt;padding: 0px 0px 0 20px;overflow: hidden;">'
									+'			<div class="weui_media_bd">'
									+'				<p>'+unescape(unescape(result.data[i].T_Body))+'</p>'+imgHtml
									+'			</div>'
									+'		</div>'
									+'	</div>'
									+'</div>');
							//
							item.find(".weui_media_box img").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,previewImage:previewImage}, function (e) {
													e.data.previewImage.current=$(this)[0].currentSrc;
													wx.previewImage(e.data.previewImage);
													return false;
												});
							//
							item.find(".suggest_delete").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									$.confirm("此操作将不可撤销，您是否删除评论？", "确认删除评论?", function() {
										$.ajax({
												type: 'post',
												url: "srv/deleteSuggestion.tjs",
												data:{videoid:e.data.config.T_VideoID,suggestionid:e.data.config.T_SuggestionID},
												dataType: "json",
												context:this,
												error: function (result) {
													
												},
												success: function (result) {
													if(result.flag)
													{
														TUI.env.mobile.loadSuggestion(result.videoid,true);
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
							$('#tab_main').find('.suggestion').append(item);
						}
						//滚动到最底下
						if(last)
						{
							$('#tab_main').find('.subtitle_body .chats-list')[0].scrollTop=$('#tab_main').find('.subtitle_body .chats-list')[0].scrollHeight ;
						}
					}
			});
		},
		loadVideoText: function (videoid,last) {
			$.ajax({
					type: 'get',
					url: "srv/getVideoText.tjs?videoid="+videoid,
					dataType: "json",
					context:this,
					error: function (result) {
						$.toast("网络不给力", "forbidden");
					},
					success: function (result) {
						if(!result.flag)
						{
							$.toast(result.info, "forbidden");
						}
						//
						$('#tab_main').find('.suggestion').empty();
						for(var i=0;i<result.data.length;i++)
						{
							var imgHtml="";
							var previewImage={
												current:'',
												urls: []
											};
							//
							for(var j=0;j<result.data[i].ImageFile.length;j++)
							{
								imgHtml+=('<img src="'+result.data[i].ImageFile[j]+'" width="'+(result.data[i].ImageFile.length==1?100:(result.data[i].ImageFile.length>2?33.33:50))+'%" border="0" alt="" style="vertical-align: top;padding: 3px 3px 0 0;box-sizing: border-box;"/>');
								previewImage.urls[previewImage.urls.length]=window.location.protocol+'//'+window.location.hostname+":"+window.location.port+result.data[i].ImageFile[j];
							}
							//
							var userOperate='';
							if(TUI.env.us.isUserAdmin 
								|| TUI.env.us.userName==result.data[i].T_UserID)
							{
								userOperate='<span class="suggest_delete">删除</span>';
							}
							//
							var item=$('<div class="weui_panel_hd weui_cells_access"><img src="' + result.data[i].T_UserImg+ '"  height="24px" width="24px" class="userimg"/>&nbsp;<b>'+result.data[i].T_UserName+'</b>&nbsp;'+TUI.Utils.dateMessage(result.data[i].T_Time)+'&nbsp;'+userOperate+'<span style="float:right">'+(i+1)+'楼</span></div>'
									+'	<div class="weui_panel_hd" style="padding:10px 15px 5px 15px">'
									+'		<div class="weui_media_box" style="color:#666;font-size:12pt;padding: 0px 0px 0 20px;overflow: hidden;">'
									+'			<div class="weui_media_bd">'
									+'				<p>'+unescape(unescape(result.data[i].T_Body))+'</p>'+imgHtml
									+'			</div>'
									+'		</div>'
									+'	</div>'
									+'</div>');
							//
							item.find(".weui_media_box img").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,previewImage:previewImage}, function (e) {
													e.data.previewImage.current=$(this)[0].currentSrc;
													wx.previewImage(e.data.previewImage);
													return false;
												});
							//
							item.find(".suggest_delete").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									$.confirm("此操作将不可撤销，您是否删除推送字幕？", "确认删除推送字幕?", function() {
										$.ajax({
												type: 'post',
												url: "srv/deleteVideoText.tjs",
												data:{videoid:e.data.config.T_VideoID,videotextid:e.data.config.T_ScreenTextID},
												dataType: "json",
												context:this,
												error: function (result) {
													
												},
												success: function (result) {
													if(result.flag)
													{
														TUI.env.mobile.loadVideoText(result.videoid,true);
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
							$('#tab_main').find('.suggestion').append(item);
						}
						//滚动到最底下
						if(last)
						{
							$('#tab_main').find('.subtitle_body .chats-list')[0].scrollTop=$('#tab_main').find('.subtitle_body .chats-list')[0].scrollHeight ;
						}
					}
			});
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
				window.location.href="/API/My/Login/?goto="+escape("/Webapp/SmartVideo/Mobile/");
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
