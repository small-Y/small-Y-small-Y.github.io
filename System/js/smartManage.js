SmartManage = function(h, g) {
    return {
        init: function() {
            this.container = h;
            this.magicTimeSpan = 0;
            this.ModalWindwos = null;
            this.WindowHandle = [];
            this.WidgetHandle = [];
            var b = g ? g : {};
            this.desktopFrame = new SmartDeskTop(this.container,b);
            this.desktopFrame.init();
            "" == TUI.env.us.appUrl ? $("#" + this.desktopFrame.getPanel()).html('\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Task" class\x3d"taskbar"\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Home" class\x3d"homepanel"\x3e\t\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Dock" class\x3d"dock"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Widget" class\x3d"homepanel"\x3e\t\x3cdiv class\x3d"timeevent"\x3e\x3c/div\x3e\t\x3cdiv class\x3d"timeline"\x3e\t\t\x3cdiv class\x3d"linebar1"\x3e\t\t\t\x3clable class\x3d"startdate"\x3e\u5f53\u524d\x3c/lable\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"currbar"\x3e\t\t\t\x3clable class\x3d"currdate"\x3e\x3c/lable\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"linebar2"\x3e\t\t\t\x3clable class\x3d"enddate"\x3e\x3c/lable\x3e\t\t\x3c/div\x3e\t\x3c/div\x3e\x3c/div\x3e') : $("#" + this.desktopFrame.getPanel()).html('\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Task" class\x3d"taskbar"\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Home" class\x3d"homepanel"\x3e\t\x3ciframe id\x3d"' + this.desktopFrame.getPanel() + '_Insight" width\x3d"100%" height\x3d"100%" frameborder\x3d"0" src\x3d"' + TUI.env.us.appUrl + '"\x3e\x3c/iframe\x3e\t\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Dock" class\x3d"dock" style\x3d"width:80%"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d"' + this.desktopFrame.getPanel() + '_Widget" class\x3d"homepanel"\x3e\t\x3cdiv class\x3d"timeevent"\x3e\x3c/div\x3e\t\x3cdiv class\x3d"timeline"\x3e\t\t\x3cdiv class\x3d"linebar1"\x3e\t\t\t\x3clable class\x3d"startdate"\x3e\u5f53\u524d\x3c/lable\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"currbar"\x3e\t\t\t\x3clable class\x3d"currdate"\x3e\x3c/lable\x3e\t\t\x3c/div\x3e\t\t\x3cdiv class\x3d"linebar2"\x3e\t\t\t\x3clable class\x3d"enddate"\x3e\x3c/lable\x3e\t\t\x3c/div\x3e\t\x3c/div\x3e\x3c/div\x3e');
            TUI.env.us.isHashChange = !0;
            window.onhashchange = function() {
                if (TUI.env.us.isHashChange) {
                    if ("" != location.hash && void 0 != location.hash) {
                        var a = location.hash.substr(1);
                        if ("login" == a)
                            $.ajax({
                                type: "get",
                                url: "https://hqiot.bjut.edu.cn/System/srv/logout.ejs",
                                error: function(a) {
                                    playSound("error");
                                    toastr[error]("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u6ce8\u9500\u8d26\u6237")
                                },
                                success: function(a) {
                                    top.location.href = "/"
                                }
                            });
                        else if ("desktop" == a)
                            TUI.env.os[0].hideAllHandle();
                        else if ("start" == a)
                            $("#" + TUI.env.os[0].desktopFrame.getPanel() + "_Task").find(".HomeButton").trigger(TUI.env.ua.clickEventDown),
                            TUI.env.us.isHashChange = !0;
                        else if ("app" == a)
                            $("#" + TUI.env.os[0].desktopFrame.getPanel() + "_Task").find(".ApplyButton").trigger(TUI.env.ua.clickEventDown),
                            TUI.env.us.isHashChange = !0;
                        else if ("theme" == a)
                            $("#" + TUI.env.os[0].desktopFrame.getPanel() + "_Task").find(".ThemeButton").trigger(TUI.env.ua.clickEventDown),
                            TUI.env.us.isHashChange = !0;
                        else if (TUI.env.os[0].checkHandle(a))
                            TUI.env.os[0].activeHandle(a);
                        else
                            for (var b = 0; b < TUI.env.cfg.system.installApp.length; b++)
                                if (TUI.env.cfg.system.installApp[b].appid == a) {
                                    a = new Dialog({
                                        container: TUI.env.os[0].container,
                                        type: "iframe",
                                        value: TUI.env.cfg.system.installApp[b].app.launch.local_path
                                    },{
                                        title: TUI.env.cfg.system.installApp[b].name,
                                        taskImg: TUI.env.cfg.system.installApp[b].urlPath + "/" + TUI.env.cfg.system.installApp[b].icons.logo,
                                        handle: TUI.env.os[TUI.env.desktop - 1],
                                        appid: TUI.env.cfg.system.installApp[b].appid,
                                        urlPath: TUI.env.cfg.system.installApp[b].urlPath,
                                        afterShow: function() {},
                                        afterHide: function() {
                                            this.handle.hideHandle(TUI.env.cfg.system.installApp[b].appid)
                                        },
                                        afterClose: function() {
                                            this.handle.delHandle(TUI.env.cfg.system.installApp[b].appid)
                                        },
                                        afterSwitch: function() {
                                            this.handle.switchHandle(TUI.env.cfg.system.installApp[b].appid)
                                        },
                                        modal: !1,
                                        center: !0,
                                        width: TUI.env.cfg.system.installApp[b].app.launch.width,
                                        height: TUI.env.cfg.system.installApp[b].app.launch.height
                                    });
                                    a.show();
                                    TUI.env.os[TUI.env.desktop - 1].addHandle(a, TUI.env.cfg.system.installApp[b].name, TUI.env.cfg.system.installApp[b].urlPath + "/" + TUI.env.cfg.system.installApp[b].icons.logo, TUI.env.cfg.system.installApp[b].appid);
                                    break
                                }
                    }
                } else
                    TUI.env.us.isHashChange = !0
            }
            ;
            this.desktopTask = new SmartTask(this.desktopFrame.getPanel() + "_Task",{
                handle: this,
                fn: function(a) {
                    a.data.handle.hideAllHandle()
                }
            });
            this.desktopTask.init();
            this.desktopDock = new SmartDock(this.desktopFrame.getPanel() + "_Dock");
            this.desktopDock.init();
            for (i = 0; i < TUI.env.cfg.desktop[b.id - 1].dockList.length; i++)
                0 <= TUI.env.cfg.desktop[b.id - 1].dockList[i].appid.indexOf("Pad-") ? this.desktopDock.addApp(TUI.env.cfg.desktop[b.id - 1].dockList[i].name, TUI.env.cfg.desktop[b.id - 1].dockList[i].logoPath, TUI.env.cfg.desktop[b.id - 1].dockList[i].appid, TUI.env.cfg.desktop[b.id - 1].dockList[i].urlPath, this, function(a) {
                    if (a.data.handle.checkHandle(a.data.appID))
                        a.data.handle.activeHandle(a.data.appID);
                    else
                        for (a.data.handle.desktopDock.setMsgActive(a.data.appID),
                        j = 0; j < TUI.env.cfg.desktop[b.id - 1].dockList.length; j++)
                            if (TUI.env.cfg.desktop[b.id - 1].dockList[j].appid == a.data.appID) {
                                var c = new Dialog({
                                    container: a.data.handle.container,
                                    type: "iframe",
                                    value: a.data.appLaunch
                                },{
                                    title: a.data.appName + "\u2014\u2014\u5de5\u4f5c\u53f0",
                                    taskImg: a.data.appImg,
                                    handle: a.data.handle,
                                    appid: a.data.appID,
                                    urlPath: TUI.env.cfg.desktop[b.id - 1].dockList[j].urlPath,
                                    afterShow: function() {},
                                    afterHide: function() {
                                        this.handle.hideHandle(a.data.appID)
                                    },
                                    afterClose: function() {
                                        this.handle.delHandle(a.data.appID)
                                    },
                                    afterSwitch: function() {
                                        this.handle.switchHandle(a.data.appID)
                                    },
                                    modal: !1,
                                    center: !0,
                                    width: 1024,
                                    height: 720
                                });
                                c.show();
                                a.data.handle.addHandle(c, a.data.appName, a.data.appImg, a.data.appID);
                                break
                            }
                }) : this.desktopDock.addApp(TUI.env.cfg.desktop[b.id - 1].dockList[i].name, TUI.env.cfg.desktop[b.id - 1].dockList[i].urlPath + "/" + TUI.env.cfg.desktop[b.id - 1].dockList[i].icons.logo, TUI.env.cfg.desktop[b.id - 1].dockList[i].appid, TUI.env.cfg.desktop[b.id - 1].dockList[i].app.launch.local_path, this, function(a) {
                    if (a.data.handle.checkHandle(a.data.appID))
                        a.data.handle.activeHandle(a.data.appID);
                    else
                        for (a.data.handle.desktopDock.setMsgActive(a.data.appID),
                        j = 0; j < TUI.env.cfg.desktop[b.id - 1].dockList.length; j++)
                            if (TUI.env.cfg.desktop[b.id - 1].dockList[j].appid == a.data.appID) {
                                var c = new Dialog({
                                    container: a.data.handle.container,
                                    type: "iframe",
                                    value: a.data.appLaunch
                                },{
                                    title: a.data.appName,
                                    taskImg: a.data.appImg,
                                    handle: a.data.handle,
                                    appid: a.data.appID,
                                    urlPath: TUI.env.cfg.desktop[b.id - 1].dockList[j].urlPath,
                                    afterShow: function() {},
                                    afterHide: function() {
                                        this.handle.hideHandle(a.data.appID)
                                    },
                                    afterClose: function() {
                                        this.handle.delHandle(a.data.appID)
                                    },
                                    afterSwitch: function() {
                                        this.handle.switchHandle(a.data.appID)
                                    },
                                    modal: !1,
                                    center: !0,
                                    width: TUI.env.cfg.desktop[b.id - 1].dockList[j].app.launch.width,
                                    height: TUI.env.cfg.desktop[b.id - 1].dockList[j].app.launch.height
                                });
                                c.show();
                                a.data.handle.addHandle(c, a.data.appName, a.data.appImg, a.data.appID);
                                break
                            }
                });
            this.desktopShortcut = new SmartShortcut(this.desktopFrame.getPanel() + "_Home");
            this.desktopShortcut.init();
            for (i = 0; i < TUI.env.cfg.desktop[b.id - 1].appList.length; i++)
                0 <= TUI.env.cfg.desktop[b.id - 1].appList[i].appid.indexOf("Pad-") ? this.desktopShortcut.addShortcut(TUI.env.cfg.desktop[b.id - 1].appList[i].name, TUI.env.cfg.desktop[b.id - 1].appList[i].name, TUI.env.cfg.desktop[b.id - 1].appList[i].logoPath, TUI.env.cfg.desktop[b.id - 1].appList[i].appid, TUI.env.cfg.desktop[b.id - 1].appList[i].urlPath, this, TUI.env.cfg.desktop[b.id - 1].appList[i].top, TUI.env.cfg.desktop[b.id - 1].appList[i].left, function(a) {
                    if (a.data.handle.checkHandle(a.data.shortcutID))
                        a.data.handle.activeHandle(a.data.shortcutID);
                    else
                        for (j = 0; j < TUI.env.cfg.desktop[b.id - 1].appList.length; j++)
                            if (TUI.env.cfg.desktop[b.id - 1].appList[j].appid == a.data.shortcutID) {
                                var c = new Dialog({
                                    container: a.data.handle.container,
                                    type: "iframe",
                                    value: a.data.shortcutLaunch
                                },{
                                    title: a.data.appName + "\u2014\u2014\u5de5\u4f5c\u53f0",
                                    taskImg: a.data.shortcutImg,
                                    handle: a.data.handle,
                                    appid: a.data.shortcutID,
                                    urlPath: TUI.env.cfg.desktop[b.id - 1].appList[j].urlPath,
                                    afterShow: function() {},
                                    afterHide: function() {
                                        this.handle.hideHandle(a.data.shortcutID)
                                    },
                                    afterClose: function() {
                                        this.handle.delHandle(a.data.shortcutID)
                                    },
                                    afterSwitch: function() {
                                        this.handle.switchHandle(a.data.shortcutID)
                                    },
                                    modal: !1,
                                    center: !0,
                                    width: 1024,
                                    height: 720
                                });
                                c.show();
                                a.data.handle.addHandle(c, a.data.shortcutName, a.data.shortcutImg, a.data.shortcutID);
                                break
                            }
                }) : this.desktopShortcut.addShortcut(TUI.env.cfg.desktop[b.id - 1].appList[i].name, TUI.env.cfg.desktop[b.id - 1].appList[i]["short"], TUI.env.cfg.desktop[b.id - 1].appList[i].urlPath + "/" + TUI.env.cfg.desktop[b.id - 1].appList[i].icons.logo, TUI.env.cfg.desktop[b.id - 1].appList[i].appid, TUI.env.cfg.desktop[b.id - 1].appList[i].app.launch.local_path, this, TUI.env.cfg.desktop[b.id - 1].appList[i].top, TUI.env.cfg.desktop[b.id - 1].appList[i].left, function(a) {
                    if (a.data.handle.checkHandle(a.data.shortcutID))
                        a.data.handle.activeHandle(a.data.shortcutID);
                    else
                        for (j = 0; j < TUI.env.cfg.desktop[b.id - 1].appList.length; j++)
                            if (TUI.env.cfg.desktop[b.id - 1].appList[j].appid == a.data.shortcutID) {
                                var c = new Dialog({
                                    container: a.data.handle.container,
                                    type: "iframe",
                                    value: a.data.shortcutLaunch
                                },{
                                    title: a.data.appName,
                                    taskImg: a.data.shortcutImg,
                                    handle: a.data.handle,
                                    appid: a.data.shortcutID,
                                    urlPath: TUI.env.cfg.desktop[b.id - 1].appList[j].urlPath,
                                    afterShow: function() {},
                                    afterHide: function() {
                                        this.handle.hideHandle(a.data.shortcutID)
                                    },
                                    afterClose: function() {
                                        this.handle.delHandle(a.data.shortcutID)
                                    },
                                    afterSwitch: function() {
                                        this.handle.switchHandle(a.data.shortcutID)
                                    },
                                    modal: !1,
                                    center: !0,
                                    width: TUI.env.cfg.desktop[b.id - 1].appList[j].app.launch.width,
                                    height: TUI.env.cfg.desktop[b.id - 1].appList[j].app.launch.height
                                });
                                c.show();
                                a.data.handle.addHandle(c, a.data.shortcutName, a.data.shortcutImg, a.data.shortcutID);
                                break
                            }
                });
            for (i = 0; i < TUI.env.cfg.desktop[b.id - 1].widgetList.length; i++)
                this.addWidget(new Widget({
                    container: this.desktopFrame.getPanel() + "_Home",
                    type: "iframe",
                    value: TUI.env.cfg.desktop[b.id - 1].widgetList[i].urlPath
                },{
                    handle: this,
                    appId: TUI.env.cfg.desktop[b.id - 1].widgetList[i].appid,
                    top: TUI.env.cfg.desktop[b.id - 1].widgetList[i].top,
                    right: TUI.env.cfg.desktop[b.id - 1].widgetList[i].right,
                    height: TUI.env.cfg.desktop[b.id - 1].widgetList[i].app.launch.height,
                    width: TUI.env.cfg.desktop[b.id - 1].widgetList[i].app.launch.width,
                    launchFile: TUI.env.cfg.desktop[b.id - 1].widgetList[i].app.launch.local_path,
                    fullscreen: TUI.env.cfg.desktop[b.id - 1].widgetList[i].app.launch.fullscreen,
                    boxshadow: TUI.env.cfg.desktop[b.id - 1].widgetList[i].app.launch.boxshadow
                }));
            $("#" + this.desktopFrame.getPanel() + "_Home").bind("mousewheel", {
                handle: this
            }, function(a, b) {
                a.data.handle.magicHandle(b);
                return !1
            })
        },
        show: function(b) {
            this.desktopFrame.show(b);
            $(this).oneTime(1E3, function() {
                this.desktopDock.show();
                this.desktopTask.show();
                this.desktopShortcut.show()
            })
        },
        hide: function(b) {
            this.desktopFrame.hide(b)
        },
        uninstall: function(b, a) {
            var c = this;
            this.delHandle(b);
            for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].appList.length; i++)
                if (TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].appid == b) {
                    $.ajax({
                        type: "post",
                        url: "https://hqiot.bjut.edu.cn/System/srv/delshortcut.ejs",
                        data: {
                            appId: b,
                            deskTop: TUI.env.desktop
                        },
                        dataType: "json",
                        error: function(a) {
                            playSound("error");
                            toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u5220\u9664\u684c\u9762\u5feb\u6377")
                        },
                        success: function(a) {
                            TUI.env.cfg = a;
                            playSound("info");
                            c.desktopShortcut.delShortcut(b);
                            toastr.success("\u5220\u9664\u5e94\u7528\u7a0b\u5e8f\u684c\u9762\u5feb\u6377\u6210\u529f\uff01", "\u5220\u9664\u684c\u9762\u5feb\u6377")
                        }
                    });
                    break
                }
            for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList.length; i++)
                TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].appid == b && $.ajax({
                    type: "post",
                    url: "https://hqiot.bjut.edu.cn/System/srv/deldock.ejs",
                    data: {
                        appId: b,
                        deskTop: TUI.env.desktop
                    },
                    dataType: "json",
                    error: function(a) {
                        playSound("error");
                        toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u5220\u9664\u505c\u9760\u680f\u5feb\u6377")
                    },
                    success: function(a) {
                        TUI.env.cfg = a;
                        playSound("info");
                        c.desktopDock.delApp(b);
                        toastr.success("\u5220\u9664\u5e94\u7528\u7a0b\u5e8f\u505c\u9760\u680f\u5feb\u6377\u6210\u529f\uff01", "\u5220\u9664\u505c\u9760\u680f\u5feb\u6377")
                    }
                })
        },
        setWidget: function(b, a, c) {
            var e = this
              , d = 0;
            for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList.length; i++)
                if (TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].appid == b) {
                    d = 1;
                    1 == c ? (e.delWidget(b),
                    toastr.success("\u4ece\u5f53\u524d\u7528\u6237\u684c\u9762\u79fb\u9664\u90e8\u4ef6\u6210\u529f\uff01", "\u79fb\u9664\u684c\u9762\u90e8\u4ef6")) : toastr.info("\u5f53\u524d\u90e8\u4ef6\u5df2\u653e\u7f6e\u4e8e\u60a8\u7684\u684c\u9762,\u8bf7\u67e5\u9605", "\u8bbe\u7f6e\u684c\u9762\u90e8\u4ef6");
                    break
                }
            0 == d && $.ajax({
                type: "post",
                url: "https://hqiot.bjut.edu.cn/System/srv/addwidget.ejs",
                data: {
                    appId: b,
                    urlPath: a,
                    deskTop: TUI.env.desktop
                },
                dataType: "json",
                error: function(a) {
                    playSound("error");
                    toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u8bbe\u7f6e\u684c\u9762\u90e8\u4ef6")
                },
                success: function(a) {
                    TUI.env.cfg = a;
                    for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList.length; i++)
                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].appid == b) {
                            e.addWidget(new Widget({
                                container: e.desktopFrame.getPanel() + "_Home",
                                type: "iframe",
                                value: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].urlPath
                            },{
                                handle: e,
                                appId: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].appid,
                                top: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].top,
                                right: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].right,
                                height: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].app.launch.height,
                                width: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].app.launch.width,
                                launchFile: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].app.launch.local_path,
                                fullscreen: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].app.launch.fullscreen,
                                boxshadow: TUI.env.cfg.desktop[TUI.env.desktop - 1].widgetList[i].app.launch.boxshadow
                            }));
                            playSound("info");
                            break
                        }
                }
            })
        },
        setAppShortcut: function(b, a, c, e) {
            var d = this
              , f = 0;
            for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].appList.length; i++)
                if (TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].appid == b) {
                    f = 1;
                    $.ajax({
                        type: "post",
                        url: "https://hqiot.bjut.edu.cn/System/srv/delshortcut.ejs",
                        data: {
                            appId: b,
                            deskTop: TUI.env.desktop
                        },
                        dataType: "json",
                        error: function(a) {
                            playSound("error");
                            toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u5220\u9664\u684c\u9762\u5feb\u6377")
                        },
                        success: function(a) {
                            TUI.env.cfg = a;
                            playSound("info");
                            d.desktopShortcut.delShortcut(b);
                            toastr.success("\u5220\u9664\u5e94\u7528\u7a0b\u5e8f\u684c\u9762\u5feb\u6377\u6210\u529f\uff01", "\u5220\u9664\u684c\u9762\u5feb\u6377")
                        }
                    });
                    break
                }
            0 == f && $.ajax({
                type: "post",
                url: "https://hqiot.bjut.edu.cn/System/srv/addshortcut.ejs",
                data: {
                    appId: b,
                    urlPath: a,
                    title: c,
                    logoPath: e,
                    deskTop: TUI.env.desktop
                },
                dataType: "json",
                error: function(a) {
                    playSound("error");
                    toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u6dfb\u52a0\u684c\u9762\u5feb\u6377")
                },
                success: function(a) {
                    TUI.env.cfg = a;
                    for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].appList.length; i++)
                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].appid == b) {
                            0 <= b.indexOf("Pad-") ? d.desktopShortcut.addShortcut(TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].name, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].name, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].logoPath, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].appid, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].urlPath, d, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].top, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].left, function(a) {
                                if (a.data.handle.checkHandle(a.data.shortcutID))
                                    a.data.handle.activeHandle(a.data.shortcutID);
                                else
                                    for (j = 0; j < TUI.env.cfg.desktop[TUI.env.desktop - 1].appList.length; j++)
                                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[j].appid == a.data.shortcutID) {
                                            var b = new Dialog({
                                                container: a.data.handle.container,
                                                type: "iframe",
                                                value: a.data.shortcutLaunch
                                            },{
                                                title: a.data.appName + "\u2014\u2014\u5de5\u4f5c\u53f0",
                                                taskImg: a.data.shortcutImg,
                                                handle: a.data.handle,
                                                appid: a.data.shortcutID,
                                                urlPath: TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[j].urlPath,
                                                afterShow: function() {},
                                                afterHide: function() {
                                                    this.handle.hideHandle(a.data.shortcutID)
                                                },
                                                afterClose: function() {
                                                    this.handle.delHandle(a.data.shortcutID)
                                                },
                                                afterSwitch: function() {
                                                    this.handle.switchHandle(a.data.shortcutID)
                                                },
                                                modal: !1,
                                                center: !0,
                                                width: 1024,
                                                height: 720
                                            });
                                            b.show();
                                            a.data.handle.addHandle(b, a.data.shortcutName, a.data.shortcutImg, a.data.shortcutID);
                                            break
                                        }
                            }) : d.desktopShortcut.addShortcut(TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].name, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i]["short"], TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].urlPath + "/" + TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].icons.logo, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].appid, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].app.launch.local_path, d, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].top, TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[i].left, function(a) {
                                if (a.data.handle.checkHandle(a.data.shortcutID))
                                    a.data.handle.activeHandle(a.data.shortcutID);
                                else
                                    for (j = 0; j < TUI.env.cfg.desktop[TUI.env.desktop - 1].appList.length; j++)
                                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[j].appid == a.data.shortcutID) {
                                            var b = new Dialog({
                                                container: a.data.handle.container,
                                                type: "iframe",
                                                value: a.data.shortcutLaunch
                                            },{
                                                title: a.data.appName,
                                                taskImg: a.data.shortcutImg,
                                                handle: a.data.handle,
                                                appid: a.data.shortcutID,
                                                urlPath: TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[j].urlPath,
                                                afterShow: function() {},
                                                afterHide: function() {
                                                    this.handle.hideHandle(a.data.shortcutID)
                                                },
                                                afterClose: function() {
                                                    this.handle.delHandle(a.data.shortcutID)
                                                },
                                                afterSwitch: function() {
                                                    this.handle.switchHandle(a.data.shortcutID)
                                                },
                                                modal: !1,
                                                center: !0,
                                                width: TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[j].app.launch.width,
                                                height: TUI.env.cfg.desktop[TUI.env.desktop - 1].appList[j].app.launch.height
                                            });
                                            b.show();
                                            a.data.handle.addHandle(b, a.data.shortcutName, a.data.shortcutImg, a.data.shortcutID);
                                            break
                                        }
                            });
                            break
                        }
                    playSound("info")
                }
            })
        },
        setAppDock: function(b, a, c, e) {
            var d = this
              , f = 0;
            for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList.length; i++)
                if (TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].appid == b) {
                    f = 1;
                    $.ajax({
                        type: "post",
                        url: "https://hqiot.bjut.edu.cn/System/srv/deldock.ejs",
                        data: {
                            appId: b,
                            deskTop: TUI.env.desktop
                        },
                        dataType: "json",
                        error: function(a) {
                            playSound("error");
                            toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u5220\u9664\u505c\u9760\u680f\u5feb\u6377")
                        },
                        success: function(a) {
                            TUI.env.cfg = a;
                            playSound("info");
                            d.desktopDock.delApp(b);
                            toastr.success("\u5220\u9664\u5e94\u7528\u7a0b\u5e8f\u505c\u9760\u680f\u5feb\u6377\u6210\u529f\uff01", "\u5220\u9664\u505c\u9760\u680f\u5feb\u6377")
                        }
                    });
                    break
                }
            0 == f && $.ajax({
                type: "post",
                url: "https://hqiot.bjut.edu.cn/System/srv/adddock.ejs",
                data: {
                    appId: b,
                    urlPath: a,
                    title: c,
                    logoPath: e,
                    deskTop: TUI.env.desktop
                },
                dataType: "json",
                error: function(a) {
                    playSound("error");
                    toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u6dfb\u52a0\u505c\u9760\u680f\u5feb\u6377")
                },
                success: function(a) {
                    TUI.env.cfg = a;
                    for (i = 0; i < TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList.length; i++)
                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].appid == b) {
                            0 <= b.indexOf("Pad-") ? d.desktopDock.addApp(TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].name, TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].logoPath, TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].appid, TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].urlPath, d, function(a) {
                                if (a.data.handle.checkHandle(a.data.appID))
                                    a.data.handle.activeHandle(a.data.appID);
                                else
                                    for (a.data.handle.desktopDock.setMsgActive(a.data.appID),
                                    j = 0; j < TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList.length; j++)
                                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[j].appid == a.data.appID) {
                                            var b = new Dialog({
                                                container: a.data.handle.container,
                                                type: "iframe",
                                                value: a.data.appLaunch
                                            },{
                                                title: a.data.appName + "\u2014\u2014\u5de5\u4f5c\u53f0",
                                                taskImg: a.data.appImg,
                                                handle: a.data.handle,
                                                appid: a.data.appID,
                                                urlPath: TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[j].urlPath,
                                                afterShow: function() {},
                                                afterHide: function() {
                                                    this.handle.hideHandle(a.data.appID)
                                                },
                                                afterClose: function() {
                                                    this.handle.delHandle(a.data.appID)
                                                },
                                                afterSwitch: function() {
                                                    this.handle.switchHandle(a.data.appID)
                                                },
                                                modal: !1,
                                                center: !0,
                                                width: 1024,
                                                height: 720
                                            });
                                            b.show();
                                            a.data.handle.addHandle(b, a.data.appName, a.data.appImg, a.data.appID);
                                            break
                                        }
                            }) : d.desktopDock.addApp(TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].name, TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].urlPath + "/" + TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].icons.logo, TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].appid, TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[i].app.launch.local_path, d, function(a) {
                                if (a.data.handle.checkHandle(a.data.appID))
                                    a.data.handle.activeHandle(a.data.appID);
                                else
                                    for (a.data.handle.desktopDock.setMsgActive(a.data.appID),
                                    j = 0; j < TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList.length; j++)
                                        if (TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[j].appid == a.data.appID) {
                                            var b = new Dialog({
                                                container: a.data.handle.container,
                                                type: "iframe",
                                                value: a.data.appLaunch
                                            },{
                                                title: a.data.appName,
                                                taskImg: a.data.appImg,
                                                handle: a.data.handle,
                                                appid: a.data.appID,
                                                urlPath: TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[j].urlPath,
                                                afterShow: function() {},
                                                afterHide: function() {
                                                    this.handle.hideHandle(a.data.appID)
                                                },
                                                afterClose: function() {
                                                    this.handle.delHandle(a.data.appID)
                                                },
                                                afterSwitch: function() {
                                                    this.handle.switchHandle(a.data.appID)
                                                },
                                                modal: !1,
                                                center: !0,
                                                width: TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[j].app.launch.width,
                                                height: TUI.env.cfg.desktop[TUI.env.desktop - 1].dockList[j].app.launch.height
                                            });
                                            b.show();
                                            a.data.handle.addHandle(b, a.data.appName, a.data.appImg, a.data.appID);
                                            break
                                        }
                            });
                            break
                        }
                    playSound("info")
                }
            })
        },
        addWidget: function(b) {
            this.WidgetHandle[this.WidgetHandle.length] = b;
            $(this).oneTime(500, function() {
                b.show()
            })
        },
        delWidget: function(b) {
            for (i = 0; i < this.WidgetHandle.length; i++)
                if (this.WidgetHandle[i].getAppId() == b) {
                    this.WidgetHandle[i].close();
                    delete this.WidgetHandle[i];
                    this.WidgetHandle.splice(i, 1);
                    break
                }
        },
        hideWidget: function() {
            for (i = 0; i < this.WidgetHandle.length; i++)
                this.WidgetHandle[i].hide()
        },
        addHandle: function(b, a, c, e) {
            this.WindowHandle[this.WindowHandle.length] = [b, e];
            this.desktopTask.addTaskButton(a, c, e, this, function(a) {
                a.data.handle.activeHandle(a.data.taskID)
            });
            this.switchHandle(e)
        },
        delHandle: function(b) {
            for (i = 0; i < this.WindowHandle.length; i++)
                if (this.WindowHandle[i][1] == b) {
                    delete this.WindowHandle[i];
                    this.WindowHandle.splice(i, 1);
                    this.desktopTask.delTaskButton(b);
                    break
                }
            for (i = this.WindowHandle.length - 1; 0 <= i; i--)
                if (this.WindowHandle[i][1] != b && this.WindowHandle[i][0].getShowFlag()) {
                    this.desktopTask.setTaskActive(this.WindowHandle[i][1]);
                    this.WindowHandle[i][0].setActive();
                    break
                }
        },
        hideHandle: function(b) {
            this.desktopTask.setTaskNormal(b);
            for (i = this.WindowHandle.length - 1; 0 <= i; i--)
                if (this.WindowHandle[i][1] != b && this.WindowHandle[i][0].getShowFlag()) {
                    this.desktopTask.setTaskActive(this.WindowHandle[i][1]);
                    this.WindowHandle[i][0].setActive();
                    break
                }
        },
        hideAllHandle: function() {
            for (i = 0; i < this.WindowHandle.length; i++)
                this.WindowHandle[i][0].getShowFlag() && (this.WindowHandle[i][0].hide(),
                this.desktopTask.setTaskNormal(this.WindowHandle[i][1]));
            this.desktopTask.clear()
        },
        showAllHandle: function() {
            var b = 0;
            for (i = 0; i < this.WindowHandle.length; i++)
                if (i < this.WindowHandle.length - 1) {
                    this.desktopTask.setTaskNormal(this.WindowHandle[i][1]);
                    b++;
                    var a = b / this.WindowHandle.length;
                    .75 > a && (a = .75);
                    .9 < a && (a = .9);
                    this.WindowHandle[i][0].rest();
                    this.WindowHandle[i][0].setNormal(a)
                } else
                    this.desktopTask.setTaskActive(this.WindowHandle[i][1]),
                    this.WindowHandle[i][0].rest(),
                    this.WindowHandle[i][0].setActive()
        },
        activeHandle: function(b) {
            var a = 0;
            for (i = 0; i < this.WindowHandle.length; i++)
                if (this.WindowHandle[i][1] != b) {
                    if (this.WindowHandle[i][0].getShowFlag()) {
                        this.desktopTask.setTaskNormal(this.WindowHandle[i][1]);
                        a++;
                        var c = a / this.WindowHandle.length;
                        .75 > c && (c = .75);
                        .9 < c && (c = .9);
                        this.WindowHandle[i][0].setNormal(c)
                    }
                } else
                    this.desktopTask.setTaskActive(b),
                    this.WindowHandle[i][0].getShowFlag() ? this.WindowHandle[i][0].setActive() : this.WindowHandle[i][0].rest()
        },
        switchHandle: function(b) {
            var a = 0;
            for (i = 0; i < this.WindowHandle.length; i++)
                if (this.WindowHandle[i][1] != b) {
                    if (this.WindowHandle[i][0].getShowFlag()) {
                        this.desktopTask.setTaskNormal(this.WindowHandle[i][1]);
                        a++;
                        var c = a / this.WindowHandle.length;
                        .75 > c && (c = .75);
                        .9 < c && (c = .9);
                        this.WindowHandle[i][0].setNormal(c)
                    }
                } else
                    this.desktopTask.setTaskActive(b),
                    this.WindowHandle[i][0].setActive()
        },
        magicHandle: function(b) {
            if (!(0 == b || 2 > this.WindowHandle.length)) {
                var a = new Date;
                if (1 <= a.getTime() / 1E3 - this.magicTimeSpan) {
                    this.magicTimeSpan = a.getTime() / 1E3;
                    a = [];
                    for (i = 0; i < this.WindowHandle.length; i++)
                        this.WindowHandle[i][0].getShowFlag() && (a[a.length] = [this.WindowHandle[i][0], this.WindowHandle[i][1], this.WindowHandle[i][0].getTop(), this.WindowHandle[i][0].getLeft(), this.WindowHandle[i][0].getWidth(), this.WindowHandle[i][0].getHeight(), this.WindowHandle[i][0].getZindex()]);
                    if (0 != a.length) {
                        a.sort(function(a, b) {
                            return a[6] < b[6] ? -1 : 1
                        });
                        if (0 > b)
                            for (b = [a[0][2], a[0][3], a[0][4], a[0][5], a[0][6]],
                            i = 0; i < a.length; i++)
                                i == a.length - 1 ? (a[i][2] = b[0],
                                a[i][3] = b[1],
                                a[i][4] = b[2],
                                a[i][5] = b[3],
                                a[i][6] = b[4]) : (a[i][2] = a[i + 1][2],
                                a[i][3] = a[i + 1][3],
                                a[i][4] = a[i + 1][4],
                                a[i][5] = a[i + 1][5],
                                a[i][6] = a[i + 1][6]);
                        else
                            for (b = [a[a.length - 1][2], a[a.length - 1][3], a[a.length - 1][4], a[a.length - 1][5], a[a.length - 1][6]],
                            i = a.length - 1; 0 <= i; i--)
                                0 == i ? (a[i][2] = b[0],
                                a[i][3] = b[1],
                                a[i][4] = b[2],
                                a[i][5] = b[3],
                                a[i][6] = b[4]) : (a[i][2] = a[i - 1][2],
                                a[i][3] = a[i - 1][3],
                                a[i][4] = a[i - 1][4],
                                a[i][5] = a[i - 1][5],
                                a[i][6] = a[i - 1][6]);
                        a.sort(function(a, b) {
                            return a[6] < b[6] ? -1 : 1
                        });
                        this.desktopTask.setTaskActive(a[a.length - 1][1]);
                        for (i = b = 0; i < a.length; i++) {
                            b++;
                            var c = b / a.length;
                            .75 > c && (c = .75);
                            .9 < c && (c = .9);
                            i == a.length - 1 && (c = 1);
                            a[i][0].magic(a[i][2], a[i][3], a[i][4], a[i][5], c, a[i][6], 600);
                            1 > c ? this.desktopTask.setTaskNormal(a[i][1]) : this.desktopTask.setTaskActive(a[i][1])
                        }
                    }
                }
            }
        },
        checkHandle: function(b) {
            for (i = 0; i < this.WindowHandle.length; i++)
                if (this.WindowHandle[i][1] == b)
                    return !0;
            return !1
        },
        disActionWindow: function() {
            for (i = 0; i < this.WindowHandle.length; i++)
                this.WindowHandle[i][0].getZindex() < Dialog.__zindex && this.WindowHandle[i][0].disAction()
        }
    }
}
;