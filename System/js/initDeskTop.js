function initDesktop() {
    TUI.env.desktop = 1;
    $(this).stop(!0).stopTime("loginRand");
    $.ajax({
        type: "get",
        url: "System/json/readConfig.json",
        dataType: "json",
        error: function(b) {
            $("#loginFrame").fadeOut(3500, function() {
                self.location = "./index.html"
            });
            playSound("error");
            toastr.error("\u7f51\u7edc\u6216\u540e\u53f0\u670d\u52a1\u9519\u8bef,\u8bf7\u91cd\u8bd5\uff01", "\u4e2a\u4eba\u8bbe\u5b9a")
        },
        success: function(b) {
            TUI.env.cfg = b;
            void 0 != TUI.env.cfg.system.myTheme && 0 < TUI.env.cfg.system.myTheme.length && (document.getElementById("mytheme").href = TUI.env.cfg.system.myTheme + "/theme.css");
            TUI.env.os[0] = new SmartManage("desktopFrame1",{
                bTensile: TUI.env.cfg.desktop[0].bTensile,
                imgWrapper: TUI.env.cfg.desktop[0].imgWrapper,
                bLogin: !1,
                id: 1
            });
            TUI.env.os[0].init();
            TUI.env.os[0].show(0);
            myApp.close = function() {
                TUI.env.os[0].desktopTask.close()
            }
            ;
            $("#desktopFrame1").css({
                left: -($(window).width() + 50),
                opacity: 0
            });
            $("#desktopFrame1").animate({
                left: 0,
                opacity: 1,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, 1E3, function() {
                playSound("desktop")
            });
            $("#loginFrame").animate({
                left: $(window).width() + 50,
                opacity: 0,
                avoidTransforms: !1,
                useTranslate3d: TUI.env.ua.has3d
            }, 1E3, function() {
                $("#loginFrame").hide()
            })
        }
    })
}