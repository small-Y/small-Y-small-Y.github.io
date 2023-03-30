var myApp = TUI.namespace("myApp");
$(document).ready(function() {
    if (TUI.env.ua.html5)
        if (toastr.options = {
            closeButton: !0,
            debug: !1,
            positionClass: "toast-bottom-right",
            onclick: null,
            showDuration: "1000",
            hideDuration: "1000",
            timeOut: "8000",
            extendedTimeOut: "5000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        },500 >= $(window).width())
            top.location.href = "/WebMobile/";
        else {
            document.body.onselectstart = document.body.oncontextmenu = function() {
                return !1
            };
            var b = null;
            $.ajax({
                type: "get",
                url: "https://hqiot.bjut.edu.cn/System/srv/getTodayPic.ejs",
                dataType: "json",
                error: function(a) {},
                success: function(result) {
                    b = new SmartDeskTop("loginFrame",{
                        bTensile: !0,
                        imgWrapper: 'resource'+result.imgWrapper,
                        videoWrapper: result.videoWrapper,
                        bLogin: !0,
                        id: 0
                    });
                    b.init();
                    TUI.env.login = new SmartLogin(b.getPanel(),{
                        userName: $.cookie("fUser"),
                        passWord: "",
                        handler: function(a, b) {
                            TUI.env.login.hide(500);
                            var c = TUI.env.us.loginRand
                              , d = TUI.Utils.hex_sha1(TUI.env.login.userName + "-" + c)
                              , e = TUI.Utils.hex_sha1(TUI.env.login.userName + "-" + b)
                              , d = TUI.Utils.hex_sha1(d.substr(2 * Math.floor(c % 36 / 2), 4) + e.substr(2 * Math.floor(c % 36 / 2), 4))
                              , d = TUI.Utils.hex_sha1(d.substr(2 * Math.floor(c % 34 / 2), 6));
                            $.ajax({
                                type: "post",
                                url: "https://hqiot.bjut.edu.cn/System/srv/login.ejs",
                                data: {
                                    userName: TUI.env.login.userName,
                                    passHash: d.substr(2 * Math.floor(c % 32 / 2), 8)
                                },
                                dataType: "json",
                                error: function(a) {
                                    TUI.env.login.reset();
                                    TUI.env.login.show(700);
                                    playSound("error");
                                    toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u8d26\u6237\u767b\u5f55")
                                },
                                success: function(a) {
                                    TUI.env.us = a;
                                    if (a.loginStatus) {
                                        if (1 == a.userTypeNum) {
                                            var b = !1, d;
                                            for (d in a.rightList)
                                                for (var c = a.rightList[d], e = 0; e < c.length; e++) {
                                                    if (0 <= c[e].indexOf("desktop.") || 0 <= c[e].indexOf("pad.")) {
                                                        b = !0;
                                                        break
                                                    }
                                                    if (b)
                                                        break
                                                }
                                            if (!b) {
                                                TUI.env.login.reset();
                                                TUI.env.login.show(700);
                                                playSound("warn");
                                                toastr.warning("\u60a8\u8fd8\u6ca1\u6709\u684c\u9762\u5e94\u7528\u6388\u6743\uff01\uff01\uff01", "\u8d26\u6237\u767b\u5f55");
                                                return
                                            }
                                        }
                                        $.cookie("fUser", TUI.env.login.userName, {
                                            expires: 7
                                        });
                                        0 == TUI.env.os.length ? initDesktop() : (TUI.env.desktop = 1,
                                        $("#desktopFrame1").show(),
                                        $("#desktopFrame1").css({
                                            left: -($(window).width() + 50),
                                            opacity: 0
                                        }),
                                        $("#desktopFrame1").animate({
                                            left: 0,
                                            opacity: 1,
                                            avoidTransforms: !1,
                                            useTranslate3d: TUI.env.ua.has3d
                                        }, 1E3, function() {
                                            playSound("desktop")
                                        }),
                                        $("#loginFrame").animate({
                                            left: $(window).width() + 50,
                                            opacity: 0,
                                            avoidTransforms: !1,
                                            useTranslate3d: TUI.env.ua.has3d
                                        }, 1E3, function() {
                                            $("#loginFrame").hide()
                                        }));
                                        location.hash = "#desktop";
                                        TUI.env.us.isHashChange = !1
                                    } else
                                        TUI.env.login.reset(),
                                        TUI.env.login.show(700),
                                        playSound("warn"),
                                        toastr.warning(a.userMsg, "\u8d26\u6237\u767b\u5f55")
                                }
                            })
                        }
                    });
                    TUI.env.login.init()
                }
            });
            $(this).oneTime(1E3, function() {
                $("#warningCover").remove();
                $("#startingCover").remove();
                playSound("start");
                $.ajax({
                    type: "get",
                    url: "https://hqiot.bjut.edu.cn/System/srv/login.ejs",
                    dataType: "json",
                    error: function(a) {
                        $("#loginFrame").fadeOut(3500, function() {
                            self.location = "/"
                        });
                        playSound("error");
                        toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u8d26\u6237\u767b\u5f55")
                    },
                    success: function(a) {
                        TUI.env.us = a;
                        TUI.env.us.isSSOAuth && "" != TUI.env.us.ssoName ? $(".ssoLogin").html('\x3ca href\x3d"/API/SSO/AccessToken?state\x3d*"\x3e' + TUI.env.us.ssoName + "\x3c/a\x3e") : $(".ssoLogin").remove();
                        if (a.loginStatus) {
                            if (1 == a.userTypeNum) {
                                var e = !1, f;
                                for (f in a.rightList)
                                    for (var c = a.rightList[f], d = 0; d < c.length; d++) {
                                        if (0 <= c[d].indexOf("desktop.") || 0 <= c[d].indexOf("pad.")) {
                                            e = !0;
                                            break
                                        }
                                        if (e)
                                            break
                                    }
                                if (!e) {
                                    null != b && b.show(400);
                                    TUI.env.login.show(700);
                                    location.hash = "#login";
                                    toastr.warning("\u60a8\u8fd8\u6ca1\u6709\u684c\u9762\u5e94\u7528\u6388\u6743\uff01\uff01\uff01", "\u8d26\u6237\u767b\u5f55");
                                    return
                                }
                            }
                            0 == TUI.env.os.length ? initDesktop() : (TUI.env.desktop = 1,
                            $("#desktopFrame1").show(),
                            $("#desktopFrame1").css({
                                left: -($(window).width() + 50),
                                opacity: 0
                            }),
                            $("#desktopFrame1").animate({
                                left: 0,
                                opacity: 1,
                                avoidTransforms: !1,
                                useTranslate3d: TUI.env.ua.has3d
                            }, 1E3, function() {
                                playSound("desktop")
                            }),
                            $("#loginFrame").animate({
                                left: $(window).width() + 50,
                                opacity: 0,
                                avoidTransforms: !1,
                                useTranslate3d: TUI.env.ua.has3d
                            }, 1E3, function() {
                                $("#loginFrame").hide()
                            }));
                            location.hash = "#desktop";
                            TUI.env.us.isHashChange = !1
                        } else
                            null != b && b.show(400),
                            TUI.env.login.show(700),
                            location.hash = "#login"
                    }
                })
            });
            $(this).everyTime(3E4, "loginRand", function() {
                $.ajax({
                    type: "get",
                    url: "https://hqiot.bjut.edu.cn/System/srv/login.ejs",
                    dataType: "json",
                    error: function(a) {
                        $("#loginFrame").fadeOut(3500, function() {
                            self.location = "/"
                        })
                    },
                    success: function(a) {
                        TUI.env.us = a
                    }
                })
            })
        }
    else
        $("#startingCover").remove(),
        $("#warningCover").fadeIn(500)
});
function reloadSound(b) {
    try {
        TUI.env.ua.webkit && b.load()
    } catch (a) {}
}
function playSound(b) {
    try {
        var a = document.getElementById(b + "_sound");
        4 == a.readyState && (a.currentTime = 0,
        a.play())
    } catch (e) {}
}
function Dialog(t, b) {
    b = $.extend({
        title: "\u81ea\u5b9a\u4e49\u6807\u9898",
        taskImg: "thingslabs.png",
        showTitle: !0,
        width: 640,
        height: 480,
        draggable: !0,
        showMin: !0,
        showMax: !0,
        reSize: !0,
        modal: !0,
        center: !1,
        fixed: !1,
        time: 0,
        appid: "",
        id: !1
    }, b);
    b.id = b.id ? b.id : "dialog-" + Dialog.__count;
    var k = b.id + "-overlay"
      , u = b.id + "-mask"
      , w = null
      , g = !1
      , l = !1
      , h = !1
      , m = !1
      , n = 0
      , p = 0
      , q = b.width
      , r = b.height
      , v = 500
      , x = b.showTitle ? '\x3cdiv class\x3d"bar"\x3e\x3cimg src\x3d"' + b.taskImg + '" border\x3d"0" alt\x3d"" onmousedown\x3d"return false;"\x3e\x3cspan class\x3d"title"\x3e' + b.title + '\x3c/span\x3e\x3ca class\x3d"close"\x3e\x3c/a\x3e' : "";
    b.showMax && (x += '\x3ca class\x3d"max"\x3e\x3c/a\x3e');
    b.showMin && (x += '\x3ca class\x3d"min"\x3e\x3c/a\x3e');
    var a = $('\x3cdiv id\x3d"' + b.id + '" class\x3d"dialog"\x3e' + (x + "\x3c/div\x3e") + '\x3cdiv class\x3d"main"\x3e\x3cdiv class\x3d"leftbar"\x3e\x3c/div\x3e\x3cdiv class\x3d"winSize"\x3e\x3cdiv class\x3d"sizeText"\x3e^_^\x26nbsp;\u7a97\u4f53\u8c03\u6574\u4e2d...\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"content"\x3e\x3c/div\x3e\x3cdiv class\x3d"rightbar"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"foot"\x3e\x3cdiv class\x3d"leftbuttombar"\x3e\x3c/div\x3e\x3cdiv class\x3d"buttombar"\x3e\x3c/div\x3e\x3cdiv class\x3d"rightbuttombar"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d"' + u + '"\x3e\x3c/div\x3e\x3cdiv class\x3d"barMove"\x3e\x3c/div\x3e\x3cdiv class\x3d"barMenu"\x3e\x3cdiv class\x3d"item appinfo"\x3e\x3ci class\x3d"fa fa-bookmark-o"\x3e\x3c/i\x3e\x26nbsp;\x26nbsp;\u5173\u4e8e...\x3c/div\x3e\x3chr\x3e\x3cdiv class\x3d"item shortcut"\x3e\x3ci class\x3d"fa fa-location-arrow" style\x3d"font-size: 9px;"\x3e\x3c/i\x3e\x26nbsp;\x26nbsp;\u684c\u9762\u5feb\u6377\x3c/div\x3e\x3cdiv class\x3d"item dockcut"\x3e\x3ci class\x3d"fa fa-thumb-tack"\x3e\x3c/i\x3e\x26nbsp;\x26nbsp;\u505c\u9760\u7801\u5934\x3c/div\x3e\x3chr\x3e\x3cdiv class\x3d"item max"\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;\u6700\u5927\u5316\x3c/div\x3e\x3cdiv class\x3d"item min"\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;\u6700\u5c0f\u5316\x3c/div\x3e\x3chr\x3e\x3cdiv class\x3d"item close"\x3e\x3ci class\x3d"fa fa-sign-out"\x3e\x3c/i\x3e\x26nbsp;\u9000\u51fa\x3c/div\x3e\x3cdiv class\x3d"pointer"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e');
    $("#" + t.container).append(a);
    location.hash = "#" + b.appid;
    TUI.env.us.isHashChange = !1;
    var y = function() {
        var c = $(window).width()
          , f = $(window).height()
          , e = 0;
        c < b.width ? b.width = c : e = (c - b.width) / 2;
        f - 40 < b.height ? (b.width = c - 20,
        b.height = f - 60,
        c = e = 10) : c = (f - b.height - 40) / 2;
        a.css({
            top: c,
            left: e,
            width: b.width,
            height: b.height
        });
        n = c;
        p = e;
        q = b.width;
        r = b.height
    };
    this.getZindex = function() {
        return parseInt(a.css("z-index"))
    }
    ;
    this.getTop = function() {
        return parseInt(a.css("top"))
    }
    ;
    this.getLeft = function() {
        return parseInt(a.css("left"))
    }
    ;
    this.getWidth = function() {
        return parseInt(a.css("width"))
    }
    ;
    this.getHeight = function() {
        return parseInt(a.css("height"))
    }
    ;
    this.getOpacity = function() {
        return parseInt(a.css("opacity"))
    }
    ;
    this.getShowFlag = function() {
        return l
    }
    ;
    this.setActive = function() {
        Dialog.__zindex++;
        a.css("z-index", Dialog.__zindex);
        a.css("box-shadow", "5px 5px 30px rgba(16, 153, 236,0.7)");
        a.animate({
            opacity: 1
        }, "normal");
        $("#" + u).removeClass()
    }
    ;
    this.setNormal = function(b) {
        a.css("box-shadow", "none");
        a.animate({
            opacity: 1
        }, "normal");
        $("#" + u).removeClass();
        $("#" + u).addClass("overlay")
    }
    ;
    this.setContent = function(c) {
        var f = a.find(".content");
        if ("object" == typeof c)
            switch (c.type.toLowerCase()) {
            case "id":
                a.find(".barMenu").remove();
                a.find(".winSize").remove();
                f.html($("#" + c.value).html());
                break;
            case "img":
                a.find(".barMenu").remove();
                a.find(".winSize").remove();
                f.html("\u52a0\u8f7d\u4e2d...");
                $('\x3cimg alt\x3d"" /\x3e').load(function() {
                    f.empty().append($(this));
                    y()
                }).attr("src", c.value);
                break;
            case "url":
                a.find(".barMenu").remove();
                a.find(".winSize").remove();
                f.html("\u52a0\u8f7d\u4e2d...");
                $.ajax({
                    url: c.value,
                    success: function(a) {
                        f.html(a);
                        y()
                    },
                    error: function(a, b, c) {
                        f.html("\u51fa\u9519\u5566")
                    }
                });
                break;
            case "iframe":
                f.append($('\x3ciframe marginwidth\x3d"0" marginheight\x3d"0" frameborder\x3d"0"  src\x3d"' + c.value + '" /\x3e'));
                $.ajax({
                    type: "post",
                    url: "/System/srv/openAppCount.ejs",
                    data: {
                        name: b.title,
                        url: c.value
                    },
                    dataType: "json",
                    context: this,
                    error: function(a) {},
                    success: function(a) {}
                });
                break;
            case "msgbox":
                a.find(".barMenu").remove();
                a.find(".winSize").remove();
                "input" == c.msg ? (f.html('\x3cdiv class\x3d"msgBox"\x3e\x3cdiv class\x3d"msgInput"\x3e\u8bf7\u8f93\u5165\u60a8\u7684\u4fe1\u606f\uff1a\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"msgInput" value\x3d"' + c.value + '"\x3e\x3c/div\x3e\x3cdiv class\x3d"operate"\x3e\x3ca id\x3d"okBtn" class\x3d"inputButton"\x3e\x26nbsp;\u786e\x26nbsp;\u5b9a\x26nbsp;\x3c/a\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x3ca id\x3d"cancelBtn" class\x3d"inputButton"\x3e\x26nbsp;\u53d6\x26nbsp;\u6d88\x26nbsp;\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e'),
                a.find("#okBtn").bind("click touchstart", {
                    btnType: 4
                }, this.close)) : "image" == c.msg ? (f.html('\x3cdiv class\x3d"msgBox"\x3e\x3cdiv class\x3d"msgInput"\x3e\x3cform name\x3d"form" action\x3d"" method\x3d"POST" enctype\x3d"multipart/form-data"\x3e\u8bf7\u9009\u62e9\u60a8\u7684\u56fe\u7247\uff1a\x3cbr\x3e\x3cinput id\x3d"fileToUpload" type\x3d"file" size\x3d"30" name\x3d"fileToUpload" accept\x3d"image/*"\x3e\x3c/form\x3e\x3c/div\x3e\x3cdiv class\x3d"operate"\x3e\x3ca id\x3d"okBtn" class\x3d"inputButton"\x3e\x26nbsp;\u786e\x26nbsp;\u5b9a\x26nbsp;\x3c/a\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x3ca id\x3d"cancelBtn" class\x3d"inputButton"\x3e\x26nbsp;\u53d6\x26nbsp;\u6d88\x26nbsp;\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e'),
                a.find("#okBtn").bind("click touchstart", {
                    btnType: 5
                }, this.close)) : "password" == c.msg ? (f.html('\x3cdiv class\x3d"msgBox"\x3e\x3cdiv class\x3d"msgPass"\x3e\u65e7\u7684\u5bc6\u7801\uff1a\x3cinput type\x3d"password" id\x3d"oldPass"\x3e\x3cbr\x3e\u65b0\u7684\u5bc6\u7801\uff1a\x3cinput type\x3d"password" id\x3d"newPass1"\x3e\x3cbr\x3e\u786e\u8ba4\u5bc6\u7801\uff1a\x3cinput type\x3d"password" id\x3d"newPass2"\x3e\x3c/div\x3e\x3cdiv class\x3d"operate"\x3e\x3ca id\x3d"okBtn" class\x3d"inputButton"\x3e\x26nbsp;\u786e\x26nbsp;\u5b9a\x26nbsp;\x3c/a\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x3ca id\x3d"cancelBtn" class\x3d"inputButton"\x3e\x26nbsp;\u53d6\x26nbsp;\u6d88\x26nbsp;\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e'),
                a.find("#okBtn").bind("click touchstart", {
                    btnType: 6
                }, this.close)) : (f.html('\x3cdiv class\x3d"msgBox"\x3e\x3cdiv class\x3d"msgIcon"\x3e\x3cimg src\x3d"/system/style/images/' + c.msg + '.png" width\x3d"64" height\x3d"64" border\x3d"0" alt\x3d""\x3e\x3c/div\x3e\x3cdiv class\x3d"msgText"\x3e\x26nbsp;\x26nbsp;\x26nbsp;' + c.value + '\x3c/div\x3e\x3cdiv class\x3d"operate"\x3e\x3ca id\x3d"okBtn" class\x3d"inputButton"\x3e\x26nbsp;\u786e\x26nbsp;\u5b9a\x26nbsp;\x3c/a\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x3ca id\x3d"cancelBtn" class\x3d"inputButton"\x3e\x26nbsp;\u53d6\x26nbsp;\u6d88\x26nbsp;\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e'),
                a.find("#okBtn").bind("click touchstart", {
                    btnType: 1
                }, this.close));
                a.find("#cancelBtn").bind("click touchstart", {
                    btnType: 2
                }, this.close);
                break;
            default:
                a.find(".barMenu").remove(),
                a.find(".winSize").remove(),
                f.html(c.value)
            }
        else
            f.html(c)
    }
    ;
    this.show = function() {
        if (void 0 == b.beforeShow || b.beforeShow()) {
            var c = function(a) {
                if (!TUI.env.ua.ie)
                    return $("#" + a).css("opacity");
                a = document.getElementById(a);
                return void 0 != a && void 0 != a.filters && void 0 != a.filters.alpha && void 0 != a.filters.alpha.opacity ? a.filters.alpha.opacity / 100 : 1
            };
            b.modal && $("#" + k).fadeTo(500, c(k));
            playSound("open");
            y();
            c = parseInt(a.css("left"));
            a.css({
                left: -$(window).width(),
                opacity: 0
            });
            a.animate({
                left: c,
                opacity: 1,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal", function() {
                void 0 != b.afterShow && b.afterShow();
                l = !0
            });
            0 != b.time && (w = setTimeout(this.close, b.time))
        }
    }
    ;
    this.hide = function(c) {
        if (l && (void 0 == b.beforeHide || b.beforeHide()))
            if (b.modal)
                a.find(".close").trigger(TUI.env.ua.ontouch ? "touchstart" : "mousedown");
            else
                return a.find(".barMenu").hide(),
                playSound("min"),
                h || m || (n = parseInt(a.css("top")),
                p = parseInt(a.css("left")),
                q = parseInt(a.css("width")),
                r = parseInt(a.css("height"))),
                a.animate({
                    top: -$(window).height() - 40,
                    opacity: 0,
                    avoidTransforms: !1,
                    useTranslate3d: TUI.env.ua.has3d
                }, "normal", function() {
                    a.removeClass();
                    a.addClass("dialog");
                    a.css("z-index", -1);
                    void 0 != b.afterHide && b.afterHide()
                }),
                b.modal && $("#" + k).fadeOut("normal"),
                m = h = l = !1
    }
    ;
    this.max = function() {
        h ? (a.find(".barMenu").hide(),
        playSound("rest"),
        a.find(".content iframe").hide(),
        a.removeClass(),
        a.addClass("dialog"),
        a.css("z-index", v),
        a.animate({
            top: n,
            left: p,
            width: q,
            height: r,
            avoidTransforms: !1,
            useTranslate3d: TUI.env.ua.has3d
        }, "normal", function() {
            a.find(".content iframe").fadeIn("fast")
        }),
        h = !1) : (a.find(".barMenu").hide(),
        playSound("max"),
        m || (n = parseInt(a.css("top")),
        p = parseInt(a.css("left")),
        q = parseInt(a.css("width")),
        r = parseInt(a.css("height"))),
        v = parseInt(a.css("z-index")),
        a.find(".content iframe").hide(),
        a.css("z-index", 1E6),
        a.animate({
            top: 0,
            left: 0,
            width: $(window).width(),
            height: $(window).height(),
            avoidTransforms: !1,
            useTranslate3d: TUI.env.ua.has3d
        }, "fast", function() {
            a.removeClass();
            a.addClass("dialog-max");
            a.find(".content iframe").fadeIn("fast")
        }),
        h = !0,
        m = !1);
        return !1
    }
    ;
    this.normal = function() {
        if (h || m)
            playSound("rest"),
            a.find(".content iframe").hide(),
            a.removeClass(),
            a.addClass("dialog"),
            a.css("z-index", v),
            a.animate({
                top: n,
                left: p,
                width: q,
                height: r,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal", function() {
                a.find(".content iframe").fadeIn("fast")
            }),
            m = h = !1;
        return !1
    }
    ;
    this.fullscreen = function() {
        m || (playSound("max"),
        h || (n = parseInt(a.css("top")),
        p = parseInt(a.css("left")),
        q = parseInt(a.css("width")),
        r = parseInt(a.css("height"))),
        h || (v = parseInt(a.css("z-index"))),
        a.find(".content iframe").hide(),
        a.css("z-index", 1E6),
        a.animate({
            top: 0,
            left: 0,
            width: $(window).width(),
            height: $(window).height(),
            avoidTransforms: !1,
            useTranslate3d: TUI.env.ua.has3d
        }, "fast", function() {
            a.removeClass();
            a.addClass("dialog-fullscreen");
            a.find(".content iframe").fadeIn("fast")
        }),
        h = !1,
        m = !0);
        return !1
    }
    ;
    this.rest = function() {
        var c = function(a) {
            if (!TUI.env.ua.ie)
                return $("#" + a).css("opacity");
            a = document.getElementById(a);
            return void 0 != a && void 0 != a.filters && void 0 != a.filters.alpha && void 0 != a.filters.alpha.opacity ? a.filters.alpha.opacity / 100 : 1
        };
        playSound("rest");
        b.modal && $("#" + k).fadeTo("normal", c(k));
        Dialog.__zindex++;
        a.css("z-index", Dialog.__zindex);
        a.find(".content iframe").hide();
        a.removeClass();
        a.addClass("dialog");
        a.css({
            left: p,
            opacity: 0
        });
        a.animate({
            top: n,
            width: q,
            height: r,
            opacity: 1,
            avoidTransforms: !1,
            useTranslate3d: TUI.env.ua.has3d
        }, "normal", function() {
            void 0 != b.afterShow && b.afterShow();
            l = !0;
            a.find(".content iframe").fadeIn("fast")
        });
        return !1
    }
    ;
    this.magic = function(b, f, e, g, k, h, l) {
        playSound("magic");
        a.find(".content iframe").hide();
        a.css("z-index", h);
        a.animate({
            top: b,
            left: f,
            width: e,
            height: g,
            opacity: k,
            avoidTransforms: !1,
            useTranslate3d: TUI.env.ua.has3d
        }, l, function() {
            a.find(".content iframe").fadeIn("fast")
        });
        1 == k && $("#" + u).removeClass()
    }
    ;
    this.close = function(c) {
        b.modal && (TUI.env.os[TUI.env.desktop - 1].ModalWindwos = null);
        var f = void 0 == c ? 3 : c.data.btnType;
        if (6 == f) {
            var e = $("#oldPass").prop("value");
            c = $("#newPass1").prop("value");
            var g = $("#newPass2").prop("value");
            if ("" == e) {
                toastr.warning("\u5fc5\u987b\u8f93\u5165\u539f\u5bc6\u7801\uff01\uff01", "\u4fee\u6539\u5bc6\u7801");
                return
            }
            if ("" == c) {
                toastr.warning("\u5fc5\u987b\u8f93\u5165\u65b0\u5bc6\u7801\uff01\uff01", "\u4fee\u6539\u5bc6\u7801");
                return
            }
            if (c != g) {
                toastr.warning("\u786e\u8ba4\u65b0\u5bc6\u7801\u4e0d\u76f8\u540c\uff01\uff01", "\u4fee\u6539\u5bc6\u7801");
                return
            }
            e = ["\u592a\u5f31", "\u5f31", "\u4e00\u822c", "\u8f83\u5f3a", "\u5f88\u5f3a"];
            c = TUI.Utils.checkPassWord(c);
            if (3 > c) {
                toastr.warning("\u65b0\u5bc6\u7801\u5f3a\u5ea6" + e[c] + "\uff0c\u8bf7\u4f7f\u75288\u4f4d\u53ca\u4ee5\u4e0a\u7684\u5b57\u6bcd+\u6570\u5b57+\u7279\u6b8a\u5b57\u7b26\u7ec4\u5408\uff01", "\u4fee\u6539\u5bc6\u7801");
                return
            }
        }
        if (void 0 == b.beforeClose || b.beforeClose())
            return !h && !m && 0 < b.appid.length && $.ajax({
                type: "post",
                url: "/System/srv/posDialog.ejs",
                data: {
                    appid: b.appid,
                    width: parseInt(a.css("width")),
                    height: parseInt(a.css("height")),
                    deskTop: TUI.env.desktop
                },
                dataType: "json",
                error: function(a) {},
                success: function(a) {}
            }),
            a.find(".barMenu").hide(),
            playSound("close"),
            a.find(".content iframe").hide(),
            a.animate({
                left: $(window).width(),
                opacity: 0,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, "normal", function() {
                if (void 0 != b.afterClose)
                    if (4 == f) {
                        var a = $("#msgInput").prop("value");
                        $(this).remove();
                        l = !1;
                        b.afterClose(1, a)
                    } else if (5 == f)
                        "" != $("#fileToUpload").prop("value") && $.ajaxFileUpload({
                            url: "/system/srv/uploadpic.ejs?userid\x3d" + TUI.env.us.userName,
                            secureuri: !1,
                            fileElementId: "fileToUpload",
                            context: this,
                            dataType: "xml",
                            success: function(a, d) {
                                b.afterClose(1)
                            }
                        }),
                        $(this).remove(),
                        l = !1;
                    else if (6 == f) {
                        var a = $("#oldPass").prop("value")
                          , c = $("#newPass1").prop("value");
                        $("#newPass2").prop("value");
                        $(this).remove();
                        l = !1;
                        b.afterClose(1, a, c)
                    } else
                        $(this).remove(),
                        l = !1,
                        b.afterClose(f)
            }),
            4 > f && void 0 != b.afterClose && b.afterClose(f),
            b.modal && $("#" + k).fadeOut(500, function() {
                $(this).remove()
            }),
            clearTimeout(w),
            !1
    }
    ;
    (function() {
        function c(d) {
            var b = d || window.event;
            TUI.env.ua.ontouch && "windows" != TUI.env.ua.os && (d.preventDefault(),
            b = d.originalEvent.touches[0] || d.originalEvent.changedTouches[0]);
            d = parseInt(a.css("top")) + (b.clientY - e.y);
            var c = parseInt(a.css("left")) + (b.clientX - e.x);
            0 <= d && a.css({
                top: d,
                left: c
            });
            e.x = b.clientX;
            e.y = b.clientY
        }
        function f(b) {
            b = b || window.event;
            var d = parseInt(a.css("left")) + (b.clientX - e.x)
              , c = parseInt(a.css("width")) + (e.x - b.clientX);
            0 <= d && 150 < c && a.css({
                left: d,
                width: c
            });
            e.x = b.clientX
        }
        b.modal && (Dialog.__zindex++,
        $("#" + t.container).append('\x3cdiv id\x3d"' + k + '" class\x3d"dialog-overlay"\x3e\x3c/div\x3e'),
        $("#" + k).css({
            left: 0,
            top: 0,
            width: "100%",
            height: $(document).height(),
            "z-index": Dialog.__zindex,
            position: "absolute"
        }).hide());
        Dialog.__zindex++;
        a.css({
            "z-index": Dialog.__zindex,
            position: b.fixed ? "fixed" : "absolute"
        });
        var e = {
            x: 0,
            y: 0
        };
        TUI.env.ua.ontouch && "windows" != TUI.env.ua.os ? (a.find(".barMove").bind("touchstart", function(d) {
            b.draggable && (a.find(".winSize").show(),
            a.find(".barMenu").hide(),
            a.find(".content iframe").hide(),
            g = !1,
            d.preventDefault(),
            d = d.originalEvent.touches[0] || d.originalEvent.changedTouches[0],
            e.x = d.clientX,
            e.y = d.clientY,
            $(document).bind("touchmove", c))
        }),
        $(document).bind("touchend", function(b) {
            1 == parseInt(a.css("opacity")) && (a.find(".winSize").hide(),
            a.find(".content iframe").show());
            $(document).unbind("touchmove")
        })) : (a.find(".barMove").bind("mousedown", function(d) {
            b.draggable && (a.find(".winSize").show(),
            a.find(".barMenu").hide(),
            a.find(".content iframe").hide(),
            g = !1,
            d = d || window.event,
            e.x = d.clientX,
            e.y = d.clientY,
            $(document).bind("mousemove", c))
        }),
        $(document).bind("mouseup", function(b) {
            1 == parseInt(a.css("opacity")) && (a.find(".winSize").hide(),
            a.find(".content iframe").show());
            $(document).unbind("mousemove")
        }));
        if (b.reSize && "windows" == TUI.env.ua.os) {
            var h = function(b) {
                b = b || window.event;
                var d = parseInt(a.css("width")) + (b.clientX - e.x);
                150 < d && a.css({
                    width: d
                });
                e.x = b.clientX;
                d = parseInt(a.css("height")) + (b.clientY - e.y);
                100 < d && a.css({
                    height: d
                });
                e.y = b.clientY
            }
              , l = function(b) {
                b = b || window.event;
                var d = parseInt(a.css("left")) + (b.clientX - e.x)
                  , c = parseInt(a.css("width")) + (e.x - b.clientX);
                0 <= d && 150 < c && a.css({
                    left: d,
                    width: c
                });
                e.x = b.clientX;
                d = parseInt(a.css("height")) + (b.clientY - e.y);
                100 < d && a.css({
                    height: d
                });
                e.y = b.clientY
            }
              , m = function(b) {
                b = b || window.event;
                var d = parseInt(a.css("height")) + (b.clientY - e.y);
                100 < d && a.css({
                    height: d
                });
                e.y = b.clientY
            }
              , n = function(b) {
                b = b || window.event;
                var d = parseInt(a.css("width")) + (b.clientX - e.x);
                150 < d && a.css({
                    width: d
                });
                e.x = b.clientX
            };
            a.find(".leftbar").bind("mousedown", function(d) {
                b.draggable && (a.find(".winSize").show(),
                a.find(".barMenu").hide(),
                a.find(".content iframe").hide(),
                g = !1,
                e.x = (d || window.event).clientX,
                $(document).bind("mousemove", f))
            });
            a.find(".rightbar").bind("mousedown", function(d) {
                b.draggable && (a.find(".winSize").show(),
                a.find(".barMenu").hide(),
                a.find(".content iframe").hide(),
                g = !1,
                e.x = (d || window.event).clientX,
                $(document).bind("mousemove", n))
            });
            a.find(".buttombar").bind("mousedown", function(d) {
                b.draggable && (a.find(".winSize").show(),
                a.find(".barMenu").hide(),
                a.find(".content iframe").hide(),
                g = !1,
                e.y = (d || window.event).clientY,
                $(document).bind("mousemove", m))
            });
            a.find(".leftbuttombar").bind("mousedown", function(d) {
                b.draggable && (a.find(".winSize").show(),
                a.find(".barMenu").hide(),
                a.find(".content iframe").hide(),
                g = !1,
                d = d || window.event,
                e.x = d.clientX,
                e.y = d.clientY,
                $(document).bind("mousemove", l))
            });
            a.find(".rightbuttombar").bind("mousedown", function(d) {
                b.draggable && (a.find(".winSize").show(),
                a.find(".barMenu").hide(),
                a.find(".content iframe").hide(),
                g = !1,
                d = d || window.event,
                e.x = d.clientX,
                e.y = d.clientY,
                $(document).bind("mousemove", h))
            })
        }
        a.find(".min").bind(TUI.env.ua.clickEventDown, this.hide);
        a.find(".max").bind(TUI.env.ua.clickEventDown, this.max);
        a.find(".close").bind(TUI.env.ua.clickEventDown, {
            btnType: 0
        }, this.close);
        a.find(".barMenu .appinfo").bind(TUI.env.ua.clickEventDown, {
            options: b
        }, function(d) {
            for (var c = 0; c < TUI.env.cfg.system.installApp.length; c++)
                if (TUI.env.cfg.system.installApp[c].appid == d.data.options.appid) {
                    c = '\x3cdiv class\x3d"about"\x3e\x3cimg src\x3d"' + d.data.options.taskImg + '" onmousedown\x3d"return false;"/\x3e\x3cdiv class\x3d"name"\x3e' + TUI.env.cfg.system.installApp[c].name + '\x3c/div\x3e\x3cdiv class\x3d"version"\x3e\u7248\u672c\x26nbsp;' + TUI.env.cfg.system.installApp[c].version + '\x3c/div\x3e\x3cdiv class\x3d"resource"\x3e\x3chr\x3e' + TUI.env.cfg.system.installApp[c].description + '\x3chr\x3e\x3c/div\x3e\x3cdiv class\x3d"copy"\x3e\x26copy;' + (new Date).Format("yyyy") + "\x26nbsp;" + TUI.env.cfg.system.installApp[c].author + ".\x3c/div\x3e\x3c/div\x3e";
                    TUI.env.os[TUI.env.desktop - 1].ModalWindwos = new Dialog({
                        container: b.handle.container,
                        type: "html",
                        msg: "query",
                        value: c
                    },{
                        title: d.data.options.title,
                        taskImg: d.data.options.taskImg,
                        width: 300,
                        height: 350,
                        reSize: !1,
                        showMin: !1,
                        showMax: !1,
                        center: !0,
                        modal: !0
                    });
                    TUI.env.os[TUI.env.desktop - 1].ModalWindwos.show();
                    break
                }
            a.find(".barMenu").hide();
            g = !1
        });
        a.find(".barMenu .shortcut").bind(TUI.env.ua.clickEventDown, {
            options: b
        }, function(b) {
            b.data.options.handle.setAppShortcut(b.data.options.appid, b.data.options.urlPath, b.data.options.title, b.data.options.taskImg);
            a.find(".barMenu").hide();
            g = !1
        });
        a.find(".barMenu .dockcut").bind(TUI.env.ua.clickEventDown, {
            options: b
        }, function(b) {
            b.data.options.handle.setAppDock(b.data.options.appid, b.data.options.urlPath, b.data.options.title, b.data.options.taskImg);
            a.find(".barMenu").hide();
            g = !1
        });
        a.find(".bar img").bind(TUI.env.ua.clickEventDown, function() {
            g ? (a.find(".barMenu").hide(),
            g = !1) : (a.find(".barMenu").show(),
            g = !0,
            $(this).oneTime(1E4, function() {
                a.find(".barMenu").hide();
                g = !1
            }))
        });
        a.bind(TUI.env.ua.clickEventUp, function() {
            a.css("opacity", 1);
            parseInt(a.css("z-index")) < Dialog.__zindex && (Dialog.__zindex++,
            a.css("z-index", Dialog.__zindex),
            void 0 != b.afterSwitch && b.afterSwitch())
        });
        0 != b.time && (w = setTimeout(this.close, b.time))
    }
    ).call(this);
    this.setContent(t);
    Dialog.__count++
}
Dialog.__zindex = 500;
Dialog.__count = 1;
Dialog.__top = 0;
Dialog.__left = 0;
Dialog.version = "1.0 beta";
function dialog(t, b) {
    var k = new Dialog(t,b);
    k.show();
    return k
}