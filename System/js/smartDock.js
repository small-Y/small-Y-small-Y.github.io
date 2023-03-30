SmartDock = function(r, p) {
    var t = 0, m = 0, f = 0, e = 0, b = 0, g = 0, h = 0, n, k, q = 0;
    return {
        init: function() {
            this.container = r;
            var a = p ? p : {};
            this.minWidth = a.minWidth ? a.minWidth : 320;
            this.appCount = 0;
            $("#" + this.container).html('\x3cdiv class\x3d"apps"\x3e\x3cdiv class\x3d"l"\x3e\x3c/div\x3e\x3cul\x3e\x3c/ul\x3e \x3cdiv class\x3d"r"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"dragapp"\x3e\x3c/div\x3e');
            $("#" + this.container + " .apps").css("min-width", this.minWidth + "px");
            "" != TUI.env.us.appUrl && $("#" + this.container + " .apps").css("margin-left", "15%")
        },
        show: function() {
            $("#" + this.container).slideDown(600)
        },
        hide: function() {
            $("#" + this.container).slideUp(300)
        },
        addApp: function(a, l, d, u, p, r) {
            "0CB4D644-896A-4ADA-9D5F-58448BD04499" == d ? l = "/System/images/plus.png" : "0CB4D644-896A-4ADA-9D5F-58448BD04499" == d && (l = "/Webapp/Calendar/Resources/Images/" + (new Date).Format("MMdd") + ".png");
            $("#" + this.container + " ul").append('\t\t\x3cli class\x3d"app" id\x3d"' + this.container + "_" + d + '"\x3e \t\t\t\x3cdiv class\x3d"icon"\x3e \t\t\t\t\x3cdiv class\x3d"label"\x3e \t\t\t\t\t\x3cem\x3e' + a + '\x3c/em\x3e \t\t\t\t\t\x3cspan class\x3d"pointer"\x3e\x3c/span\x3e \t\t\t\t\x3c/div\x3e \t\t\t    \x3cdiv class\x3d"number" id\x3d"' + this.container + "_" + d + '_Num"\x3e\x3c/div\x3e\t\t\t\t\t\t\x3cimg src\x3d"' + l + '"  onmousedown\x3d"return false;" alt\x3d"' + a + '" /\x3e \t\t\t\x3c/div\x3e \t\t\t\x3cdiv class\x3d"indicator"\x3e\x3c/div\x3e\t\t\t\t\t\x3cdiv class\x3d"reflection"\x3e \t\t\t\t\x3cimg src\x3d"' + l + '" /\x3e \t\t\t\x3c/div\x3e\t\t\x3c/li\x3e ');
            $("#" + this.container + "_" + d).bind("windows" == TUI.env.ua.os ? "mouseup" : TUI.env.ua.clickEventUp, {
                handle: p,
                appName: a,
                appImg: l,
                appID: d,
                appLaunch: u,
                fn: r
            }, function(c) {
                0 == g && (localStorage[c.data.shortcutID + "-count"] = $(this).find(".number").html(),
                $(this).find(".number").hide(),
                c.data.fn(c));
                g = 0;
                $(document).unbind("windows" == TUI.env.ua.os ? "mousemove" : TUI.env.ua.clickEventMove);
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
            this.appCount++;
            4 <= this.appCount && $("#" + this.container + " .apps").css("width", 80 * this.appCount + 50 + "px");
            $("#" + this.container + "_" + d).animate({
                opacity: 1
            }, "slow");
            $("#" + this.container + "_" + d).bind("windows" == TUI.env.ua.os ? "mousedown" : TUI.env.ua.clickEventDown, {
                appID: d,
                appImg: l,
                parent: this
            }, function(c) {
                "0CB4D644-896A-4ADA-9D5F-58448BD04499" == c.data.appID ? c.data.appImg = "/System/images/plus.png" : "0CB4D644-896A-4ADA-9D5F-58448BD04499" == c.data.appID && (c.data.appImg = "/Webapp/Calendar/Resources/Images/" + (new Date).Format("MMdd") + ".png");
                var a = c || window.event;
                TUI.env.ua.ontouch && "windows" != TUI.env.ua.os && (c.preventDefault(),
                a = c.originalEvent.touches[0] || c.originalEvent.changedTouches[0]);
                b = $("#" + c.data.parent.container + " .dragapp");
                b.empty();
                b.append('\x3cdiv class\x3d"close"\x3e\x3c/div\x3e\x3cimg src\x3d"' + c.data.appImg + '" /\x3e ');
                b.css({
                    top: this.offsetParent.offsetTop + this.offsetTop,
                    left: this.offsetParent.offsetLeft + this.offsetLeft
                });
                b.find(".close").hide();
                e = this;
                t = a.clientY - (this.offsetParent.offsetTop + this.offsetTop);
                m = a.clientX - (this.offsetParent.offsetLeft + this.offsetLeft);
                f = this.offsetParent.offsetLeft + this.offsetLeft;
                g = 0;
                n = c.data.appID;
                k = "";
                $(document).bind("windows" == TUI.env.ua.os ? "mousemove" : TUI.env.ua.clickEventMove, {
                    parent: c.data.parent
                }, function(a) {
                    if (b) {
                        var c = new Date
                          , d = a || window.event;
                        TUI.env.ua.ontouch && "windows" != TUI.env.ua.os && (a.preventDefault(),
                        d = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
                        f != d.clientX - m && (h = f < d.clientX - m ? 0 : 1,
                        b.css({
                            top: d.clientY - t,
                            left: d.clientX - m
                        }),
                        b.show(),
                        $(e).css({
                            opacity: 0
                        }),
                        -70 > d.clientY - t ? ($(e).hide(),
                        b.find(".close").show()) : ($(e).show(),
                        b.find(".close").hide(),
                        g = c.getTime() / 1E3,
                        f = d.clientX - m,
                        $("#" + a.data.parent.container + " .apps").find("li").each(function() {
                            if (this.id != a.data.parent.container + "_" + n && (h != q || this.id != k)) {
                                var c = this.offsetParent.offsetLeft + this.offsetLeft;
                                if (0 == h && f + 50 > c && f < c)
                                    return k = this.id,
                                    q = h,
                                    $(e).insertAfter($(this)),
                                    !1;
                                if (1 == h && f - 50 < c && f > c)
                                    return k = this.id,
                                    q = h,
                                    $(e).insertBefore($(this)),
                                    !1
                            }
                        })))
                    }
                })
            });
            $(document).bind("windows" == TUI.env.ua.os ? "mouseup" : TUI.env.ua.clickEventUp, {
                parent: this
            }, function(a) {
                b && 0 < g && ($(e).is(":hidden") ? (a.data.parent.delApp(n),
                b.fadeOut("normal"),
                b = 0,
                $.ajax({
                    type: "post",
                    url: "https://hqiot.bjut.edu.cn/System/srv/deldock.ejs",
                    data: {
                        appId: n,
                        deskTop: TUI.env.desktop
                    },
                    dataType: "json",
                    error: function(a) {},
                    success: function(a) {
                        TUI.env.cfg = a
                    }
                })) : (b.animate({
                    top: e.offsetParent.offsetTop + e.offsetTop,
                    left: e.offsetParent.offsetLeft + e.offsetLeft
                }, "normal", function(a) {
                    $(e).css({
                        opacity: 1
                    });
                    b.hide();
                    b = 0
                }),
                a = k.lastIndexOf("_"),
                0 < a && $.ajax({
                    type: "post",
                    url: "https://hqiot.bjut.edu.cn/System/srv/mdydock.ejs",
                    data: {
                        appId: n,
                        proID: k.substr(a + 1),
                        appDirect: q,
                        deskTop: TUI.env.desktop
                    },
                    dataType: "json",
                    error: function(a) {},
                    success: function(a) {
                        TUI.env.cfg = a
                    }
                })),
                g = 0);
                $(document).unbind("windows" == TUI.env.ua.os ? "mousemove" : TUI.env.ua.clickEventMove)
            })
        },
        delApp: function(a) {
            $("#" + this.container + "_" + a).remove();
            this.appCount--;
            4 <= this.appCount ? $("#" + this.container + " .apps").css("width", 80 * this.appCount + 50 + "px") : $("#" + this.container + " .apps").css("width", this.minWidth + "px")
        },
        clearApp: function() {
            $("#" + this.container + " ul").empty();
            this.appCount = 0;
            $("#" + this.container + " .apps").css("width", this.minWidth + "px")
        },
        setMsgCount: function(a, b) {
            $("#" + this.container + "_" + a + "_Num").unbind(TUI.env.ua.clickEventDown);
            0 < b.length ? ($("#" + this.container + "_" + a + "_Num").show(),
            $("#" + this.container + "_" + a + "_Num").html(b.length),
            $("#" + this.container + "_" + a + "_Num").bind(TUI.env.ua.clickEventDown, {
                msgList: b
            }, function(a) {
                for (var b = 0; b < a.data.msgList.length; b++)
                    toastr.info(a.data.msgList[b].content, a.data.msgList[b].title);
                return !1
            })) : ($("#" + this.container + "_" + a + "_Num").html(0),
            $("#" + this.container + "_" + a + "_Num").hide())
        },
        setMsgActive: function(a) {
            $("#" + this.container + "_" + a).addClass("active");
            $(this).oneTime(5E3, function() {
                $("#" + this.container + "_" + a).removeClass("active")
            })
        }
    }
}
;