//主程序入口
$(document).ready(function () {
    if (TUI.env.us != null) {
        TUI.env = top.TUI.env;
        //
        TUI.env.WeatherApp = new WeatherApp();
        TUI.env.WeatherApp.init();
        TUI.env.WeatherApp.show("normal");
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
                TUI.env.WeatherApp = new WeatherApp();
                TUI.env.WeatherApp.init();
                TUI.env.WeatherApp.show("normal");
            }
        });
    }

});

WeatherApp = function (container, config) {
    return {
        init: function () {
			$.ajax({
					type: 'get',
					url: "/API/Weather",
					dataType: "json",
					context:this,
					error: function (result) {
					},
					success: function (result) {
						if(result.flag)
						{
							$('.tab_now .notice .head').html('<span>'+result.data.city_name+' / '+result.data.future[0].day+'&nbsp;'+result.data.last_update+'更新</span><span class="pm25">PM2.5 '+result.data.now.air_quality.city.pm25+'&nbsp;'+result.data.now.air_quality.city.quality+'</span>');
							$('.tab_now .notice .back').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
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
							//
							if(result.data.now.air_quality.city.pm25<=50)
								$('.tab_now .notice').addClass("q50");
							else if(result.data.now.air_quality.city.pm25<=100)
								$('.tab_now .notice').addClass("q100");
							else if(result.data.now.air_quality.city.pm25<=150)
								$('.tab_now .notice').addClass("q150");
							else if(result.data.now.air_quality.city.pm25<=200)
								$('.tab_now .notice').addClass("q200");
							else if(result.data.now.air_quality.city.pm25<=300)
								$('.tab_now .notice').addClass("q300");
							else if(result.data.now.air_quality.city.pm25>300)
								$('.tab_now .notice').addClass("q500");
							//
							var now=new Date();
							if(now.getHours()<6)
							{
								$('.tab_now .notice .title').html('<i class="icon-weather-'+result.data.future[0].code2+'"></i>白天<br>'+result.data.future[0].text);
							}
							else if(now.getHours()<12)
							{
								$('.tab_now .notice .title').html('<i class="icon-weather-'+result.data.future[0].code2+'"></i>下午<br>'+result.data.future[0].text);
							}
							else if(now.getHours()<18)
							{
								$('.tab_now .notice .title').html('<i class="icon-weather-'+result.data.future[0].code2+'"></i>晚上<br>'+result.data.future[0].text);
							}
							else if(now.getHours()<24)
							{
								$('.tab_now .notice .title').html('<i class="icon-weather-'+result.data.future[1].code1+'"></i>明天<br>'+result.data.future[1].text);
							}
							//
							$('.tab_now .lt').html('<i class="icon-weather-'+result.data.now.code+'"></i><br>'+result.data.now.text);
							$('.tab_now .rt').html('<span style="font-size: 54pt;line-height: 64px;">'+result.data.now.feels_like+ '</span><br>'+result.data.future[0].low+' ~ '+result.data.future[0].high+'℃');
							//
							$('.tab_today').html('<hr><div class="row">'
												+'	<div class="lt" style="color:#3598dc;"><i class="icon iconfont">&#xe600;</i><br>温度'+result.data.now.temperature+'℃</div>'
												+'	<div class="rt" style="color:#009688;"><i class="icon iconfont">&#xe603;</i><br>湿度'+result.data.now.humidity+'%</div>'
												+'</div>'
												+'<div class="row" style="height:33%">'
												+'	<div class="lt" style="color:#4caf50;"><i class="icon iconfont">&#xe606;</i><br>空气 '+result.data.now.air_quality.city.quality+'</div>'
												+'	<div class="rt" style="color:#607d8b;"><i class="icon iconfont">&#xe602;</i><br>'+result.data.now.wind_direction+result.data.now.wind_scale+'级</div>'
												+'</div>'
												+'<div class="row">'
												+'	<div class="lt" style="color:#ff5722;"><i class="icon iconfont">&#xe604;</i><br>细微颗粒'+result.data.now.air_quality.city.pm25+'</div>'
												+'	<div class="rt" style="color:#ffc107;"><i class="icon iconfont">&#xe605;</i><br>气压'+result.data.now.pressure+'hPa</div>'
												+'</div><hr>');
							//
							$('.tab_future').html('<div class="item">'
												+'	<div class="lt"><i class="icon-weather-'+result.data.future[1].code1+'"></i><br><i class="icon-weather-'+result.data.future[1].code2+'"></i></div>'
												+'	<div class="rt"><span style="background: #607d8b;padding: 3px 5px;color: #fff;border-radius: 5px;">明天</span>&nbsp;<span style="color: #aaa;">'+result.data.future[1].day+'</span><br><span style="font-size: 28pt;line-height:60px;">'+result.data.future[1].low+' ~ '+result.data.future[1].high+'℃</span><br>&nbsp;'+result.data.future[1].text+'<br>&nbsp;'+result.data.future[1].wind1+'</div>'
												+'</div><hr>'
												+'<div class="item">'
												+'	<div class="lt"><i class="icon-weather-'+result.data.future[2].code1+'"></i><br><i class="icon-weather-'+result.data.future[2].code2+'"></i></div>'
												+'	<div class="rt"><span style="background: #607d8b;padding: 3px 5px;color: #fff;border-radius: 5px;">后天</span>&nbsp;<span style="color: #aaa;">'+result.data.future[2].day+'</span><br><span style="font-size: 28pt;line-height:60px;">'+result.data.future[2].low+' ~ '+result.data.future[2].high+'℃</span><br>&nbsp;'+result.data.future[2].text+'<br>&nbsp;'+result.data.future[2].wind1+'</div>'
												+'</div>');

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