SmartShortcut = function(g, v) {
    var h = 0, k = 0, l = 0, m = 0, c = 0, f = 0, e = 0, n;
    return {
        init: function() {
            this.container = g;
            this.shortcutCount = 0;
            $(".homepanel").bind(TUI.env.ua.clickEventDown, function(b) {
                $(".homepanel .shortcut .close").hide()
            })
        },
        show: function() {
            0 == parseInt($("#" + this.container).css("left")) ? $("#" + this.container).fadeIn(600) : ($("#" + this.container).css({
                left: -$(window).width()
            }),
            $("#" + this.container).animate({
                left: 0,
                opacity: 1
            }, "slow"))
        },
        hide: function() {
            $("#" + this.container).animate({
                left: $(window).width(),
                opacity: 0
            }, "normal")
        },
        addShortcut: function(b, p, d, a, g, q, r, t, u) {
            "0CB4D644-896A-4ADA-9D5F-58448BD04499" == a ? d = "https://hqiot.bjut.edu.cn/System/srv/userpic.ejs?userid\x3d" + TUI.env.us.userName : "0CB4D644-896A-4ADA-9D5F-58448BD04499" == a && (d = "/Webapp/Calendar/Resources/Images/" + (new Date).Format("MMdd") + ".png");
            $("#" + this.container).append('\x3cdiv id\x3d"' + this.container + "_" + a + '" class\x3d"shortcut"\x3e\x3cdiv class\x3d"content"\x3e\x3cdiv class\x3d"number"\x3e\x3c/div\x3e\x3cdiv class\x3d"close"\x3e\x3c/div\x3e\x3cimg src\x3d"' + d + '" border\x3d"0" alt\x3d"" onmousedown\x3d"return false;"\x3e\x3cdiv class\x3d"name" translate\x3d"no"\x3e' + p + "\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e");
            $("#" + this.container + "_" + a).css({
                top: r,
                left: t,
                opacity: 0
            });
            $(this).oneTime(300, function() {
                $("#" + this.container + "_" + a).animate({
                    opacity: 1
                }, "slow")
            });
            this.shortcutCount++;
            $("#" + this.container + "_" + a).find(".content").bind("windows" == TUI.env.ua.os ? "mouseup" : TUI.env.ua.clickEventUp, {
                handle: this,
                appName: b,
                shortcutName: p,
                shortcutImg: d,
                shortcutID: a,
                shortcutLaunch: g,
                handle: q,
                fn: u
            }, function(a) {
                0 == f && (0 < e && 1 < (new Date).getTime() / 1E3 - e ? $(".homepanel .shortcut .close").show() : (localStorage[a.data.shortcutID + "-count"] = $(this).find(".number").html(),
                $(this).find(".number").hide(),
                a.data.fn(a)));
                $(".HomeButton").removeClass("active");
                $(".ApplyButton").removeClass("active");
                $(".ThemeButton").removeClass("active");
                $(".StartMenu").hide();
                $(".AppMenu").hide();
                $(".ThemeMenu").hide();
                $(".TaskStatus .ClockList").hide();
                $(".TaskStatus .WeatherList").hide();
                $(".TaskStatus .UserMenu").hide();
                $(".messagepanel").css({
                    right: -280
                });
                $(".messagepanel").hide()
            });
            $("#" + this.container + "_" + a).find(".close").bind("windows" == TUI.env.ua.os ? "mousedown" : TUI.env.ua.clickEventDown, {
                shortcutID: a,
                handle: $("#" + this.container + "_" + a)
            }, function(a) {
                $.ajax({
                    type: "post",
                    url: "https://hqiot.bjut.edu.cn/System/srv/delshortcut.ejs",
                    data: {
                        appId: a.data.shortcutID,
                        deskTop: TUI.env.desktop
                    },
                    dataType: "json",
                    error: function(a) {},
                    success: function(b) {
                        TUI.env.cfg = b;
                        a.data.handle.remove();
                        playSound("info")
                    }
                });
                return !1
            });
            $("#" + this.container + "_" + a).bind("windows" == TUI.env.ua.os ? "mousedown" : TUI.env.ua.clickEventDown, {
                shortcutID: a
            }, function(a) {
                var b = a || window.event;
                TUI.env.ua.ontouch && "windows" != TUI.env.ua.os && (a.preventDefault(),
                b = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
                c = $(this);
                h = b.clientY - this.offsetTop;
                k = b.clientX - this.offsetLeft;
                l = b.clientY;
                m = b.clientX;
                f = 0;
                n = a.data.shortcutID;
                e = (new Date).getTime() / 1E3;
                $(this).oneTime(1500, function() {
                    0 == f && 0 < e && 1 < (new Date).getTime() / 1E3 - e && $(".homepanel .shortcut .close").show()
                });
                $(document).bind("windows" == TUI.env.ua.os ? "mousemove" : TUI.env.ua.clickEventMove, function(a) {
                    if (c) {
                        var b = new Date
                          , d = a || window.event;
                        TUI.env.ua.ontouch && "windows" != TUI.env.ua.os && (a.preventDefault(),
                        d = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
                        if (10 < Math.abs(d.clientY - l) || 10 < Math.abs(d.clientX - m))
                            f = b.getTime() / 1E3;
                        0 < d.clientY - h ? c.css({
                            top: d.clientY - h,
                            left: d.clientX - k,
                            opacity: .7
                        }) : c.css({
                            top: 0,
                            left: d.clientX - k,
                            opacity: .7
                        })
                    }
                });
                return !1
            });
            $(document).bind("windows" == TUI.env.ua.os ? "mouseup" : TUI.env.ua.clickEventUp, function(a) {
                var b = a = 0;
                0 != c && (a = parseInt(c.css("top")),
                b = parseInt(c.css("left")),
                c.css({
                    opacity: 1
                }),
                c = 0,
                0 < f && $.ajax({
                    type: "post",
                    url: "https://hqiot.bjut.edu.cn/System/srv/mdyshortcut.ejs",
                    data: {
                        appId: n,
                        top: a,
                        left: b,
                        deskTop: TUI.env.desktop
                    },
                    dataType: "json",
                    error: function(a) {},
                    success: function(a) {
                        TUI.env.cfg = a
                    }
                }));
                e = 0;
                $(document).unbind("windows" == TUI.env.ua.os ? "mousemove" : TUI.env.ua.clickEventMove)
            })
        },
        delShortcut: function(b) {
            $("#" + this.container + "_" + b).remove()
        },
        setMsgCount: function(b, c) {
            $("#" + this.container + "_" + b).find(".number").unbind(TUI.env.ua.clickEventDown);
            0 < c.length ? ($("#" + this.container + "_" + b).find(".number").show(),
            $("#" + this.container + "_" + b).find(".number").html(c.length),
            $("#" + this.container + "_" + b).find(".number").bind(TUI.env.ua.clickEventDown, {
                msgList: c
            }, function(b) {
                for (var a = 0; a < b.data.msgList.length; a++)
                    toastr.info(b.data.msgList[a].content, b.data.msgList[a].title);
                return !1
            })) : ($("#" + this.container + "_" + b).find(".number").html(0),
            $("#" + this.container + "_" + b).find(".number").hide())
        }
    }
}
;