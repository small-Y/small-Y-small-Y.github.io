
//主程序入口
var myApp = TUI.namespace("myApp");
$(document).ready(function () {
	$.ajax({
			type: 'get',
			url: "/System/srv/login.ejs",
			dataType: "json",
			error: function (result) {
			},
			success: function (result) {
				//初始化用户信息
				TUI.env.us = result;
				//
				myApp = new SayMachine();
				myApp.init();
				myApp.show("normal");
			}
		});
});

SayMachine = function (container, config) {
	return {
        init: function () {
            this.container = container;
            this.config = config ? config : {};

			this.getLinkMsg(2);
			//
			$('#title_bar').find('.btn').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				e.data.handle.getLinkTop();
			});
			//
			$('#tab_body').find('.btn-cont').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				var callText=$('#tab_body').find('.chat-form .input-cont input').prop("value");
				if(callText!="")
				{
					$('#tab_body').find('.chat-form .input-cont input').focus();
					$('#tab_body').find('.chat-form .input-cont input').val("");
					e.data.handle.askuser(callText);
				}
			});
			//
			$('#tab_body').find('.chat-form .input-cont input').keydown(function (e) {
				if (e.keyCode == 13) {
					$('#tab_body').find('.btn-cont').trigger(TUI.env.ua.clickEventUp);
				}
			});
		},
		getLinkTop: function () {
			$('.chats-list').find('.chats').empty();
			//
			$.ajax({
					type: 'get',
					url: 'srv/getSaymaTop.tjs',
					dataType: "json",
					context:this,
					error: function (result) {
					},
					success: function (result) {
						if(result.flag)
						{
							if(result.cal.length>0)
							{
								var tc=new Date();
								var calItem = $('<li class="out">'
										+'	<img class="avatar img-responsive" alt="" src="logo.png"/>'
										+'	<div class="message">'
										+'		<span class="arrow"></span>'
										+'		<a href="javascript:void(0)" class="name">试试这些问问</a>'
										+'		<span class="datetime">'+tc.Format("今天 hh:mm:ss")+'</span>'
										+'		<span class="body"></span>'
										+'	</div>'
										+'</li>');
								//
								for(var i=0;i<result.cal.length;i++)
								{
									var item=$("<p>&nbsp;&nbsp;&nbsp;:-)&nbsp;"+unescape(unescape(result.cal[i]))+"</p>");
									item.bind(TUI.env.ua.clickEventUp, { handle: this,call:unescape(unescape(result.cal[i]))}, function (e) {
										$('#tab_body').find('.input-cont input').val(e.data.call);
									});
									calItem.find('.body').append(item);
								}
								$('#tab_body').find('.chats').append(calItem);
							}
							//滚动到最底下
							$('#tab_body').find('.chats-list')[0].scrollTop=$('#tab_body').find('.chats-list')[0].scrollHeight ;
						}
						//
						TUI.Comet.close();
						this.waitLinkMsg(this.msgMaxCode);
					}
			});
		},
		getLinkMsg: function (day) {
			var tc=new Date();
			var t1=tc;
			t1=tc.DateAdd("d",-day);
			$('.chats-list').find('.chats').empty();
			//
			$.ajax({
					type: 'get',
					url: 'srv/getSaymaMsg.tjs?startTime='+t1.Format("yyyy-MM-dd"),
					dataType: "json",
					context:this,
					error: function (result) {
					},
					success: function (result) {
						if(result.flag)
						{
							var tc=new Date();
							if(result.msg.length>0)
							{
								for(var i=0;i<result.msg.length;i++)
								{
									if(result.msg[i].T_FromUser==TUI.env.us.userName)
									{
										var item = $('<li class="in">'
												+'		<img class="avatar img-responsive" alt="" src="/System/srv/userpic.tjs?userid=' + TUI.env.us.userName+ '" />'
												+'		<div class="message">'
												+'			<span class="arrow"></span>'
												+'			<a href="javascript:void(0)" class="name">'+TUI.env.us.fullName+'</a>'
												+'			<span class="datetime">于'+TUI.Utils.dateMessage(result.msg[i].T_CallDate)+'</span>'
												+'			<span class="body">'+unescape(unescape(result.msg[i].T_CallText))+'</span>'
												+'		</div>'
												+'	</li>');
										//
										item.bind(TUI.env.ua.clickEventUp, { handle: this,call:unescape(unescape(result.msg[i].T_CallText))}, function (e) {
											$('#tab_body').find('.input-cont input').val(e.data.call);
										});
										//
										$('#tab_body').find('.chats').append(item);
										//
										if(result.msg[i].T_AnswerText!="")
										{
											var item = $('<li class="out">'
													+'	<img class="avatar img-responsive" alt="" src="logo.png"/>'
													+'	<div class="message">'
													+'		<span class="arrow"></span>'
													+'		<a href="javascript:void(0)" class="name">新知机器人</a>'
													+'		<span class="datetime">于'+TUI.Utils.dateMessage(result.msg[i].T_AnswerDate)+'</span>'
													+'		<span class="body">'+unescape(unescape(result.msg[i].T_AnswerText))+'</span>'
													+'	</div>'
													+'</li>');
											$('#tab_body').find('.chats').append(item);
										}
									}
								}
							}
							//
							if(result.dar.length>0)
							{
								var calHtml="";
								for(var i=0;i<result.dar.length;i++)
								{
									var content=TUI.Utils.decode64(result.dar[i].content);
									content = content.replace(/\n/g, "<br>");
									content = content.replace(/\s/g, "&nbsp;");
									content = content.replace(new RegExp('(["\"])', 'g'),"\\\"");
									//
									calHtml+=('<b>'+result.dar[i].title+'</b><p>'+unescape(unescape(content))+'</p>');
								}
								var item = $('<li class="out">'
										+'	<img class="avatar img-responsive" alt="" src="logo.png"/>'
										+'	<div class="message">'
										+'		<span class="arrow"></span>'
										+'		<a href="javascript:void(0)" class="name">日程提醒</a>'
										+'		<span class="datetime">'+tc.Format("今天 hh:mm:ss")+'</span>'
										+'		<span class="body">'+calHtml+'</span>'
										+'	</div>'
										+'</li>');
								$('#tab_body').find('.chats').append(item);
							}
							//
							if(result.cal.length>0)
							{
								var calItem = $('<li class="out">'
										+'	<img class="avatar img-responsive" alt="" src="logo.png"/>'
										+'	<div class="message">'
										+'		<span class="arrow"></span>'
										+'		<a href="javascript:void(0)" class="name">试试这些问问</a>'
										+'		<span class="datetime">'+tc.Format("今天 hh:mm:ss")+'</span>'
										+'		<span class="body"></span>'
										+'	</div>'
										+'</li>');
								//
								for(var i=0;i<result.cal.length;i++)
								{
									var item=$("<p>&nbsp;&nbsp;&nbsp;:-)&nbsp;"+unescape(unescape(result.cal[i]))+"</p>");
									item.bind(TUI.env.ua.clickEventUp, { handle: this,call:unescape(unescape(result.cal[i]))}, function (e) {
										$('#tab_body').find('.input-cont input').val(e.data.call);
									});
									calItem.find('.body').append(item);
								}
								$('#tab_body').find('.chats').append(calItem);
							}
							//滚动到最底下
							$('#tab_body').find('.chats-list')[0].scrollTop=$('#tab_body').find('.chats-list')[0].scrollHeight ;
						}
						//
						TUI.Comet.close();
						this.waitLinkMsg(this.msgMaxCode);
					}
			});
		},
		askuser: function (callText) {
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			//
			$.ajax({
						type: 'PUT',
						url: "/API/Sayma",
						data: {to:"Sayma",call:escape(callText)},
						dataType: "json",
						context:this,
						error: function (result) {
							
						},
						success: function (result) {
							if(!result.flag)
							{
								$.toast(result.info, "forbidden");
								return;
							}
							var tc=new Date();
							var item = $('<li class="in">'
										+'		<img class="avatar img-responsive" alt="" src="/System/srv/userpic.tjs?userid=' + TUI.env.us.userName+ '" />'
										+'		<div class="message">'
										+'			<span class="arrow"></span>'
										+'			<a href="javascript:void(0)" class="name">'+TUI.env.us.fullName+'</a>'
										+'			<span class="datetime">于'+tc.Format("今天 hh:mm:ss")+'</span>'
										+'			<span class="body">'+unescape(unescape(result.call))+'</span>'
										+'		</div>'
										+'	</li>');
							//
							item.bind(TUI.env.ua.clickEventUp, { handle: this,call:unescape(unescape(result.call))}, function (e) {
								$('#tab_body').find('.input-cont input').val(e.data.call);
							});
							//
							$('#tab_body').find('.chats-list').find('.chats').append(item);
							//滚动到最底下
							$('#tab_body').find('.chats-list')[0].scrollTop=$('#tab_body').find('.chats-list')[0].scrollHeight ;
						}
					});
		},
		waitLinkMsg: function (code) {
			if (TUI.Comet.connect()) {
                if (!TUI.Comet.addsrv("tjs", "srv/getRealMessage.tjs", myApp.OnReadLinkMsg)) {
					$.toast("对话失败", "forbidden");
                }
                else {
                    if (!TUI.Comet.onlisten()) {
                       $.toast("对话失败", "forbidden");
                    }
                }
            }
            else {
                $.toast("对话失败", "forbidden");
            }
		},
		OnReadLinkMsg: function (obj) {
			result=TUI.JSON.decode(obj);
			if(!result.flag)
			{
				$.toast("对话失败", "forbidden");
			}
			//
			for(var i=0;i<result.data.length;i++)
			{
				if(result.data[i].T_AnswerText!="")
				{
					var item = $('<li class="out">'
							+'	<img class="avatar img-responsive" alt="" src="logo.png"/>'
							+'	<div class="message">'
							+'		<span class="arrow"></span>'
							+'		<a href="javascript:void(0)" class="name">新知机器人</a>'
							+'		<span class="datetime">于'+TUI.Utils.dateMessage(result.data[i].T_AnswerDate)+'</span>'
							+'		<span class="body">'+unescape(unescape(result.data[i].T_AnswerText))+'</span>'
							+'	</div>'
							+'</li>');
					$('#tab_body').find('.chats').append(item);
				}
			}
			//滚动到最底下
			$('#tab_body').find('.chats-list')[0].scrollTop=$('#tab_body').find('.chats-list')[0].scrollHeight ;
			//
			myApp.waitLinkMsg(myApp.msgMaxCode);
        },
		show: function (speed) {
        },
        hide: function (speed) {

		}
    };
};