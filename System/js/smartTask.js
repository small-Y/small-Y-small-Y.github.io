SmartTask = function(u, t) {
    var r = 0
      , k = {}
      , f = []
      , m = {}
      , l = 0
      , n = {}
      , g = []
      , p = {}
      , q = 0;
    return {
        init: function() {
            this.containerBar = u;
            var b = t ? t : {};
            this.home = b.handle;
            this.themelist = {
                Flag: 1,
                Message: "",
                tList: [],
                wList: []
            };
            this.fn = b.fn;
            this.isThemeEdit = this.isAppEdit = !1;
            this.msgReadCount = 0;
            this.msgWeather = 1;
            $("#" + this.containerBar).html('\x3cdiv id\x3d"' + this.containerBar + '_System" class\x3d"SystemButton"\x3e\x3cul\x3e\x3c/ul\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.containerBar + '_Button" class\x3d"TaskButton"\x3e\x3cul\x3e\x3c/ul\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.containerBar + '_Status" class\x3d"TaskStatus"\x3e\t\t\x3cdiv class\x3d"WeatherList"\x3e\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e\t\t\t\x3cdiv class\x3d"today"\x3e\x3cul\x3e\x3c/ul\x3e\x3c/div\x3e\t\t\t\x3cdiv class\x3d"future"\x3e\x3cul\x3e\x3c/ul\x3e\x3c/div\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"Search"\x3e\x3cinput type\x3d"search" name\x3d"" placeholder\x3d"\u8f93\u5165\u4f60\u8981\u641c\u7d22\u7684\u5185\u5bb9"\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x3ci class\x3d"fa fa-search"\x3e\x3c/i\x3e\x3c/div\x3e\t\t\x3cdiv class\x3d"Message"\x3e\x3cimg src\x3d"/System/style/images/msg1.png"/\x3e\x3cdiv class\x3d"number" style\x3d"display: none;"\x3e0\x3c/div\x3e\x3c/div\x3e\t\t\x3cdiv class\x3d"Weather"\x3e\t\t\t\x3cdiv class\x3d"icon"\x3e\x3cimg src\x3d"/resource/@Start/Weather/99.png"/\x3e\x3c/div\x3e\t\t\t\x3cdiv class\x3d"info"\x3e\u2014\u2103\x3c/div\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"Sayma"\x3e\x3cimg src\x3d"/System/style/images/task.png"/\x3e\x3c/div\x3e\t\t\x3cdiv class\x3d"Clock"\x3e\x3c/div\x3e\t\t\x3cdiv class\x3d"ClockList"\x3e\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e\t\t\t\x3cdiv class\x3d"now"\x3e\x3c/div\x3e\t\t\t\x3cdiv class\x3d"today"\x3e\x3c/div\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"Picture"\x3e\x3cimg src\x3d"/System/style/images/plus.png"/\x3e\x3c/div\x3e\t\t\x3cdiv class\x3d"UserMenu"\x3e\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e\t\t\t\x3cul\x3e\t\t\t\t\x3cli class\x3d"doUserInfo"\x3e\x3ci class\x3d"fa fa-edit"\x3e\x3c/i\x3e\x26nbsp;\u4e2a\u6027\u7b7e\u540d\x3c/li\x3e\t\t\t\t\x3cli class\x3d"doUserPic"\x3e\x3ci class\x3d"fa fa-camera"\x3e\x3c/i\x3e\x26nbsp;\u4e0a\u4f20\u5934\u50cf\x3c/li\x3e\t\t\t\t\x3cli class\x3d"doUserPass"\x3e\x3ci class\x3d"fa fa-key"\x3e\x3c/i\x3e\x26nbsp;\u4fee\u6539\u5bc6\u7801\x3c/li\x3e\t\t\t\t\x3chr\x3e\t\t\t\t\x3cli class\x3d"doUserCenter"\x3e\x3ci class\x3d"fa fa-user"\x3e\x3c/i\x3e\x26nbsp;\u4e2a\u4eba\u4e2d\u5fc3\x3c/li\x3e\t\t\t\t\x3cli class\x3d"fullScreen"\x3e\x3ci class\x3d"fa fa-arrows-alt"\x3e\x3c/i\x3e\x26nbsp;\u5168\u5c4f\u6a21\u5f0f\x3c/li\x3e\t\t\t\t\x3cli class\x3d"exitScreen"\x3e\x3ci class\x3d"fa fa-arrows"\x3e\x3c/i\x3e\x26nbsp;\u9000\u51fa\u5168\u5c4f\x3c/li\x3e\t\t\t\t\x3chr\x3e\t\t\t\t\x3cli class\x3d"doUserLogout"\x3e\x3ci class\x3d"fa fa-sign-out"\x3e\x3c/i\x3e\x26nbsp;\u6ce8\u9500\u9000\u51fa\x3c/li\x3e\t\t\t\x3c/ul\x3e\t\t\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.containerBar + '_ShowDesktop" class\x3d"TaskShowDesktop"\x3e\x3c/div\x3e');
            $(".ClockList .now").thooClock({
                size: 150,
                dialColor: "#1099EC",
                secondHandColor: "#DDBD45",
                minuteHandColor: "#1199ec",
                hourHandColor: "#1199ec",
                alarmHandColor: "#D84C49",
                alarmHandTipColor: "#DDBD45",
                showNumerals: !0,
                brandText: "ThingsLabs"
            });
            this.loadReadMsg();
            this.loadTimeLine();
            this.dispDateTime();
            this.dispWeather();
            $(this).everyTime(15E3, function() {
                this.dispDateTime()
            });
            $(this).everyTime(9E5, function() {
                1 == this.msgWeather && this.dispWeather();
                this.loadReadMsg()
            });
            this.sysID = "#" + this.containerBar + "_home";
            this.cssName = "HomeButton";
            this.bPannelBoard = this.bDashBoard = !1;
            this.addSystemButton("\u5f00\u59cb...", "HomeButton", "home");
            this.addSystemButton("\u5e94\u7528\u4e2d\u5fc3", "ApplyButton", "apply");
            this.addSystemButton("\u4e2a\u6027\u4e3b\u9898", "ThemeButton", "theme");
            this.loadSystemMenu();
            $("#" + this.containerBar + "_Status").find(".Sayma").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(".TaskStatus .UserMenu").hide();
                $(".TaskStatus .WeatherList").hide();
                $(".TaskStatus .ClockList").hide();
                a.data.handle.bPannelBoard && ($("#desktopFrame1").animate({
                    left: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                $("#pannelFrame").css({
                    left: $(window).width() - 420,
                    right: "unset",
                    display: "block"
                }),
                $("#pannelFrame").animate({
                    left: $(window).width(),
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    $("#pannelFrame").css({
                        left: "unset",
                        right: -420,
                        display: "none"
                    });
                    $("pannelFrame").empty()
                }),
                a.data.handle.bPannelBoard = !1);
                a.data.handle.bDashBoard ? ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1,
                $(".timeevent").empty()) : (a.data.handle.clear(1),
                $("#desktopFrame1_Panel_Home").hide(),
                $("#desktopFrame1").find(".desktopWrapper").addClass("blur"),
                $(".TaskStatus .Search").show(),
                $("#desktopFrame1_Panel_Widget").css({
                    opacity: 0,
                    top: $(window).height(),
                    overflow: "hidden",
                    display: "block"
                }),
                $("#desktopFrame1_Panel_Widget").animate({
                    top: 40,
                    opacity: 1,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                a.data.handle.bDashBoard = !0,
                a.data.handle.dispTimeLine(""));
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".Message").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(".TaskStatus .UserMenu").hide();
                $(".TaskStatus .WeatherList").hide();
                $(".TaskStatus .ClockList").hide();
                a.data.handle.bPannelBoard ? ($("#desktopFrame1").animate({
                    left: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                $("#pannelFrame").css({
                    left: $(window).width() - 420,
                    right: "unset",
                    display: "block"
                }),
                $("#pannelFrame").animate({
                    left: $(window).width(),
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    $("#pannelFrame").css({
                        left: "unset",
                        right: -420,
                        display: "none"
                    });
                    $("pannelFrame").empty()
                }),
                a.data.handle.bPannelBoard = !1) : ($(this).find("img").attr("src", "/System/style/images/msg1.png"),
                $(this).find(".number").hide(),
                $("#pannelFrame").html('\x3ciframe allowtransparency\x3d"true" style\x3d"background-color:transparent;position:relative" marginwidth\x3d"0" marginheight\x3d"0" width\x3d"100%" height\x3d"100%" frameborder\x3d"no" scrolling\x3d"no" hidefocus\x3d"" src\x3d"/Webapp/Sayma/Mobile/top.html"\x3e\x3c/iframe\x3e'),
                $("#desktopFrame1").animate({
                    left: -420,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                $("#pannelFrame").css({
                    left: $(window).width(),
                    right: "unset",
                    display: "block"
                }),
                $("#pannelFrame").animate({
                    left: $(window).width() - 420,
                    opacity: 1,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    $("#pannelFrame").css({
                        left: "unset",
                        right: 0,
                        display: "block"
                    })
                }),
                a.data.handle.bPannelBoard = !0);
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1,
                $(".timeevent").empty());
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".Search i").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.dispTimeLine($(".TaskStatus .Search input").val())
            });
            $("#" + this.containerBar + "_Status").find(".Search input").keydown({
                handle: this
            }, function(a) {
                13 == a.keyCode && a.data.handle.dispTimeLine($(".TaskStatus .Search input").val())
            });
            $("#" + this.containerBar + "_Status").find(".Clock").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(".TaskStatus .UserMenu").hide();
                $(".TaskStatus .WeatherList").hide();
                $(".TaskStatus .ClockList").show();
                a.data.handle.bPannelBoard && ($("#desktopFrame1").animate({
                    left: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                $("#pannelFrame").css({
                    left: $(window).width() - 420,
                    right: "unset",
                    display: "block"
                }),
                $("#pannelFrame").animate({
                    left: $(window).width(),
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    $("#pannelFrame").css({
                        left: "unset",
                        right: -420,
                        display: "none"
                    });
                    $("pannelFrame").empty()
                }),
                a.data.handle.bPannelBoard = !1);
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1,
                $(".timeevent").empty());
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".Weather").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(".TaskStatus .UserMenu").hide();
                $(".TaskStatus .ClockList").hide();
                $(".TaskStatus .WeatherList").show();
                a.data.handle.bPannelBoard && ($("#desktopFrame1").animate({
                    left: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                $("#pannelFrame").css({
                    left: $(window).width() - 420,
                    right: "unset",
                    display: "block"
                }),
                $("#pannelFrame").animate({
                    left: $(window).width(),
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    $("#pannelFrame").css({
                        left: "unset",
                        right: -420,
                        display: "none"
                    });
                    $("pannelFrame").empty()
                }),
                a.data.handle.bPannelBoard = !1);
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1,
                $(".timeevent").empty());
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".Picture").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(".TaskStatus .ClockList").hide();
                $(".TaskStatus .WeatherList").hide();
                $(".TaskStatus .UserMenu").show();
                a.data.handle.bPannelBoard && ($("#desktopFrame1").animate({
                    left: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal"),
                $("#pannelFrame").css({
                    left: $(window).width() - 420,
                    right: "unset",
                    display: "block"
                }),
                $("#pannelFrame").animate({
                    left: $(window).width(),
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    $("#pannelFrame").css({
                        left: "unset",
                        right: -420,
                        display: "none"
                    });
                    $("pannelFrame").empty()
                }),
                a.data.handle.bPannelBoard = !1);
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1,
                $(".timeevent").empty());
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .doUserInfo").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.parent.container,
                    type: "msgbox",
                    msg: "input",
                    value: TUI.env.us.userInfo
                },{
                    title: "\u4e2a\u6027\u7b7e\u540d",
                    width: 350,
                    height: 150,
                    handle: a.data.handle,
                    afterClose: function(a, c) {
                        1 == a && $.ajax({
                            type: "post",
                            url: "/System/srv/setUserInfo.ejs",
                            data: {
                                userID: TUI.env.us.userID,
                                userInfo: c
                            },
                            dataType: "json",
                            error: function(a) {
                                playSound("error");
                                toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u4e2a\u6027\u7b7e\u540d")
                            },
                            success: function(a) {
                                a.flag ? TUI.env.us = a.data : (playSound("warn"),
                                toastr.warning(a.msg, "\u4e2a\u6027\u7b7e\u540d"))
                            }
                        })
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .doUserPic").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.parent.container,
                    type: "msgbox",
                    msg: "image",
                    value: TUI.env.us.userName
                },{
                    title: "\u4e0a\u4f20\u5934\u50cf",
                    width: 350,
                    height: 150,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        1 == a && (a = new Date,
                        $(".TaskStatus .Picture img").prop("src", "/System/style/images/plus.png"))
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .doUserPass").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.parent.container,
                    type: "msgbox",
                    msg: "password",
                    value: TUI.env.us.userID
                },{
                    title: "\u4fee\u6539\u5bc6\u7801",
                    width: 330,
                    height: 205,
                    handle: a.data.handle,
                    afterClose: function(a, c, b) {
                        1 == a && $.ajax({
                            type: "post",
                            url: "/System/srv/setUserPass.ejs",
                            data: {
                                userID: TUI.env.us.userID,
                                oldPass: TUI.Utils.hex_sha1(TUI.env.us.userName + "-" + c),
                                newPass: TUI.Utils.hex_sha1(TUI.env.us.userName + "-" + b)
                            },
                            dataType: "json",
                            error: function(a) {
                                playSound("error");
                                toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u4fee\u6539\u5bc6\u7801")
                            },
                            success: function(a) {
                                a.flag ? (TUI.env.us = a.data,
                                top.location.href = "/") : (playSound("warn"),
                                toastr.error(a.msg, "\u4fee\u6539\u5bc6\u7801"))
                            }
                        })
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .doUserCenter").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                a.data.appcfg = {
                    update_url: "http://webstore.thingslabs.com/service/update/fax",
                    appid: "0CB4D644-896A-4ADA-9D5F-58448BD04498",
                    apptype: "Things",
                    name: "\u4e2a\u4eba\u4e2d\u5fc3",
                    description: "\u7ba1\u7406\u79c1\u4eba\u8d26\u6237\u53ca\u4fe1\u606f",
                    author: "ThingsLabs",
                    version: "1.0.1",
                    app: {
                        launch: {
                            enable: !0,
                            local_path: "/WebApp/Account/",
                            container: "system",
                            sort: 3,
                            height: 678,
                            width: 960
                        },
                        mobile: {
                            enable: !1,
                            local_path: "/WebApp/Account/Mobile/",
                            container: "system"
                        }
                    },
                    icons: {
                        logo: "icon_256.png"
                    },
                    isUserApp: !1,
                    urlPath: "/Webapp/Account"
                };
                if (TUI.env.os[TUI.env.desktop - 1].checkHandle(a.data.appcfg.appid))
                    TUI.env.os[TUI.env.desktop - 1].activeHandle(a.data.appcfg.appid);
                else {
                    var d = new Dialog({
                        container: a.data.handle.home.container,
                        type: "iframe",
                        value: a.data.appcfg.app.launch.local_path
                    },{
                        title: a.data.appcfg.name,
                        taskImg: a.data.appcfg.urlPath + "/" + a.data.appcfg.icons.logo,
                        handle: TUI.env.os[TUI.env.desktop - 1],
                        appid: a.data.appcfg.appid,
                        urlPath: a.data.appcfg.urlPath,
                        afterShow: function() {},
                        afterHide: function() {
                            this.handle.hideHandle(a.data.appcfg.appid)
                        },
                        afterClose: function() {
                            this.handle.delHandle(a.data.appcfg.appid)
                        },
                        afterSwitch: function() {
                            this.handle.switchHandle(a.data.appcfg.appid)
                        },
                        modal: !1,
                        center: !0,
                        width: a.data.appcfg.app.launch.width,
                        height: a.data.appcfg.app.launch.height
                    });
                    d.show();
                    TUI.env.os[TUI.env.desktop - 1].addHandle(d, a.data.appcfg.name, a.data.appcfg.urlPath + "/" + a.data.appcfg.icons.logo, a.data.appcfg.appid)
                }
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .fullScreen").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                a = document.documentElement;
                var d = a.requestFullScreen || a.webkitRequestFullScreen || a.mozRequestFullScreen || a.msRequestFullscreen;
                "undefined" != typeof d && d && d.call(a);
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .exitScreen").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen();
                return !1
            });
            $("#" + this.containerBar + "_Status").find(".UserMenu .doUserLogout").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.parent.container,
                    type: "msgbox",
                    msg: "warn",
                    value: "\u60a8\u786e\u5b9a\u8981\u6ce8\u9500ThingsOS\u684c\u9762\u5417\uff1f"
                },{
                    title: "\u6ce8\u9500\u684c\u9762",
                    width: 400,
                    height: 155,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        1 == a && $.ajax({
                            type: "get",
                            url: "/System/srv/logout.ejs",
                            error: function(a) {
                                playSound("error");
                                toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u6ce8\u9500\u684c\u9762")
                            },
                            success: function(a) {
                                top.location.href = "/"
                            }
                        })
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            $("#" + this.containerBar + "_Button").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear(1)
            });
            $("#" + this.containerBar + "_ShowDesktop").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this.home
            }, this.fn);
            $("#desktopFrame1_Panel_Widget").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear(1)
            });
            $("#desktopFrame1_Panel_Home").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear()
            });
            TUI.env.us.firstPass && $("#" + this.containerBar + "_Status").find(".UserMenu .doUserPass").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)
        },
        dispTimeItem: function(b, a) {
            if ("calendar" == a.type) {
                var d = TUI.Utils.decode64(a.content)
                  , d = d.replace(/\n/g, "\x3cbr\x3e")
                  , d = d.replace(/\s/g, "\x26nbsp;")
                  , d = d.replace(RegExp('([""])', "g"), '\\"');
                if ("" == b || 0 <= a.appname.indexOf(b) || 0 <= a.title.indexOf(b) || 0 <= d.indexOf(b))
                    return "" == a.imagefile ? $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"htmlpanel"\x3e\x3ch3\x3e' + a.title + '\x3c/h3\x3e\x3cp style\x3d"text-align: center;color: #9E9E9E!important;margin: 10px!important;"\x3e' + a.time + "\x3c/p\x3e" + d + "\x3c/div\x3e\x3c/li\x3e") : $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"htmlpanel"\x3e\x3ch3\x3e' + a.title + '\x3c/h3\x3e\x3cp style\x3d"text-align: center;color: #9E9E9E!important;margin: 10px!important;"\x3e' + a.time + "\x3c/p\x3e" + d + '\x3cbr\x3e\x3cimg src\x3d"' + a.imagefile + '" width\x3d"100%" border\x3d"0" alt\x3d""/\x3e\x3c/div\x3e\x3c/li\x3e')
            } else if ("bulletin" == a.type) {
                if ("" == b || 0 <= a.appname.indexOf(b) || 0 <= a.title.indexOf(b) || 0 <= a.content.indexOf(b) || 0 <= a.deptname.indexOf(b) || 0 <= a.contact.indexOf(b))
                    return $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"htmlpanel"\x3e\x3ch3\x3e' + a.title + "\x3c/h3\x3e\x3cp\x3e" + a.content + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u516c\u544a\u65f6\u95f4\uff1a\x3c/b\x3e" + a.time + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u516c\u544a\u90e8\u95e8\uff1a\x3c/b\x3e" + a.deptname + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u8054\u7cfb\u65b9\u5f0f\uff1a\x3c/b\x3e" + a.contact + a.mobile + "\x3c/p\x3e\x3c/div\x3e\x3c/li\x3e")
            } else if ("note" == a.type) {
                if ("" == b || 0 <= a.appname.indexOf(b) || 0 <= a.title.indexOf(b) || 0 <= a.content.indexOf(b))
                    return $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e' + a.title + "\x3c/h3\x3e" + a.time + "\x3cbr\x3e" + a.content + "\x3c/div\x3e\x3c/li\x3e")
            } else if ("message" == a.type) {
                if ("" == b || 0 <= a.appname.indexOf(b) || 0 <= a.title.indexOf(b) || 0 <= a.content.indexOf(b))
                    return 0 <= a.content.indexOf("\x3ctable\x3e") || 0 <= a.content.indexOf("\x3cbr\x3e") ? $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"htmlpanel"\x3e\x3ch3\x3e' + a.title + "\x3c/h3\x3e\x3cp\x3e" + a.time + "\x3c/p\x3e" + a.content + "\x3c/div\x3e\x3c/li\x3e") : $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e' + a.title + "\x3c/h3\x3e\x3cp\x3e" + a.time + "\x3c/p\x3e" + a.content + "\x3c/div\x3e\x3c/li\x3e")
            } else if ("knowledge" == a.type) {
                for (var c = "", d = 0; d < a.imagefile.length; d++)
                    c += '\x3cimg src\x3d"' + a.imagefile[d] + '" width\x3d"100%" border\x3d"0" alt\x3d""/\x3e';
                var e = unescape(unescape(a.subject))
                  , d = unescape(unescape(a.content));
                if ("" == b || 0 <= a.name.indexOf(b) || 0 <= e.indexOf(b) || 0 <= d.indexOf(b))
                    return $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.name + '\x3c/lable\x3e\x3cdiv class\x3d"htmlpanel"\x3e\x3ch3\x3e' + e + "\x3c/h3\x3e" + d + c + "\x3c/div\x3e\x3c/li\x3e")
            } else if ("inspect" == a.type) {
                if (c = "",
                2 <= a.RecordStatus && (c = '\x3cspan class\x3d"btn"\x3e\u53d1\u8d77\u5de5\u5355\x3c/span\x3e'),
                d = "\x3cp\x3e\x3cb\x3e\u65f6\u95f4\uff1a\x3c/b\x3e" + a.RecordTime + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u4f4d\u7f6e\uff1a\x3c/b\x3e" + a.RecordWhere + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u5bf9\u8c61\uff1a\x3c/b\x3e" + a.ObjectName + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u72b6\u6001\uff1a\x3c/b\x3e" + [{
                    name: "\u6b63\u5e38\u72b6\u6001",
                    color: "#1BBFAF",
                    y: 0
                }, {
                    name: "\u901a\u77e5\u72b6\u6001",
                    color: "#1099EC",
                    y: 0
                }, {
                    name: "\u544a\u8b66\u72b6\u6001",
                    color: "#DDBD45",
                    y: 0
                }, {
                    name: "\u6545\u969c\u72b6\u6001",
                    color: "#D84C49",
                    y: 0
                }, {
                    name: "\u762b\u75ea\u72b6\u6001",
                    color: "#a52623",
                    y: 0
                }][a.RecordStatus].name + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u5185\u5bb9\uff1a\x3c/b\x3e" + unescape(a.RecordInfo) + "\x3c/p\x3e",
                "" == b || 0 <= a.appname.indexOf(b) || 0 <= d.indexOf(b) || 0 <= a.RecordName.indexOf(b))
                    return "" != a.VideoFile ? (e = a.VideoFile.substr(0, a.VideoFile.indexOf(".")),
                    c = $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + c + '\x3c/lable\x3e\x3cdiv class\x3d"htmlpanel"\x3e\x3ch3\x3e\u6765\u81ea' + a.RecordName + "\u7684\u5de1\u68c0\x3c/h3\x3e" + (d + ('\x3cvideo width\x3d"100%" controls preload\x3d"none" poster\x3d"' + e + '.jpg" style\x3d"margin-top: 8px;"\x3e\t\t\t\t\x3csource src\x3d"' + e + '.mp4" type\x3d"video/mp4"\x3e\t\t\t\x3c/video\x3e')) + "\x3c/div\x3e\x3c/li\x3e")) : c = $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + c + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e\u6765\u81ea' + a.RecordName + "\u7684\u5de1\u68c0\x3c/h3\x3e" + d + "\x3c/div\x3e\x3c/li\x3e"),
                    c.find(".btn").bind(TUI.env.ua.clickEventUp, {
                        handle: c,
                        config: a
                    }, function(a) {
                        $.ajax({
                            type: "PUT",
                            url: "/API/WorkSheet",
                            data: {
                                apptag: a.data.config.AppTag,
                                typename: "\u5de1\u68c0" + RecordStatusText[a.data.config.RecordStatus],
                                where: a.data.config.RecordWhere,
                                what: "\u60a8\u6709\u4e00\u4e2a\u6765\u81ea" + TUI.env.us.fullName + "\u7684\u5de1\u68c0\u95ee\u9898\u9700\u8981\u5904\u7406\uff01",
                                why: a.data.config.RecordInfo,
                                autoFlow: !0,
                                fromType: "Inspect",
                                fromid: 0,
                                objectid: a.data.config.ObjectID,
                                fulltag: a.data.config.ObjectFullTag,
                                objecttype: a.data.config.ObjectType
                            },
                            dataType: "json",
                            context: this,
                            error: function(a) {
                                toastr.error("\u7f51\u7edc\u4e0d\u7ed9\u529b", "\u53d1\u8d77\u5de5\u5355")
                            },
                            success: function(a) {
                                a.flag ? ($(this).find(".btn").remove(),
                                toastr.success("\u53d1\u8d77\u5de5\u5355\u6210\u529f\uff01", "\u53d1\u8d77\u5de5\u5355")) : (playSound("warn"),
                                toastr.warning(a.info, "\u53d1\u8d77\u5de5\u5355"))
                            }
                        })
                    }),
                    c
            } else if ("event" == a.type) {
                if (c = "",
                d = "\x3cp\x3e\x3cb\x3e\u5904\u7f6e\uff1a\x3c/b\x3e" + a.OperateInfo + "\u3010" + a.OperateName + "\u3011\x3c/p\x3e",
                "" == a.OperateName && (d = ""),
                0 == a.OperateStatus && (c = '\x3cspan class\x3d"btn"\x3e\u53d1\u8d77\u5de5\u5355\x3c/span\x3e'),
                d = "\x3cp\x3e\x3cb\x3e\u65f6\u95f4\uff1a\x3c/b\x3e" + a.EventTime + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u4f4d\u7f6e\uff1a\x3c/b\x3e" + a.EventWhere + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u7c7b\u578b\uff1a\x3c/b\x3e" + a.EventType + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u5185\u5bb9\uff1a\x3c/b\x3e" + a.EventInfo + "\x3c/p\x3e" + d,
                "" == b || 0 <= a.appname.indexOf(b) || 0 <= d.indexOf(b) || 0 <= a.EventFrom.indexOf(b))
                    return c = $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + c + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e\u6765\u81ea' + a.EventFrom + "\u7684\u4e8b\u4ef6\x3c/h3\x3e" + d + "\x3c/div\x3e\x3c/li\x3e"),
                    c.find(".btn").bind(TUI.env.ua.clickEventUp, {
                        handle: c,
                        config: a
                    }, function(a) {
                        $.ajax({
                            type: "PUT",
                            url: "/API/WorkSheet",
                            data: {
                                apptag: a.data.config.AppTag,
                                typename: a.data.config.EventType,
                                where: a.data.config.EventWhere,
                                what: "\u60a8\u6709\u4e00\u4e2a\u6765\u81ea" + TUI.env.us.fullName + "\u7684\u7d27\u6025\u4e8b\u4ef6\u9700\u8981\u5904\u7406\uff01",
                                why: a.data.config.EventInfo,
                                autoFlow: !0,
                                fromType: "Event",
                                fromid: a.data.config.EventID,
                                objectid: a.data.config.ObjectID,
                                fulltag: a.data.config.ObjectFullTag,
                                objecttype: a.data.config.ObjectType
                            },
                            dataType: "json",
                            context: a.data.handle,
                            error: function(a) {
                                toastr.error("\u7f51\u7edc\u4e0d\u7ed9\u529b\uff01", "\u53d1\u8d77\u5de5\u5355")
                            },
                            success: function(a) {
                                a.flag ? ($(this).find(".btn").remove(),
                                toastr.success("\u53d1\u8d77\u5de5\u5355\u6210\u529f\uff01", "\u53d1\u8d77\u5de5\u5355")) : (playSound("warn"),
                                toastr.warning(a.info, "\u53d1\u8d77\u5de5\u5355"))
                            }
                        })
                    }),
                    c
            } else if ("transition" == a.type) {
                if (c = "",
                d = "\x3cp\x3e\x3cb\x3e\u5904\u7f6e\uff1a\x3c/b\x3e" + a.OperateInfo + "\u3010" + a.OperateName + "\u3011\x3c/p\x3e",
                "" == a.OperateName && (d = ""),
                0 == a.OperateStatus && (c = '\x3cspan class\x3d"btn"\x3e\u53d1\u8d77\u5de5\u5355\x3c/span\x3e'),
                d = "\x3cp\x3e\x3cb\x3e\u65f6\u95f4\uff1a\x3c/b\x3e" + a.TransTime + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u4f4d\u7f6e\uff1a\x3c/b\x3e" + a.TransWhere + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u7c7b\u578b\uff1a\x3c/b\x3e" + a.TransType + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u5185\u5bb9\uff1a\x3c/b\x3e" + a.TransInfo + "\x3c/p\x3e" + d,
                "" == b || 0 <= a.appname.indexOf(b) || 0 <= d.indexOf(b) || 0 <= a.TransName.indexOf(b))
                    return c = $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + c + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e' + a.TransName + "\u7684\u5f02\u52a8\x3c/h3\x3e" + d + "\x3c/div\x3e\x3c/li\x3e"),
                    c.find(".btn").bind(TUI.env.ua.clickEventUp, {
                        handle: c,
                        config: a
                    }, function(a) {
                        $.ajax({
                            type: "PUT",
                            url: "/API/WorkSheet",
                            data: {
                                apptag: a.data.config.AppTag,
                                typename: a.data.config.TransType,
                                where: a.data.config.TransWhere,
                                what: "\u60a8\u6709\u4e00\u4e2a\u6765\u81ea" + TUI.env.us.fullName + "\u7684\u5f02\u52a8\u65e5\u5fd7\u9700\u8981\u5904\u7406\uff01",
                                why: a.data.config.TransInfo,
                                autoFlow: !0,
                                fromType: "Transition",
                                fromid: a.data.config.TransitionID,
                                objectid: a.data.config.ObjectID,
                                fulltag: a.data.config.ObjectFullTag,
                                objecttype: a.data.config.ObjectType
                            },
                            dataType: "json",
                            context: a.data.handle,
                            error: function(a) {
                                toastr.error("\u7f51\u7edc\u4e0d\u7ed9\u529b\uff01", "\u53d1\u8d77\u5de5\u5355")
                            },
                            success: function(a) {
                                a.flag ? ($(this).find(".btn").remove(),
                                toastr.success("\u53d1\u8d77\u5de5\u5355\u6210\u529f\uff01", "\u53d1\u8d77\u5de5\u5355")) : (playSound("warn"),
                                toastr.warning(a.info, "\u53d1\u8d77\u5de5\u5355"))
                            }
                        })
                    }),
                    c
            } else if ("control" == a.type) {
                if (d = "\x3cp\x3e\x3cb\x3e\u65f6\u95f4\uff1a\x3c/b\x3e" + a.ActionTime + "~" + a.ActionStatusTime + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u4f4d\u7f6e\uff1a\x3c/b\x3e" + a.ActionWhere + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u7c7b\u578b\uff1a\x3c/b\x3e" + a.RuleName + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u72b6\u6001\uff1a\x3c/b\x3e" + " \u7b49\u5f85\u4e2d \u8fd0\u884c\u4e2d \u6682\u505c \u5931\u8d25 \u6210\u529f".split(" ")[a.ActionStatus] + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u64cd\u4f5c\uff1a\x3c/b\x3e" + a.ActionStatusWhat + "\x3c/p\x3e",
                "" == b || 0 <= a.appname.indexOf(b) || 0 <= d.indexOf(b) || 0 <= a.OperateName.indexOf(b))
                    return $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e\u6765\u81ea' + a.OperateName + "\u7684\u63a7\u5236\x3c/h3\x3e" + d + "\x3c/div\x3e\x3c/li\x3e")
            } else if ("alarm" == a.type) {
                if (d = "\x3cp\x3e\x3cb\x3e\u65f6\u95f4\uff1a\x3c/b\x3e" + a.AlarmTime + "~" + a.AlarmStatusTime + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u4f4d\u7f6e\uff1a\x3c/b\x3e" + a.AlarmWhere + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u7c7b\u578b\uff1a\x3c/b\x3e" + a.RuleName + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u72b6\u6001\uff1a\x3c/b\x3e" + " \u4e00\u822c\u4fe1\u606f \u544a\u8b66 \u7d27\u6025 \u5371\u9669 \u6b63\u5e38".split(" ")[a.AlarmStatus] + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u64cd\u4f5c\uff1a\x3c/b\x3e" + a.AlarmStatusWhat + "\x3c/p\x3e",
                "" == b || 0 <= a.appname.indexOf(b) || 0 <= d.indexOf(b) || 0 <= a.OperateName.indexOf(b))
                    return $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e\u6765\u81ea' + a.OperateName + "\u7684\u62a5\u8b66\x3c/h3\x3e" + d + "\x3c/div\x3e\x3c/li\x3e")
            } else if ("worksheet" == a.type && (d = "\x3cp\x3e\x3cb\x3e\u5355\u53f7\uff1a\x3c/b\x3e" + a.WorkRecordID + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u65f6\u95f4\uff1a\x3c/b\x3e" + a.WorkWhen + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u4f4d\u7f6e\uff1a\x3c/b\x3e" + a.WorkWhere + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u539f\u56e0\uff1a\x3c/b\x3e" + a.WorkWhy + "\u3010" + a.WorkTypeName + "\u3011\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u5185\u5bb9\uff1a\x3c/b\x3e" + a.WorkWhat + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u72b6\u6001\uff1a\x3c/b\x3e" + a.HowStatusName + "\x3c/p\x3e\x3cp\x3e\x3cb\x3e\u5904\u7f6e\uff1a\x3c/b\x3e" + a.HowResult + "\u3010" + a.HowPeopleName + "\u3011\x3c/p\x3e",
            "" == b || 0 <= a.appname.indexOf(b) || 0 <= d.indexOf(b) || 0 <= a.WorkWhoName.indexOf(b)))
                return $('\x3cli\x3e\x3clable\x3e\x3cimg src\x3d"' + a.appicon + '" width\x3d"24px" border\x3d"0" alt\x3d"" style\x3d"margin: 0px 5px 2px 0;vertical-align: middle;"/\x3e' + a.appname + '\x3c/lable\x3e\x3cdiv class\x3d"infopanel"\x3e\x3ch3\x3e\u6765\u81ea' + a.WorkWhoName + "\u7684\u5de5\u5355\x3c/h3\x3e" + d + "\x3c/div\x3e\x3c/li\x3e");
            return null
        },
        loadReadMsg: function() {
            // $.ajax({
            //     type: "get",
            //     url: "/System/srv/readMsg.ejs?startTime\x3d" + (new Date).Format("yyyy-MM-dd"),
            //     dataType: "json",
            //     context: this,
            //     error: function(b) {},
            //     success: function(b) {
            //         for (var a = 0; a < b.app.length; a++)
            //             TUI.env.os[0].desktopDock.setMsgCount(b.app[a].appid, b.app[a].msgList),
            //             TUI.env.os[0].desktopShortcut.setMsgCount(b.app[a].appid, b.app[a].msgList);
            //         0 == b.msg.length ? ($("#" + this.containerBar + "_Status").find(".Message img").attr("src", "System/images/msg1.png"),
            //         $("#" + this.containerBar + "_Status").find(".Message .number").hide()) : ($("#" + this.containerBar + "_Status").find(".Message img").attr("src", "/System/style/images/msg2.png"),
            //         $("#" + this.containerBar + "_Status").find(".Message .number").show(),
            //         $("#" + this.containerBar + "_Status").find(".Message .number").html(b.msg.length))
            //     }
            // })
        },
        loadTimeLine: function() {
            var b = new Date;
            b.setHours(0, 0, 0, 0);
            var a = b.DateAdd("d", -60)
              , b = b.DateAdd("d", 1);
            // $.ajax({
            //     type: "get",
            //     url: "/System/srv/readTimeline.ejs?startTime\x3d" + a.Format("yyyy-MM-dd"),
            //     dataType: "json",
            //     context: this,
            //     error: function(a) {},
            //     success: function(a) {
            //         k = a.data;
            //         f = a.date
            //     }
            // })
        },
        dispHourLine: function(b) {
            n = {};
            g = [];
            p = {};
            q = 0;
            b.sort(function(a, c) {
                return TUI.Utils.parseDate(a.time) < TUI.Utils.parseDate(c.time) ? 1 : -1
            });
            for (var a = 0; a < b.length; a++) {
                var d = TUI.Utils.parseDate(b[a].time);
                void 0 == n[d.Format("hh:00")] && (n[d.Format("hh:00")] = [],
                g.push(d.Format("hh:00")));
                n[d.Format("hh:00")].push(b[a])
            }
            $(".timeevent").empty();
            $(".timeevent").html('\x3cbr\x3e\x3ch2 id\x3d"hTimeDay"\x3e' + TUI.Utils.parseDate(b[0].time).Format("M\u6708d\u65e5") + '\x26nbsp;\x3cspan class\x3d"timelineMore"\x3e\u4ec5\u67e5\u770b\u4e3b\u8981\u6d3b\u52a8\x3c/span\x3e\x3c/h2\x3e');
            $(".timeevent").css({
                top: "0px"
            });
            $(".timeline .linebar1").css({
                height: "0px"
            });
            $(".timeline .currbar").css({
                top: "30px"
            });
            $(".timeline .linebar2").css({
                top: "50px"
            });
            $(".timeline .currbar .currdate").html("");
            $("#hTimeDay").find(".timelineMore").bind(TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.dispTimeLine("");
                return !1
            });
            for (a = 0; a < g.length; a++)
                if (0 < n[g[a]].length) {
                    b = 0;
                    d = $('\x3ch2 id\x3d"hTimeLine' + a + '"\x3e' + g[a] + '\x3c/h2\x3e\x3cul id\x3d"mTimeLine' + a + '"\x3e\x3c/ul\x3e');
                    $(".homepanel .timeevent").append(d);
                    n[g[a]].sort(function(a, c) {
                        return TUI.Utils.parseDate(a.time) > TUI.Utils.parseDate(c.time) ? 1 : -1
                    });
                    n[g[a]].sort(function(a, c) {
                        return a.ishtml < c.ishtml ? 1 : -1
                    });
                    for (var c = 0; c < n[g[a]].length; c++) {
                        var e = this.dispTimeItem("", n[g[a]][c]);
                        null != e && ($("#mTimeLine" + a).append(e),
                        b++)
                    }
                    0 < b ? (p[g[a]] = q,
                    q += b) : d.remove()
                }
            0 < g.length && ($(".linebar1 .startdate").html(g[0]),
            $(".linebar2 .enddate").html(g[g.length - 1]));
            $(".timeline").bind(TUI.env.ua.clickEventDown, function(a) {
                r = 1
            });
            $(".timeline").bind(TUI.env.ua.clickEventUp, function(a) {
                r = 0
            });
            $(".timeline").bind(TUI.env.ua.clickEventMove, function(a) {
                if (1 == r) {
                    a = a.clientY - 50;
                    30 > a && (a = 30);
                    a > $(window).height() - 88 && (a = $(window).height() - 88);
                    $(".timeline .linebar1").css({
                        height: a - 30 + "px"
                    });
                    $(".timeline .currbar").css({
                        top: a + "px"
                    });
                    $(".timeline .linebar2").css({
                        top: a + 20 + "px"
                    });
                    var c = Math.floor((a - 30) * g.length / ($(window).height() - 120))
                      , d = $(window).height() - $(".timeevent").height() - 100;
                    if (c < g.length) {
                        var b = p[g[c]]
                          , b = ((c + 1 == g.length ? b : p[g[c + 1]]) - b) * d / q * (a - 30 - c * ($(window).height() - 120) / g.length) / ((c + 1) * ($(window).height() - 120) / g.length - c * ($(window).height() - 120) / g.length) + b * d / q;
                        0 < b || 0 >= a - 30 ? b = 0 : b < d && (b = d);
                        $(".timeevent").css({
                            top: b + "px"
                        })
                    } else
                        $(".timeevent").css({
                            top: d + "px"
                        });
                    0 >= c || c >= g.length - 1 ? $(".timeline .currbar .currdate").html("") : void 0 != p[g[c]] ? $(".timeline .currbar .currdate").html(g[c]) : $(".timeline .currbar .currdate").html("")
                }
            });
            $("#desktopFrame1_Panel_Widget").bind("mousewheel", {
                handle: this
            }, function(a, c) {
                var d = parseInt($(".timeline .currbar").css("top")) - 3 * c;
                30 > d && (d = 30);
                d >= $(window).height() - 88 && (d = $(window).height() - 88);
                $(".timeline .linebar1").css({
                    height: d - 30 + "px"
                });
                $(".timeline .currbar").css({
                    top: d + "px"
                });
                $(".timeline .linebar2").css({
                    top: d + 20 + "px"
                });
                var b = Math.floor((d - 30) * g.length / ($(window).height() - 120))
                  , e = $(window).height() - $(".timeevent").height() - 100;
                if (b < g.length) {
                    var h = p[g[b]]
                      , h = ((b + 1 == g.length ? h : p[g[b + 1]]) - h) * e / q * (d - 30 - b * ($(window).height() - 120) / g.length) / ((b + 1) * ($(window).height() - 120) / g.length - b * ($(window).height() - 120) / g.length) + h * e / q;
                    0 < h || 0 >= d - 30 ? h = 0 : h < e && (h = e);
                    $(".timeevent").css({
                        top: h + "px"
                    })
                } else
                    $(".timeevent").css({
                        top: e + "px"
                    });
                0 >= b || b >= g.length - 1 ? $(".timeline .currbar .currdate").html("") : void 0 != p[g[b]] ? $(".timeline .currbar .currdate").html(g[b]) : $(".timeline .currbar .currdate").html("");
                return !1
            })
        },
        dispTimeLine: function(b) {
            var a = 0
              , d = 0
              , c = new Date;
            c.setMinutes(0, 0);
            c = c.DateAdd("h", -2);
            m = {};
            l = 0;
            $(".timeevent").empty();
            $(".timeevent").html('\x3cbr\x3e\x3ch2  id\x3d"CurrentHead" class\x3d"mCurrent"\x3e\u5f53\u524d\x3c/h2\x3e\x3cul id\x3d"Current" class\x3d"mCurrent"\x3e\x3c/ul\x3e\x3ch2 id\x3d"TodayHead"  class\x3d"mToday"\x3e\u4eca\u65e5\u65e9\u4e9b\u65f6\u5019\x3c/h2\x3e\x3cul id\x3d"Today" class\x3d"mToday"\x3e\x3c/ul\x3e\x3ch2 id\x3d"YesterdayHead" class\x3d"mYesterday"\x3e\u6628\u5929\x3c/h2\x3e\x3cul id\x3d"Yesterday" class\x3d"mYesterday"\x3e\x3c/ul\x3e');
            $(".timeevent").css({
                top: "0px"
            });
            $(".timeline .linebar1").css({
                height: "0px"
            });
            $(".timeline .currbar").css({
                top: "30px"
            });
            $(".timeline .linebar2").css({
                top: "50px"
            });
            $(".timeline .currbar .currdate").html("");
            if (0 < f.length) {
                k[f[0]].sort(function(a, c) {
                    return TUI.Utils.parseDate(a.time) > TUI.Utils.parseDate(c.time) ? 1 : -1
                });
                k[f[0]].sort(function(a, c) {
                    return a.ishtml < c.ishtml ? 1 : -1
                });
                for (var e = 0; e < k[f[0]].length; e++)
                    if (TUI.Utils.parseDate(k[f[0]][e].time) >= c) {
                        var h = this.dispTimeItem(b, k[f[0]][e]);
                        null != h && (6 > a && $("#Current").append(h),
                        a++)
                    } else
                        h = this.dispTimeItem(b, k[f[0]][e]),
                        null != h && (6 > d && $("#Today").append(h),
                        d++);
                0 == a ? $(".mCurrent").remove() : 6 < a && ($("#CurrentHead").html('\u5f53\u524d\x26nbsp;\x3cspan class\x3d"timelineMore"\x3e\u67e5\u770b\u5168\u90e8' + a + "\u4e2a\u6d3b\u52a8\x3c/span\x3e"),
                $("#CurrentHead").find(".timelineMore").bind(TUI.env.ua.clickEventUp, {
                    handle: this,
                    msg: k[f[0]]
                }, function(a) {
                    a.data.handle.dispHourLine(a.data.msg);
                    return !1
                }));
                0 == d ? $(".mToday").remove() : 6 < d && ($("#TodayHead").html('\u4eca\u65e5\u65e9\u4e9b\u65f6\u5019\x26nbsp;\x3cspan class\x3d"timelineMore"\x3e\u67e5\u770b\u5168\u90e8' + d + "\u4e2a\u6d3b\u52a8\x3c/span\x3e"),
                $("#TodayHead").find(".timelineMore").bind(TUI.env.ua.clickEventUp, {
                    handle: this,
                    msg: k[f[0]]
                }, function(a) {
                    a.data.handle.dispHourLine(a.data.msg);
                    return !1
                }));
                if (0 < a || 0 < d)
                    m[f[0]] = l,
                    l += (6 < a ? 6 : a) + (6 < d ? 6 : d)
            }
            for (d = 1; d < f.length; d++)
                if (1 == d) {
                    c = 0;
                    k[f[d]].sort(function(a, c) {
                        return TUI.Utils.parseDate(a.time) > TUI.Utils.parseDate(c.time) ? 1 : -1
                    });
                    k[f[d]].sort(function(a, c) {
                        return a.ishtml < c.ishtml ? 1 : -1
                    });
                    for (e = 0; e < k[f[d]].length; e++)
                        if (h = this.dispTimeItem(b, k[f[d]][e]),
                        null != h)
                            if (6 > c)
                                $("#Yesterday").append(h),
                                c++;
                            else
                                break;
                    0 == c ? $(".mYesterday").remove() : 6 <= c && ($("#YesterdayHead").html('\u6628\u5929\x26nbsp;\x3cspan class\x3d"timelineMore"\x3e\u67e5\u770b\u5168\u90e8' + k[f[d]].length + "\u4e2a\u6d3b\u52a8\x3c/span\x3e"),
                    $("#YesterdayHead").find(".timelineMore").bind(TUI.env.ua.clickEventUp, {
                        handle: this,
                        msg: k[f[d]]
                    }, function(a) {
                        a.data.handle.dispHourLine(a.data.msg);
                        return !1
                    }));
                    0 < c && (m[f[d]] = l,
                    l += c)
                } else if (0 < k[f[d]].length) {
                    var c = 0
                      , g = $('\x3ch2 id\x3d"hTimeLine' + d + '"\x3e' + TUI.Utils.parseDate(f[d]).Format("M\u6708d\u65e5") + '\x3c/h2\x3e\x3cul id\x3d"mTimeLine' + d + '"\x3e\x3c/ul\x3e');
                    $(".homepanel .timeevent").append(g);
                    k[f[d]].sort(function(a, c) {
                        return TUI.Utils.parseDate(a.time) > TUI.Utils.parseDate(c.time) ? 1 : -1
                    });
                    k[f[d]].sort(function(a, c) {
                        return a.ishtml < c.ishtml ? 1 : -1
                    });
                    for (e = 0; e < k[f[d]].length; e++)
                        if (h = this.dispTimeItem(b, k[f[d]][e]),
                        null != h)
                            if (6 > c)
                                $("#mTimeLine" + d).append(h),
                                c++;
                            else
                                break;
                    0 == c ? g.remove() : 6 <= c && ($("#hTimeLine" + d).html(TUI.Utils.parseDate(f[d]).Format("M\u6708d\u65e5") + '\x26nbsp;\x3cspan class\x3d"timelineMore"\x3e\u67e5\u770b\u5168\u90e8' + k[f[d]].length + "\u4e2a\u6d3b\u52a8\x3c/span\x3e"),
                    $("#hTimeLine" + d).find(".timelineMore").bind(TUI.env.ua.clickEventUp, {
                        handle: this,
                        msg: k[f[d]]
                    }, function(a) {
                        a.data.handle.dispHourLine(a.data.msg);
                        return !1
                    }));
                    0 < c && (m[f[d]] = l,
                    l += c)
                }
            0 < f.length && (0 < a ? $(".linebar1 .startdate").html("\u5f53\u524d") : $(".linebar1 .startdate").html(TUI.Utils.parseDate(f[0]).Format("M\u6708d\u65e5")),
            $(".linebar2 .enddate").html(TUI.Utils.parseDate(f[f.length - 1]).Format("M\u6708d\u65e5")));
            $(".timeline").bind(TUI.env.ua.clickEventDown, function(a) {
                r = 1
            });
            $(".timeline").bind(TUI.env.ua.clickEventUp, function(a) {
                r = 0
            });
            $(".timeline").bind(TUI.env.ua.clickEventMove, function(a) {
                if (1 == r) {
                    a = a.clientY - 50;
                    30 > a && (a = 30);
                    a > $(window).height() - 88 && (a = $(window).height() - 88);
                    $(".timeline .linebar1").css({
                        height: a - 30 + "px"
                    });
                    $(".timeline .currbar").css({
                        top: a + "px"
                    });
                    $(".timeline .linebar2").css({
                        top: a + 20 + "px"
                    });
                    var c = Math.floor((a - 30) * f.length / ($(window).height() - 120))
                      , d = $(window).height() - $(".timeevent").height() - 100;
                    if (c < f.length) {
                        var b = m[TUI.Utils.parseDate(f[c]).Format("yyyy-MM-dd")]
                          , b = ((c + 1 == f.length ? b : m[TUI.Utils.parseDate(f[c + 1]).Format("yyyy-MM-dd")]) - b) * d / l * (a - 30 - c * ($(window).height() - 120) / f.length) / ((c + 1) * ($(window).height() - 120) / f.length - c * ($(window).height() - 120) / f.length) + b * d / l;
                        0 < b || 0 >= a - 30 ? b = 0 : b < d && (b = d);
                        $(".timeevent").css({
                            top: b + "px"
                        })
                    } else
                        $(".timeevent").css({
                            top: d + "px"
                        });
                    0 >= c || c >= f.length - 1 ? $(".timeline .currbar .currdate").html("") : void 0 != m[TUI.Utils.parseDate(f[c]).Format("yyyy-MM-dd")] ? $(".timeline .currbar .currdate").html(TUI.Utils.parseDate(f[c]).Format("M\u6708d\u65e5")) : $(".timeline .currbar .currdate").html("")
                }
            });
            $("#desktopFrame1_Panel_Widget").bind("mousewheel", {
                handle: this
            }, function(a, c) {
                var d = parseInt($(".timeline .currbar").css("top")) - 3 * c;
                30 > d && (d = 30);
                d >= $(window).height() - 88 && (d = $(window).height() - 88);
                $(".timeline .linebar1").css({
                    height: d - 30 + "px"
                });
                $(".timeline .currbar").css({
                    top: d + "px"
                });
                $(".timeline .linebar2").css({
                    top: d + 20 + "px"
                });
                var b = Math.floor((d - 30) * f.length / ($(window).height() - 120))
                  , e = $(window).height() - $(".timeevent").height() - 100;
                if (b < f.length) {
                    var h = m[TUI.Utils.parseDate(f[b]).Format("yyyy-MM-dd")]
                      , h = ((b + 1 == f.length ? h : m[TUI.Utils.parseDate(f[b + 1]).Format("yyyy-MM-dd")]) - h) * e / l * (d - 30 - b * ($(window).height() - 120) / f.length) / ((b + 1) * ($(window).height() - 120) / f.length - b * ($(window).height() - 120) / f.length) + h * e / l;
                    0 < h || 0 >= d - 30 ? h = 0 : h < e && (h = e);
                    $(".timeevent").css({
                        top: h + "px"
                    })
                } else
                    $(".timeevent").css({
                        top: e + "px"
                    });
                0 >= b || b >= f.length - 1 ? $(".timeline .currbar .currdate").html("") : void 0 != m[TUI.Utils.parseDate(f[b]).Format("yyyy-MM-dd")] ? $(".timeline .currbar .currdate").html(TUI.Utils.parseDate(f[b]).Format("M\u6708d\u65e5")) : $(".timeline .currbar .currdate").html("");
                return !1
            })
        },
        dispWeather: function() {
            $.ajax({
                type: "get",
                url: TUI.Utils.isIntranet(TUI.env.us.loginIPAddr) ? "https://hqiot.bjut.edu.cn/API/Weather" : "https://hqiot.bjut.edu.cn/API/Weather?areacode\x3d" + TUI.env.us.loginIPAddr,
                dataType: "json",
                context: this,
                error: function(b) {
                    this.msgWeather = 0
                },
                success: function(b) {
                    if (b.flag) {
                        $("#" + this.containerBar + "_Status").find(".Weather .icon").html('\x3cimg src\x3d"/resource/@Start/Weather/' + b.data.now.code + '.png"/\x3e');
                        $("#" + this.containerBar + "_Status").find(".Weather .info").html(b.data.now.feels_like + "\u2103");
                        $("#" + this.containerBar + "_Status").find(".WeatherList .today ul").empty();
                        $("#" + this.containerBar + "_Status").find(".WeatherList .today ul").append('\x3cli class\x3d"weather-icon"\x3e\x3ci class\x3d"icon-weather-' + b.data.now.code + '"\x3e\x3c/i\x3e\x3c/li\x3e\t\x3cli style\x3d"line-height:34px;position: relative;top: 10px;color: #FF9800;"\x3e\t\t\x3cdiv class\x3d"feels-like"\x3e' + b.data.now.feels_like + '\u2103\x3c/div\x3e\t\t\x3cdiv class\x3d"weather-text"\x3e' + b.data.now.text + '\x3c/div\x3e\t\x3c/li\x3e\t\x3cli style\x3d"line-height:34px;position: relative;top: 10px;"\x3e\t\t\x3cdiv class\x3d"city-name"\x3e' + b.data.city_name + '\x3c/div\x3e\t\t\x3cdiv class\x3d"visibility"\x3e' + b.data.now.wind_direction + '\x3c/div\x3e\t\x3c/li\x3e\t\x3cli style\x3d"line-height:20px;position: relative;top: 10px;"\x3e\t\t\x3cdiv class\x3d"aqi"\x3eA\x26nbsp;Q\x26nbsp;I\x26nbsp;\x26nbsp;' + b.data.now.air_quality.city.aqi + '\x3c/div\x3e\t\t\x3cdiv class\x3d"pm25"\x3ePM2.5\x26nbsp;' + b.data.now.air_quality.city.pm25 + '\x3c/div\x3e\t\t\x3cdiv class\x3d"quality"\x3e' + b.data.now.air_quality.city.quality + "\x3c/div\x3e\t\x3c/li\x3e");
                        $("#" + this.containerBar + "_Status").find(".WeatherList .future ul").empty();
                        for (var a = 1; 4 > a; a++)
                            $("#" + this.containerBar + "_Status").find(".WeatherList .future ul").append("\x3cli\x3e\x3cspan\x3e" + b.data.future[a].day + '\x3c/sapn\x3e\x3cbr\x3e\x3ci class\x3d"icon-weather-' + (0 == a ? b.data.future[a].code2 : b.data.future[a].code1) + '"\x3e\x3c/i\x3e\x3cbr\x3e\x3cspan\x3e' + b.data.future[a].low + "~" + b.data.future[a].high + "\u2103\x3c/sapn\x3e\x3cbr\x3e\x3cspan\x3e" + b.data.future[a].text + " / " + b.data.future[a].quality + "\x3c/sapn\x3e\x3cbr\x3e\x3cspan\x3e" + b.data.future[a].wind2 + "\x3c/sapn\x3e\x3c/li\x3e")
                    } else
                        this.msgWeather = 0,
                        $("#" + this.containerBar + "_Status").find(".Weather").remove(),
                        $("#" + this.containerBar + "_Status").find(".Message").css({
                            right: "172px"
                        }),
                        $("#" + this.containerBar + "_Status").find(".Search").css({
                            right: "215px"
                        })
                }
            })
        },
        dispDateTime: function() {
            $.ajax({
                type: "get",
                url: "/System/srv/login.ejs",
                dataType: "json",
                context: this,
                error: function(a) {
                    $("#" + this.containerBar + "_Status").find(".Clock").html('\x3cfont color\x3d"#ffff00"\x3e\u7f51\u7edc\u8131\u673a\x3cbr\x3e\u6b63\u5728\u91cd\u65b0\u8fde\u63a5...\x3c/font\x3e')
                },
                success: function(a) {
                    if (a.loginStatus) {
                        a = new Date;
                        var c = a.getHours();
                        a.getMinutes();
                        $("#" + this.containerBar + "_Status").find(".Clock").html((12 <= c ? "\u4e0b\u5348" : "\u4e0a\u5348") + (12 < c ? c - 12 : c) + ":" + TUI.Utils.formatNumber(a.getMinutes(), "00") + "\x3cbr\x3e" + (a.getMonth() + 1) + "\u6708" + a.getDate() + "\u65e5\x26nbsp;" + "\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" ")[a.getDay()])
                    } else
                        top.location.href = "/"
                }
            });
            var b = new Date
              , a = calendar.solar2lunar();
            $(".ClockList .today").html("\x3cdiv\x3e" + b.Format("yyyy-MM-dd") + "\x26nbsp;" + "\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" ")[b.getDay()] + '\x3c/div\x3e\x3cdiv class\x3d"day"\x3e' + b.getDate() + '\x3c/div\x3e\x3cdiv style\x3d"line-height: 22px;"\x3e\u519c\u5386' + a.IMonthCn + a.IDayCn + "\x3cbr\x3e" + a.gzYear + "\u5e74" + a.gzMonth + "\u6708" + a.gzDay + "\u65e5\x3cbr\x3e" + a.Animal + "\u5e74\x26nbsp;" + (a.isTerm ? a.Term : "") + "\x3c/div\x3e")
        },
        clear: function(b) {
            $(".HomeButton").removeClass("active");
            $(".ApplyButton").removeClass("active");
            $(".ThemeButton").removeClass("active");
            $(".StartMenu").hide();
            $(".AppMenu").hide();
            $(".ThemeMenu").hide();
            $(".TaskStatus .ClockList").hide();
            $(".TaskStatus .WeatherList").hide();
            $(".TaskStatus .UserMenu").hide();
            this.bPannelBoard && ($("#desktopFrame1").animate({
                left: 0,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal"),
            $("#pannelFrame").css({
                left: $(window).width() - 420,
                right: "unset",
                display: "block"
            }),
            $("#pannelFrame").animate({
                left: $(window).width(),
                opacity: 0,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal", function() {
                $("#pannelFrame").css({
                    left: "unset",
                    right: -420,
                    display: "none"
                });
                $("pannelFrame").empty()
            }),
            this.bPannelBoard = !1);
            1 != b && ($("#desktopFrame1_Panel_Home").show(),
            $("#desktopFrame1_Panel_Widget").hide(),
            $("#desktopFrame1").find(".desktopWrapper").removeClass("blur"),
            $(".TaskStatus .Search").hide(),
            this.bDashBoard = !1)
        },
        close: function() {
            this.bPannelBoard && ($("#desktopFrame1").animate({
                left: 0,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal"),
            $("#pannelFrame").css({
                left: $(window).width() - 420,
                right: "unset",
                display: "block"
            }),
            $("#pannelFrame").animate({
                left: $(window).width(),
                opacity: 0,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal", function() {
                $("#pannelFrame").css({
                    left: "unset",
                    right: -420,
                    display: "none"
                });
                $("pannelFrame").empty()
            }),
            this.bPannelBoard = !1)
        },
        show: function() {
            $("#" + this.containerBar).slideDown("normal")
        },
        hide: function() {
            $("#" + this.containerBar).slideUp("normal")
        },
        loadSystemMenu: function() {
            var b = $("#" + this.containerBar + "_System").find(".StartMenu .AppList");
            b.empty();
            var a = $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/system/style/images/about.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e\u5173\u4e8e\u672c\u673a\x3c/span\x3e\x3c/div\x3e');
            a.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear();
                $.ajax({
                    type: "get",
                    url: "/System/srv/about.ejs",
                    context: a.data.handle.home,
                    error: function(a) {
                        playSound("error");
                        toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u5173\u4e8eThingsOS")
                    },
                    success: function(a) {
                        TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                            container: this.container,
                            type: "html",
                            msg: "query",
                            value: a
                        },{
                            title: "\u5173\u4e8e\u672c\u673a",
                            width: 300,
                            height: 350,
                            reSize: !1,
                            showMin: !1,
                            showMax: !1,
                            center: !0,
                            modal: !0
                        });
                        TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
                    }
                })
            });
            b.append(a);
            for (var d = 0; d < TUI.env.cfg.system.installApp.length; d++)
                TUI.env.cfg.system.installApp[d].isUserApp || "system" != TUI.env.cfg.system.installApp[d].app.launch.container && "personal" != TUI.env.cfg.system.installApp[d].app.launch.container || (a = "0CB4D644-896A-4ADA-9D5F-58448BD04499" == TUI.env.cfg.system.installApp[d].appid ? $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/System/style/images/plus.png" onmousedown\x3d"return false;" style\x3d"border-radius: 8px;-moz-border-radius: 8px;-webkit-border-radius: 8px;"/\x3e\x3cbr\x3e\x3cspan\x3e' + TUI.env.cfg.system.installApp[d]["short"] + "\x3c/span\x3e\x3c/div\x3e") : "73C98149-620B-4F05-A75A-79B6C626D992" == TUI.env.cfg.system.installApp[d].appid ? $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/Webapp/Calendar/Resources/Images/' + (new Date).Format("MMdd") + '.png" onmousedown\x3d"return false;" style\x3d"border-radius: 8px;-moz-border-radius: 8px;-webkit-border-radius: 8px;"/\x3e\x3cbr\x3e\x3cspan\x3e' + TUI.env.cfg.system.installApp[d]["short"] + "\x3c/span\x3e\x3c/div\x3e") : $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"' + TUI.env.cfg.system.installApp[d].urlPath + "/" + TUI.env.cfg.system.installApp[d].icons.logo + '" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e' + TUI.env.cfg.system.installApp[d]["short"] + "\x3c/span\x3e\x3c/div\x3e"),
                a.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                    handle: this,
                    appcfg: TUI.env.cfg.system.installApp[d]
                }, function(a) {
                    a.data.handle.clear();
                    if (TUI.env.os[TUI.env.desktop - 1].checkHandle(a.data.appcfg.appid))
                        TUI.env.os[TUI.env.desktop - 1].activeHandle(a.data.appcfg.appid);
                    else {
                        var c = new Dialog({
                            container: a.data.handle.home.container,
                            type: "iframe",
                            value: a.data.appcfg.app.launch.local_path
                        },{
                            title: a.data.appcfg.name,
                            taskImg: a.data.appcfg.urlPath + "/" + a.data.appcfg.icons.logo,
                            handle: TUI.env.os[TUI.env.desktop - 1],
                            appid: a.data.appcfg.appid,
                            urlPath: a.data.appcfg.urlPath,
                            afterShow: function() {},
                            afterHide: function() {
                                this.handle.hideHandle(a.data.appcfg.appid)
                            },
                            afterClose: function() {
                                this.handle.delHandle(a.data.appcfg.appid)
                            },
                            afterSwitch: function() {
                                this.handle.switchHandle(a.data.appcfg.appid)
                            },
                            modal: !1,
                            center: !0,
                            width: a.data.appcfg.app.launch.width,
                            height: a.data.appcfg.app.launch.height
                        });
                        c.show();
                        TUI.env.os[TUI.env.desktop - 1].addHandle(c, a.data.appcfg.name, a.data.appcfg.urlPath + "/" + a.data.appcfg.icons.logo, a.data.appcfg.appid)
                    }
                }),
                b.append(a))
        },
        loadSystemApp: function(b) {
            var a = $("#" + this.containerBar + "_System").find(".AppMenu .AppList .tab1content");
            a.empty();
            var d = $("#" + this.containerBar + "_System").find(".AppMenu .AppList .tab2content");
            d.empty();
            for (var c = 0; c < TUI.env.cfg.system.installApp.length; c++)
                if ((TUI.env.cfg.system.installApp[c].isUserApp || "webapp" == TUI.env.cfg.system.installApp[c].app.launch.container || "sysapp" == TUI.env.cfg.system.installApp[c].app.launch.container || "smartapp" == TUI.env.cfg.system.installApp[c].app.launch.container || "proxy" == TUI.env.cfg.system.installApp[c].app.launch.container || "url" == TUI.env.cfg.system.installApp[c].app.launch.container) && (0 <= TUI.env.cfg.system.installApp[c].name.indexOf(b) || 0 <= TUI.env.cfg.system.installApp[c].description.indexOf(b)) && TUI.env.cfg.system.installApp[c].app.launch.enable) {
                    var e = $('\x3cdiv class\x3d"item' + (TUI.env.us.isUserSuper || TUI.env.cfg.system.installApp[c].isUserApp ? " user" : "") + '"\x3e\x3cimg src\x3d"' + TUI.env.cfg.system.installApp[c].urlPath + "/" + TUI.env.cfg.system.installApp[c].icons.logo + '" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e' + TUI.env.cfg.system.installApp[c]["short"] + '\x3c/span\x3e\x3cdiv class\x3d"uninstall"\x3e\x3c/div\x3e\x3c/div\x3e');
                    e.find(".uninstall").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                        handle: this,
                        item: e,
                        appcfg: TUI.env.cfg.system.installApp[c]
                    }, function(a) {
                        a.data.handle.clear();
                        TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                            container: a.data.handle.home.container,
                            type: "msgbox",
                            msg: "warn",
                            value: "\u60a8\u662f\u5426\u786e\u5b9a\u5378\u8f7d\u300a" + a.data.appcfg.name + "\u300b\uff1f\u6b64\u64cd\u4f5c\u5c06\u5f71\u54cd\u4f7f\u7528\u4e2d\u7684\u7528\u6237\uff0c\u5e76\u4e14\u4e0d\u53ef\u64a4\u9500\uff01\uff01"
                        },{
                            title: "\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f",
                            width: 400,
                            height: 155,
                            handle: a.data.handle,
                            appId: a.data.appcfg.appid,
                            urlPath: a.data.appcfg.urlPath,
                            afterClose: function(a) {
                                1 == a && this.handle.delAppUser(this.appId, this.urlPath)
                            },
                            reSize: !1,
                            showMin: !1,
                            showMax: !1,
                            center: !0,
                            modal: !0
                        });
                        TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show();
                        return !1
                    });
                    e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                        handle: this,
                        appcfg: TUI.env.cfg.system.installApp[c]
                    }, function(a) {
                        a.data.handle.clear();
                        if (TUI.env.os[TUI.env.desktop - 1].checkHandle(a.data.appcfg.appid))
                            TUI.env.os[TUI.env.desktop - 1].activeHandle(a.data.appcfg.appid);
                        else {
                            var c = new Dialog({
                                container: a.data.handle.home.container,
                                type: "iframe",
                                value: a.data.appcfg.app.launch.local_path
                            },{
                                title: a.data.appcfg.name,
                                taskImg: a.data.appcfg.urlPath + "/" + a.data.appcfg.icons.logo,
                                handle: TUI.env.os[TUI.env.desktop - 1],
                                appid: a.data.appcfg.appid,
                                urlPath: a.data.appcfg.urlPath,
                                afterShow: function() {},
                                afterHide: function() {
                                    this.handle.hideHandle(a.data.appcfg.appid)
                                },
                                afterClose: function() {
                                    this.handle.delHandle(a.data.appcfg.appid)
                                },
                                afterSwitch: function() {
                                    this.handle.switchHandle(a.data.appcfg.appid)
                                },
                                modal: !1,
                                center: !0,
                                width: a.data.appcfg.app.launch.width,
                                height: a.data.appcfg.app.launch.height
                            });
                            c.show();
                            TUI.env.os[TUI.env.desktop - 1].addHandle(c, a.data.appcfg.name, a.data.appcfg.urlPath + "/" + a.data.appcfg.icons.logo, a.data.appcfg.appid)
                        }
                    });
                    a.append(e)
                }
            if (!TUI.env.us.isUserSuper)
                for (c = 0; c < TUI.env.cfg.system.installApp.length; c++)
                    if (void 0 != TUI.env.cfg.system.installApp[c].app.pad && TUI.env.cfg.system.installApp[c].app.pad.enable && void 0 != TUI.env.cfg.system.installApp[c].app.pad.webapp)
                        for (var h = TUI.env.cfg.system.installApp[c].app.pad.webapp, f = 0; f < h.length; f++)
                            void 0 != h[f].local_path && (h[f].logo = TUI.env.cfg.system.installApp[c].urlPath + "/Pad/" + h[f].id + "/icon.png",
                            e = $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"' + TUI.env.cfg.system.installApp[c].urlPath + "/Pad/" + h[f].id + '/icon.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e' + h[f].text + "\x3c/span\x3e\x3c/div\x3e"),
                            e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                                handle: this,
                                padapp: h[f]
                            }, function(a) {
                                a.data.handle.clear();
                                if (TUI.env.os[TUI.env.desktop - 1].checkHandle("Pad-" + a.data.padapp.id))
                                    TUI.env.os[TUI.env.desktop - 1].activeHandle("Pad-" + a.data.padapp.id);
                                else {
                                    var c = new Dialog({
                                        container: a.data.handle.home.container,
                                        type: "iframe",
                                        value: a.data.padapp.local_path
                                    },{
                                        title: a.data.padapp.text + "\u2014\u2014\u5de5\u4f5c\u53f0",
                                        taskImg: a.data.padapp.logo,
                                        handle: TUI.env.os[TUI.env.desktop - 1],
                                        appid: "Pad-" + a.data.padapp.id,
                                        urlPath: a.data.padapp.local_path,
                                        afterShow: function() {},
                                        afterHide: function() {
                                            this.handle.hideHandle("Pad-" + a.data.padapp.id)
                                        },
                                        afterClose: function() {
                                            this.handle.delHandle("Pad-" + a.data.padapp.id)
                                        },
                                        afterSwitch: function() {
                                            this.handle.switchHandle("Pad-" + a.data.padapp.id)
                                        },
                                        modal: !1,
                                        center: !0,
                                        width: 1024,
                                        height: 720
                                    });
                                    c.show();
                                    TUI.env.os[TUI.env.desktop - 1].addHandle(c, a.data.padapp.text, a.data.padapp.logo, "Pad-" + a.data.padapp.id)
                                }
                            }),
                            a.append(e));
            e = $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/System/style/images/plus.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e\u6dfb\u52a0\u5e94\u7528\x3c/span\x3e\x3c/div\x3e');
            e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.handle.home.container,
                    type: "iframe",
                    value: "tools/upload_apply/"
                },{
                    title: "\u5e94\u7528\u7a0b\u5e8f",
                    width: 450,
                    height: 310,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        3 == a && $("#" + this.handle.containerBar + "_System").find(".ApplyButton").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            a.append(e);
            for (c = 0; c < TUI.env.cfg.system.installWidget.length; c++)
                if (0 <= TUI.env.cfg.system.installWidget[c].name.indexOf(b) || 0 <= TUI.env.cfg.system.installWidget[c].description.indexOf(b))
                    e = $('\x3cdiv class\x3d"item' + (TUI.env.us.isUserSuper || TUI.env.cfg.system.installWidget[c].isUserWidget ? " user" : "") + '"\x3e\x3cimg src\x3d"' + TUI.env.cfg.system.installWidget[c].urlPath + "/" + TUI.env.cfg.system.installWidget[c].icons.logo + '" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e' + TUI.env.cfg.system.installWidget[c].name + '\x3c/span\x3e\x3cdiv class\x3d"uninstall"\x3e\x3c/div\x3e\x3c/div\x3e'),
                    e.find(".uninstall").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                        handle: this,
                        item: e,
                        appcfg: TUI.env.cfg.system.installWidget[c]
                    }, function(a) {
                        a.data.handle.clear();
                        TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                            container: a.data.handle.home.container,
                            type: "msgbox",
                            msg: "warn",
                            value: "\u60a8\u662f\u5426\u786e\u5b9a\u5378\u8f7d\u300a" + a.data.appcfg.name + "\u300b\uff1f\u6b64\u64cd\u4f5c\u5c06\u5f71\u54cd\u4f7f\u7528\u4e2d\u7684\u7528\u6237\uff0c\u5e76\u4e14\u4e0d\u53ef\u64a4\u9500\uff01"
                        },{
                            title: "\u5378\u8f7d\u684c\u9762\u90e8\u4ef6",
                            width: 400,
                            height: 155,
                            handle: a.data.handle,
                            appId: a.data.appcfg.appid,
                            urlPath: a.data.appcfg.urlPath,
                            afterClose: function(a) {
                                1 == a && this.handle.delWidget(this.appId, this.urlPath)
                            },
                            reSize: !1,
                            showMin: !1,
                            showMax: !1,
                            center: !0,
                            modal: !0
                        });
                        TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show();
                        return !1
                    }),
                    e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                        handle: this,
                        appcfg: TUI.env.cfg.system.installWidget[c]
                    }, function(a) {
                        a.data.handle.clear();
                        a.data.handle.home.setWidget(a.data.appcfg.appid, a.data.appcfg.urlPath, 2)
                    }),
                    d.append(e);
            e = $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/System/style/images/plus.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e\u6dfb\u52a0\u90e8\u4ef6\x3c/span\x3e\x3c/div\x3e');
            e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.handle.home.container,
                    type: "iframe",
                    value: "tools/upload_widget/"
                },{
                    title: "\u5b89\u88c5\u684c\u9762\u90e8\u4ef6",
                    width: 450,
                    height: 310,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        3 == a && $("#" + this.handle.containerBar + "_System").find(".ApplyButton").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            d.append(e)
        },
        loadSystemTheme: function(b) {
            var a = $("#" + this.containerBar + "_System").find(".ThemeMenu .ThemeList .tab1content");
            a.empty();
            var d = $("#" + this.containerBar + "_System").find(".ThemeMenu .ThemeList .tab2content");
            d.empty();
            for (var c = 0; c < this.themelist.tList.length; c++)
                if (0 <= this.themelist.tList[c].fileName.indexOf(b)) {
                    var e = $('\x3cdiv class\x3d"item' + (TUI.env.us.isUserSuper || this.themelist.tList[c].isUserTheme ? " user" : "") + '"\x3e\x3cimg src\x3d"' + this.themelist.tList[c].urlPath + '/snapshot.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e' + this.themelist.tList[c].fileName + '\x3c/span\x3e\x3cdiv class\x3d"uninstall"\x3e\x3c/div\x3e\x3c/div\x3e');
                    e.find(".uninstall").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                        handle: this,
                        item: e,
                        themecfg: this.themelist.tList[c]
                    }, function(a) {
                        $(a.data.item).remove();
                        $.ajax({
                            url: "/System/srv/deltheme.ejs?themepath\x3d" + a.data.themecfg.fileName + "\x26isUser\x3d" + (a.data.themecfg.isUserTheme ? "user" : "system"),
                            dataType: "text",
                            error: function(a) {
                                playSound("error");
                                toastr.error("\u5220\u9664\u7528\u6237\u4e3b\u9898\u5931\u8d25,\u8bf7\u91cd\u8bd5\uff01", "\u5220\u9664\u7528\u6237\u4e3b\u9898")
                            },
                            success: function(a) {
                                "FAIL" == a && (playSound("warn"),
                                toastr.warning("\u5220\u9664\u7528\u6237\u4e3b\u9898\u5931\u8d25\uff01", "\u5220\u9664\u7528\u6237\u4e3b\u9898"))
                            }
                        });
                        return !1
                    });
                    e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                        handle: this,
                        themecfg: this.themelist.tList[c]
                    }, function(a) {
                        a.data.handle.clear();
                        a.data.handle.home.desktopFrame.clear();
                        a.data.handle.home.desktopFrame.setup({
                            bTensile: !0,
                            imgWrapper: a.data.themecfg.themePath + "/i/wrapper.jpg",
                            bTheme: !0
                        });
                        document.getElementById("mytheme").href = a.data.themecfg.themePath + "/theme.css";
                        $.ajax({
                            type: "post",
                            url: "/System/srv/setTheme.ejs",
                            data: {
                                imgTheme: a.data.themecfg.themePath,
                                deskTop: TUI.env.desktop
                            },
                            dataType: "text",
                            error: function(a) {
                                playSound("error");
                                toastr.error("\u8bbe\u7f6e\u7cfb\u7edf\u4e3b\u9898\u5931\u8d25,\u8bf7\u91cd\u8bd5\uff01", "\u8bbe\u7f6e\u7cfb\u7edf\u4e3b\u9898")
                            },
                            success: function(a) {
                                "OK" == a ? (playSound("info"),
                                toastr.success("\u8bbe\u7f6e\u60a8\u7684\u7cfb\u7edf\u4e3b\u9898\u6210\u529f\uff01\uff01", "\u8bbe\u7f6e\u7cfb\u7edf\u4e3b\u9898")) : (playSound("warn"),
                                toastr.warning("\u8bbe\u7f6e\u7cfb\u7edf\u4e3b\u9898\u5931\u8d25\uff01", "\u8bbe\u7f6e\u7cfb\u7edf\u4e3b\u9898"))
                            }
                        })
                    });
                    a.append(e)
                }
            e = $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/System/style/images/plus2.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e\u6dfb\u52a0\u4e3b\u9898\x3c/span\x3e\x3c/div\x3e');
            e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.handle.home.container,
                    type: "iframe",
                    value: "tools/upload_theme/"
                },{
                    title: "\u5e94\u7528\u4e3b\u9898",
                    width: 450,
                    height: 310,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        3 == a && $("#" + this.handle.containerBar + "_System").find(".ThemeButton").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            a.append(e);
            for (c = 0; c < this.themelist.wList.length; c++)
                0 <= this.themelist.wList[c].fileName.indexOf(b) && (e = $('\x3cdiv class\x3d"item' + (TUI.env.us.isUserSuper || this.themelist.wList[c].isUserWrapper ? " user" : "") + '"\x3e\x3cimg src\x3d"' + this.themelist.wList[c].urlPath + '" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan class\x3d"wbtn1"\x3e\x26nbsp;\u5e73\x26nbsp;\u94fa\x26nbsp;\x3c/span\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x3cspan class\x3d"wbtn2"\x3e\x26nbsp;\u62c9\x26nbsp;\u4f38\x26nbsp;\x3c/span\x3e\x3cdiv class\x3d"uninstall"\x3e\x3c/div\x3e\x3c/div\x3e'),
                e.find(".uninstall").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                    handle: this,
                    item: e,
                    themecfg: this.themelist.wList[c]
                }, function(a) {
                    $(a.data.item).remove();
                    $.ajax({
                        url: "/System/srv/delimage.ejs?filename\x3d" + a.data.themecfg.fileName + "\x26isUser\x3d" + (a.data.themecfg.isUserWrapper ? "user" : "system"),
                        dataType: "text",
                        error: function(a) {
                            playSound("error");
                            toastr.error("\u5220\u9664\u7528\u6237\u5899\u7eb8\u5931\u8d25,\u8bf7\u91cd\u8bd5\uff01", "\u5220\u9664\u7528\u6237\u5899\u7eb8")
                        },
                        success: function(a) {
                            toastr.success(a, "\u5220\u9664\u7528\u6237\u5899\u7eb8")
                        }
                    });
                    return !1
                }),
                e.find(".wbtn1").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                    handle: this,
                    themecfg: this.themelist.wList[c]
                }, function(a) {
                    a.data.handle.clear();
                    a.data.handle.home.desktopFrame.setup({
                        bTensile: !1,
                        imgWrapper: a.data.themecfg.srcPath
                    })
                }),
                e.find(".wbtn2").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                    handle: this,
                    themecfg: this.themelist.wList[c]
                }, function(a) {
                    a.data.handle.clear();
                    a.data.handle.home.desktopFrame.setup({
                        bTensile: !0,
                        imgWrapper: a.data.themecfg.srcPath
                    })
                }),
                e.find("img").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                    handle: this,
                    themecfg: this.themelist.wList[c]
                }, function(a) {
                    a.data.handle.clear();
                    a.data.handle.home.desktopFrame.setup({
                        bTensile: !0,
                        imgWrapper: a.data.themecfg.srcPath
                    })
                }),
                d.append(e));
            e = $('\x3cdiv class\x3d"item"\x3e\x3cimg src\x3d"/System/style/images/plus2.png" onmousedown\x3d"return false;"/\x3e\x3cbr\x3e\x3cspan\x3e\u6dfb\u52a0\u5899\u7eb8\x3c/span\x3e\x3c/div\x3e');
            e.bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.handle.home.container,
                    type: "iframe",
                    value: "tools/upload_wrapper/"
                },{
                    title: "\u684c\u9762\u5899\u7eb8",
                    width: 450,
                    height: 310,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        3 == a && $("#" + this.handle.containerBar + "_System").find(".ThemeButton").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            });
            d.append(e)
        },
        addSystemButton: function(b, a, d) {
            "home" == d ? ($("#" + this.containerBar + "_System ul").append('\t\t\x3cli\x3e \t\t\t\x3cdiv  id\x3d"' + this.containerBar + "_" + d + '" class\x3d"' + a + '"\x3e\x3c/div\x3e\t\t\t\x3cdiv class\x3d"StartMenu"\x3e\t\t\t\t\x3cdiv class\x3d"AppList"\x3e\x3c/div\x3e\t\t\t\t\x3cdiv class\x3d"UserOperate"\x3e\t\t\t\t\t\x3cdiv class\x3d"DoLock"\x3e\x3ci class\x3d"fa fa-lock"\x3e\x3c/i\x3e\x26nbsp;\u9501 \u5b9a\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"Logout"\x3e\x3ci class\x3d"fa fa-sign-out"\x3e\x3c/i\x3e\x26nbsp;\u6ce8 \u9500\x3c/div\x3e\t\t\t\t\x3c/div\x3e\t\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e\t\t\t\x3c/div\x3e\t\t\x3c/li\x3e '),
            $("#" + this.containerBar + "_" + d).bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1);
                $(".HomeButton").removeClass("active");
                $(".ApplyButton").removeClass("active");
                $(".ThemeButton").removeClass("active");
                $(this).addClass("active");
                $(".StartMenu").show();
                $(".AppMenu").hide();
                $(".ThemeMenu").hide();
                location.hash = "#start";
                TUI.env.us.isHashChange = !1
            }),
            $("#" + this.containerBar + "_System").find(".StartMenu .DoLock").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.parent.container,
                    type: "msgbox",
                    msg: "query",
                    value: "\u60a8\u662f\u5426\u786e\u5b9a\u9501\u5b9aThingsOS\u684c\u9762\uff1f"
                },{
                    title: "\u9501\u5b9a\u684c\u9762",
                    width: 400,
                    height: 155,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        1 == a && ($("#loginFrame").show(),
                        $("#loginFrame").css({
                            left: $(window).width() + 50,
                            opacity: 0
                        }),
                        $("#loginFrame").animate({
                            left: 0,
                            opacity: 1,
                            avoidTransforms: !1,
                            useTranslate3d: TUI.env.ua.has3d
                        }, 1E3, function() {
                            TUI.env.login.reset();
                            TUI.env.login.show(700);
                            TUI.env.desktop = 0
                        }),
                        $("#desktopFrame1").animate({
                            left: -($(window).width() + 50),
                            opacity: 0,
                            avoidTransforms: !1,
                            useTranslate3d: TUI.env.ua.has3d
                        }, 1E3, function() {
                            $("#desktopFrame1").hide()
                        }))
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            }),
            $("#" + this.containerBar + "_System").find(".StartMenu .Logout").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.clear();
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                    container: a.data.parent.container,
                    type: "msgbox",
                    msg: "warn",
                    value: "\u60a8\u786e\u5b9a\u8981\u6ce8\u9500ThingsOS\u684c\u9762\u5417\uff1f"
                },{
                    title: "\u6ce8\u9500\u684c\u9762",
                    width: 400,
                    height: 155,
                    handle: a.data.handle,
                    afterClose: function(a) {
                        1 == a && $.ajax({
                            type: "get",
                            url: "/System/srv/logout.ejs",
                            error: function(a) {
                                playSound("error");
                                toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u6ce8\u9500\u8d26\u6237")
                            },
                            success: function(a) {
                                top.location.href = "/"
                            }
                        })
                    },
                    reSize: !1,
                    showMin: !1,
                    showMax: !1,
                    center: !0,
                    modal: !0
                });
                TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show()
            })) : "apply" == d ? ($("#" + this.containerBar + "_System ul").append('\t\t\x3cli\x3e \t\t\t\x3cdiv  id\x3d"' + this.containerBar + "_" + d + '" class\x3d"' + a + '"\x3e\x3c/div\x3e\t\t\t\x3cdiv class\x3d"AppMenu"\x3e\t\t\t\t\x3cdiv class\x3d"AppList"\x3e\t\t\t\t\t\x3cdiv class\x3d"tab1 active"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"tab1content"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"tab2"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"tab2content"\x3e\x3c/div\x3e\t\t\t\t\x3c/div\x3e\t\t\t\t\x3cdiv class\x3d"AppSearch"\x3e\t\t\t\t\t\x3cdiv class\x3d"searchBtn"\x3e\x3ci class\x3d"fa fa-search"\x3e\x3c/i\x3e\x3c/div\x3e\t\t\t\t\t\x3cinput type\x3d"text" class\x3d"searchKey" placeholder\x3d"\u641c\u7d22..." required\x3e\t\t\t\t\t\x3cdiv class\x3d"edit"\x3e\u7ba1 \u7406\x3c/div\x3e\t\t\t\t\x3c/div\x3e\t\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e\t\t\t\x3c/div\x3e\t\t\x3c/li\x3e '),
            $("#" + this.containerBar + "_" + d).bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1);
                $(".HomeButton").removeClass("active");
                $(".ApplyButton").removeClass("active");
                $(".ThemeButton").removeClass("active");
                $(this).addClass("active");
                $(".StartMenu").hide();
                $(".AppMenu").show();
                $(".ThemeMenu").hide();
                $(".AppMenu .AppSearch .edit").removeClass("active");
                $(".AppMenu .AppList .tab1").addClass("active");
                $(".AppMenu .AppList .tab2").removeClass("active");
                $(".AppMenu .AppList .tab1content").show();
                $(".AppMenu .AppList .tab2content").hide();
                a.data.handle.isAppEdit = !1;
                location.hash = "#app";
                TUI.env.us.isHashChange = !1;
                $.ajax({
                    type: "get",
                    url: "System/json/readConfig.json",
                    dataType: "json",
                    context: a.data.handle,
                    error: function(a) {
                        playSound("error");
                        toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u4e2a\u4eba\u8bbe\u5b9a")
                    },
                    success: function(a) {
                        TUI.env.cfg = a;
                        a = $(".AppMenu .AppSearch .searchKey").val();
                        this.loadSystemApp(a)
                    }
                })
            }),
            $(".AppMenu .AppList .tab1").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(this).addClass("active");
                $(".AppMenu .AppList .tab2").removeClass("active");
                $(".AppMenu .AppList .tab1content").show();
                $(".AppMenu .AppList .tab2content").hide();
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1)
            }),
            $(".AppMenu .AppList .tab2").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(this).addClass("active");
                $(".AppMenu .AppList .tab1").removeClass("active");
                $(".AppMenu .AppList .tab1content").hide();
                $(".AppMenu .AppList .tab2content").show();
                a.data.handle.bDashBoard || ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1)
            }),
            $(".AppMenu .AppSearch .searchBtn").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                var c = $(".AppMenu .AppSearch .searchKey").val();
                a.data.handle.loadSystemApp(c)
            }),
            $(".AppMenu .AppSearch  .searchKey").change({
                handle: this
            }, function(a) {
                var c = $(this).val();
                a.data.handle.loadSystemApp(c)
            }),
            $(".AppMenu .AppSearch .edit").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.isAppEdit ? ($(".AppMenu .AppList .tab1content").find(".item").removeClass("select"),
                $(".AppMenu .AppList .tab2content").find(".item").removeClass("select"),
                $(this).removeClass("active"),
                a.data.handle.isAppEdit = !1) : ($(".AppMenu .AppList .tab1content").find(".item").addClass("select"),
                $(".AppMenu .AppList .tab2content").find(".item").addClass("select"),
                $(this).addClass("active"),
                a.data.handle.isAppEdit = !0)
            })) : "theme" == d && ($("#" + this.containerBar + "_System ul").append('\t\t\x3cli\x3e \t\t\t\x3cdiv  id\x3d"' + this.containerBar + "_" + d + '" class\x3d"' + a + '"\x3e\x3c/div\x3e\t\t\t\x3cdiv class\x3d"ThemeMenu"\x3e\t\t\t\t\x3cdiv class\x3d"ThemeList"\x3e\t\t\t\t\t\x3cdiv class\x3d"tab1 active"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"tab1content"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"tab2"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"tab2content"\x3e\x3c/div\x3e\t\t\t\t\x3c/div\x3e\t\t\t\t\x3cdiv class\x3d"ThemeSearch"\x3e\t\t\t\t\t\x3cdiv class\x3d"searchBtn"\x3e\x3ci class\x3d"fa fa-search"\x3e\x3c/i\x3e\x3c/div\x3e\t\t\t\t\t\x3cinput type\x3d"text" class\x3d"searchKey" placeholder\x3d"\u641c\u7d22..." required\x3e\t\t\t\t\t\x3cdiv class\x3d"edit"\x3e\u7f16 \u8f91\x3c/div\x3e\t\t\t\t\x3c/div\x3e\t\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e\t\t\t\x3c/div\x3e\t\t\x3c/li\x3e '),
            $("#" + this.containerBar + "_" + d).bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.bDashBoard && ($("#desktopFrame1_Panel_Widget").animate({
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "fast", function() {
                    $("#desktopFrame1_Panel_Home").show();
                    $("#desktopFrame1_Panel_Widget").hide();
                    $("#desktopFrame1").find(".desktopWrapper").removeClass("blur");
                    $(".TaskStatus .Search").hide()
                }),
                a.data.handle.bDashBoard = !1,
                a.data.handle.bDashBoard ? $("#" + a.data.handle.containerBar + "_Status").find(".DashBoard").html('\x3cimg src\x3d"/System/style/images/22.png"/\x3e') : $("#" + a.data.handle.containerBar + "_Status").find(".DashBoard").html('\x3cimg src\x3d"/System/style/images/11.png"/\x3e'));
                $(".HomeButton").removeClass("active");
                $(".ApplyButton").removeClass("active");
                $(".ThemeButton").removeClass("active");
                $(this).addClass("active");
                $(".StartMenu").hide();
                $(".AppMenu").hide();
                $(".ThemeMenu").show();
                $(".ThemeMenu .ThemeSearch .edit").removeClass("active");
                a.data.handle.isThemeEdit = !1;
                location.hash = "#theme";
                TUI.env.us.isHashChange = !1;
                $.ajax({
                    type: "get",
                    url: "/System/json/theme.json",
                    dataType: "json",
                    context: a.data.handle,
                    error: function(a) {
                        playSound("error");
                        toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u684c\u9762\u4e3b\u9898")
                    },
                    success: function(a) {
                        this.themelist = a;
                        a = $(".ThemeMenu .ThemeSearch .searchKey").val();
                        this.loadSystemTheme(a)
                    }
                })
            }),
            $(".ThemeMenu .ThemeList .tab1").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(this).addClass("active");
                $(".ThemeMenu .ThemeList .tab2").removeClass("active");
                $(".ThemeMenu .ThemeList .tab1content").show();
                $(".ThemeMenu .ThemeList .tab2content").hide()
            }),
            $(".ThemeMenu .ThemeList .tab2").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                $(this).addClass("active");
                $(".ThemeMenu .ThemeList .tab1").removeClass("active");
                $(".ThemeMenu .ThemeList .tab1content").hide();
                $(".ThemeMenu .ThemeList .tab2content").show()
            }),
            $(".ThemeMenu .ThemeSearch .searchBtn").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                var b = $(".ThemeMenu .ThemeSearch .searchKey").val();
                a.data.handle.loadSystemTheme(b)
            }),
            $(".ThemeMenu .ThemeSearch  .searchKey").change({
                handle: this
            }, function(a) {
                var b = $(this).val();
                a.data.handle.loadSystemTheme(b)
            }),
            $(".ThemeMenu .ThemeSearch .edit").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: this,
                parent: this.home
            }, function(a) {
                a.data.handle.isThemeEdit ? ($(".ThemeMenu .ThemeList .tab1content").find(".item").removeClass("select"),
                $(".ThemeMenu .ThemeList .tab2content").find(".item").removeClass("select"),
                $(this).removeClass("active"),
                a.data.handle.isThemeEdit = !1) : ($(".ThemeMenu .ThemeList .tab1content").find(".item").addClass("select"),
                $(".ThemeMenu .ThemeList .tab2content").find(".item").addClass("select"),
                $(this).addClass("active"),
                a.data.handle.isThemeEdit = !0)
            }))
        },
        delAppUser: function(b, a) {
            $.ajax({
                type: "post",
                url: "/System/srv/delapp.ejs",
                data: {
                    appId: b,
                    urlPath: a
                },
                dataType: "text",
                context: this,
                error: function(a) {
                    playSound("error");
                    toastr.error("\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f\u5931\u8d25,\u8bf7\u91cd\u8bd5\uff01", "\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f")
                },
                success: function(d) {
                    "FORBIDDEN" == d ? (playSound("warn"),
                    toastr.warning("\u5f53\u524d\u7528\u6237\u7981\u6b62\u5378\u8f7d\u8be5\u5e94\u7528\u7a0b\u5e8f\uff01", "\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f")) : "OK" == d ? (playSound("info"),
                    this.home.uninstall(b, a),
                    toastr.info("\u5f53\u524d\u7528\u6237\u5378\u8f7d\u8be5\u5e94\u7528\u7a0b\u5e8f\u6210\u529f\uff01", "\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f"),
                    $("#" + this.containerBar + "_System").find(".ApplyButton").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)) : (playSound("warn"),
                    toastr.warning("\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f\u5931\u8d25\uff01" + d, "\u5378\u8f7d\u5e94\u7528\u7a0b\u5e8f"))
                }
            })
        },
        delWidget: function(b, a) {
            $.ajax({
                type: "post",
                url: "/System/srv/remove_widget.ejs",
                data: {
                    appId: b,
                    urlPath: a
                },
                dataType: "text",
                context: this,
                error: function(a) {
                    playSound("error");
                    toastr.error("\u5378\u8f7d\u684c\u9762\u90e8\u4ef6\u5931\u8d25,\u8bf7\u91cd\u8bd5\uff01", "\u5378\u8f7d\u684c\u9762\u90e8\u4ef6")
                },
                success: function(a) {
                    "FORBIDDEN" == a ? (playSound("warn"),
                    toastr.warning("\u5f53\u524d\u7528\u6237\u7981\u6b62\u5378\u8f7d\u8be5\u684c\u9762\u90e8\u4ef6\uff01", "\u5378\u8f7d\u684c\u9762\u90e8\u4ef6")) : "OK" == a ? (playSound("info"),
                    this.home.delWidget(b),
                    toastr.info("\u5f53\u524d\u7528\u6237\u5378\u8f7d\u8be5\u684c\u9762\u90e8\u4ef6\u6210\u529f\uff01", "\u5378\u8f7d\u684c\u9762\u90e8\u4ef6"),
                    $("#" + this.containerBar + "_System").find(".ApplyButton").trigger(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp)) : (playSound("warn"),
                    toastr.warning("\u5378\u8f7d\u684c\u9762\u90e8\u4ef6\u5931\u8d25\uff01" + a, "\u5378\u8f7d\u684c\u9762\u90e8\u4ef6"))
                }
            })
        },
        addTaskButton: function(b, a, d, c, e) {
            $("#" + this.containerBar + "_Button ul").append('\t\t\x3cli  id\x3d"' + this.containerBar + "_" + d + '"\x3e \t\t\t\x3cdiv class\x3d"icon"\x3e \t\t\t\t\x3cdiv class\x3d"label"\x3e \t\t\t\t\t\x3cem\x3e' + b + '\x3c/em\x3e \t\t\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e \t\t\t\t\x3c/div\x3e \t\t\t\x3c/div\x3e \t\t\t\x3cdiv  id\x3d"' + this.containerBar + "_" + d + '_Button" class\x3d"ButtonItem"\x3e\t\t\t\t\x3cimg src\x3d"' + a + '"   onmousedown\x3d"return false;"/\x3e          \x3c/div\x3e\t\t\t\t\x3c/li\x3e ');
            $("#" + this.containerBar + "_" + d + "_Button").bind(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, {
                handle: c,
                taskID: d
            }, e)
        },
        mdyTaskButton: function(b, a, d) {},
        delTaskButton: function(b) {
            $("#" + this.containerBar + "_" + b).remove()
        },
        setTaskActive: function(b) {
            $("#" + this.containerBar + "_" + b + "_Button").removeClass();
            $("#" + this.containerBar + "_" + b + "_Button").addClass("ButtonItemActive")
        },
        setTaskNormal: function(b) {
            $("#" + this.containerBar + "_" + b + "_Button").removeClass();
            $("#" + this.containerBar + "_" + b + "_Button").addClass("ButtonItem")
        },
        clearTaskButton: function() {
            $("#" + this.containerBar + "_Button ul").empty()
        },
        showTaskButton: function() {
            $("#" + this.containerBar + "_Button").show()
        },
        hideTaskButton: function() {
            $("#" + this.containerBar + "_Button").hide()
        }
    }
}
;