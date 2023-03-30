MyApp = function (container, config) {
    return {
        init: function () {
            this.container = container;
            this.config = config ? config : {};
			this.pagestart=0;
			this.pagenumber=10;
			this.loading=false;
			//
			this.loadBulletin();
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
		loadBulletin: function () {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
			}
			//
			if(!TUI.env.us.isUserAdmin)
			{
				$('#title_bar').find(".btn").html('<i class="icon iconfont" style="font-size:18pt;">&#xe62c;</i>');
			}
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
			$('#tab_body').empty();
			$('#tab_body').html('<div class="content">'
							+'		<div class="bulletin-list"></div>'
							+'		<div class="weui-infinite-scroll">'
							+'			<div class="infinite-preloader"></div>'
							+'			正在加载...'
							+'		</div>'
							+' </div>');
			//
			$('#title_bar').find(".btn").bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				if(!TUI.env.us.isUserAdmin)
				{
					$('#tab_body').empty();
					$('#tab_body').html('<div class="content">'
									+'		<div class="bulletin-list"></div>'
									+'		<div class="weui-infinite-scroll">'
									+'			<div class="infinite-preloader"></div>'
									+'			正在加载...'
									+'		</div>'
									+' </div>');
					//
					e.data.handle.pagestart=0;
					e.data.handle.readBulletin();
					//
					$.toast("刷新成功", function() {
						  console.log('close');
						});
					return false;
				}
				//
				$('#tab_main').find('.subtitle_bar').empty();
				$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">确定</span>');
				$('#tab_main').find('.subtitle_body').html('<div class="content"><div class="article-list">'
														+'		<div class="weui_cells_title">公告标题</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input id="title" class="weui_input" placeholder="输入公告标题..."/>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">公告内容</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<textarea id="content" class="weui_textarea" placeholder="请输入公告内容" rows="6"></textarea>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">公告单位</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input id="deptname" class="weui_input" placeholder="输入公告单位..."/>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">公告联系人</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input id="contact" class="weui_input" placeholder="输入公告联系人..."/>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'		<div class="weui_cells_title">联系电话</div>'
														+'		<div class="weui_cells weui_cells_form">'
														+'			<div class="weui_cell">'
														+'				<div class="weui_cell_bd weui_cell_primary">'
														+'					<input id="mobile" class="weui_input" placeholder="输入联系电话..."/>'
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
						$.toast("公告标题不能为空", "forbidden");
						return;
					}
					var content=$('#content').prop("value");
					if(content=="")
					{
						$.toast("公告内容不能为空", "forbidden");
						return;
					}
					var deptname=$('#deptname').prop("value");
					if(deptname=="")
					{
						$.toast("公告单位不能为空", "forbidden");
						return;
					}
					var contact=$('#contact').prop("value");
					var mobile=$('#mobile').prop("value");
					//
					$('#tab_main').animate({left:"100%"},function(){
						$('#tab_main').find('.subtitle_body').empty();
						$('#tab_main').hide();
					});
					//
					$.ajax({
						type: 'PUT',
						url: "/API/Bulletin",
						data:{title:title,content:content,deptname:deptname,contact:contact,mobile:mobile},
						dataType: "json",
						context:this,
						error: function (result) {
							 $.toast("禁止操作", "forbidden");
						},
						success: function (result) {
							$.toast("发布成功", function() {
							  console.log('close');
							});
							//
							$('#tab_body').find('.bulletin-list').empty();
							TUI.env.mobile.pagestart=0;
							TUI.env.mobile.readBulletin();
						}
					});
					return false;
				});
				//
				$('#tab_main').show();
				$('#tab_main').animate({left:"0px"});
				//
				$.ajax({
						type: 'get',
						url: "/API/My",
						dataType: "json",
						context:this,
						error: function (result) {
							alert("远程服务故障，请检查网络或稍后再试！");
						},
						success: function (result) {
							var now=new Date();
							$('#deptname').val(result.oragnizeName);
							$('#contact').val(result.fullName);
							$('#mobile').val(result.phoneNum);
						}
					});
			});

			$('#tab_body').find('.content').infinite().on("infinite", function() {
				if(TUI.env.mobile.loading
					|| TUI.env.mobile.pagestart==0)
				{
					return;
				}
				//
				TUI.env.mobile.loading=true;
				TUI.env.mobile.readBulletin();
			});
			//
			this.pagestart=0;
			this.readBulletin();
        },
		readBulletin:function(){
			$.ajax({
					type: 'get',
					url: "srv/getBulletinList.tjs?pagestart="+this.pagestart+"&pagenumber="+this.pagenumber,
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
								var userOperate='';
								if(TUI.env.us.isUserAdmin
									&& TUI.env.us.userID==result.data[i].T_UserID)
								{
									userOperate='<span class="bulletin_delete">删除</span>';
								}
								//
								var item=$('<div class="weui_panel weui_panel_access">'
										+'		<div class="weui_panel_hd weui_cells_access"><b style="color: black;font-size: 10.5pt;">'+result.data[i].T_Title+'</b>&nbsp;<span style="float: right;">'+userOperate+'</span></div>'
										+'		<div class="weui_panel_hd" style="padding: 0px;">'
										+'			<div class="weui_media_box" style="font-size:12pt;padding: 0px 5px 8px 15px;overflow: hidden;">'
										+'				<div class="weui_media_bd">'
										+'					<div style="margin: 10px 3px 5px 0px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;"><span style="color:#0099ff">#'+result.data[i].T_DeptName+'#</span>&nbsp;'+result.data[i].T_Content+'</div>'
										+'				</div>'
										+'			</div>'
										+'		</div>'
										+'		<div class="weui_panel_bd weui_cells_access" style="color: #888;font-size: 9pt;text-align: center;padding:0px 15px">'
										+'			<span style="float: left;line-height: 40px;"><i class="icon iconfont" style="font-size:14pt">&#xe635;</i>&nbsp;<label>'+result.data[i].T_Contact+'</label>&nbsp;<label>'+result.data[i].T_Mobile+'</label></span>'
										+'			<span style="float: right;line-height: 40px;"><label>'+TUI.Utils.parseDate(result.data[i].T_Time).Format("yyyy年MM月dd日")+'</label></span>'
										+'		</div>'
										+'</div>');
								//
								item.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									e.data.handle.openBulletin(e.data.config);
									return false;
								});
								//
								item.find(".bulletin_delete").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,config:result.data[i]}, function (e) {
									if(!navigator.onLine)
									{
										$.toast("网络不给力", "forbidden");
										return;
									}
									//
									$.confirm("此操作将不可撤销，您是否删除该公告？", "确认删除公告?", function() {
										$.ajax({
												type: 'DELETE',
												url: "/API/Bulletin",
												data:{id:e.data.config.T_NoticeCode},
												dataType: "json",
												context:this,
												error: function (result) {
													
												},
												success: function (result) {
													if(result.flag)
													{
														$('#tab_body').find('.bulletin-list').empty();
														TUI.env.mobile.pagestart=0;
														TUI.env.mobile.readBulletin();
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
								$('#tab_body').find('.bulletin-list').append(item);
							}
							//
							this.pagestart+=result.data.length;
							if(result.data.length==TUI.env.mobile.pagenumber)
							{
								this.loading=false;
							}
							else
							{
								$('#tab_body').find('.bulletin-list').append('<div style="padding:10px;text-align: center;">没有更多内容</div>');
								$('#tab_body').find(".weui-infinite-scroll").remove();
							}
						}
					}
				});
		},
		openBulletin: function (config) {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			//
		    $('#tab_main').find('.subtitle_bar').empty();
		    $('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">分享</span>');
		    $('#tab_main').find('.subtitle_body').html('<div class="article-list" style="height:100%;background: url(./images/handmadepaper.png);">'
													+'		<div class="title">' + config.T_Title+ '<hr></div>'
													+'		<div class="bulletin">' + config.T_Content+ '</div>'
													+'		<div class="deptname" style="font-size: 12pt;"><b>&nbsp;公告部门：</b>' + config.T_DeptName+ '</div>'
													+'		<div class="contact" style="font-size: 12pt;"><hr><b>&nbsp;联&nbsp;&nbsp;系&nbsp;&nbsp;人：</b>' + config.T_Contact+ '</div>'
													+'		<div class="mobile" style="font-size: 12pt;"><hr><b>&nbsp;联系电话：</b>' + config.T_Mobile+ '</div>'
													+'		<div class="date"  style="font-size: 12pt;"><hr><span>' + TUI.Utils.parseDate(config.T_Time).Format("yyyy年MM月dd日")+ '</span>&nbsp;</div>'
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
					data:{subject:config.T_Title,content:config.T_Content+"<br>公告部门："+config.T_DeptName,apptag:"Bulletin"},
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
				window.location.href="/API/My/Login/?goto="+escape("/Webapp/Bulletin/Mobile/");
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
