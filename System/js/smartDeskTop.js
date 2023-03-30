SmartDeskTop = function(d, b) {
    return {
        init: function() {
            this.container = d;
            var a = b ? b : {};
            this.bTensile = a.bTensile ? a.bTensile : !1;
            this.imgWrapper = a.imgWrapper;
            this.videoWrapper = a.videoWrapper;
            this.id = a.id ? a.id : 0;
            this.bTensile ? this.videoWrapper && "" != this.videoWrapper ? /Android/.test(navigator.userAgent) ? $("#" + this.container).html('\x3cdiv class\x3d"desktopWrapper"\x3e\x3cimg src\x3d"' + this.imgWrapper + '" width\x3d"100%" height\x3d"100%" style\x3d"position:absolute;top:0;left:0;z-index:-1" onerror\x3d"this.style.display\x3d\'none\'"\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Panel class\x3d"desktopPanel"\x3e\x3c/div\x3e') : $("#" + this.container).html('\x3cdiv class\x3d"desktopWrapper"\x3e\x3cvideo muted\x3d"muted" autoplay\x3d"autoplay" preload\x3d"none" loop\x3d"loop" poster\x3d"' + this.imgWrapper + '" style\x3d"position: absolute;top: 0;left: 0;width: 100%;height: 100%;object-fit: fill;"\x3e\t\t\x3csource src\x3d"' + this.videoWrapper + '" type\x3d"video/mp4" style\x3d"position:absolute;top:0;left:0;z-index:-1" onerror\x3d"this.style.display\x3d\'none\'"\x3e \x3c/video\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Panel class\x3d"desktopPanel"\x3e\x3c/div\x3e') : this.imgWrapper && "" != this.imgWrapper ? $("#" + this.container).html('\x3cdiv class\x3d"desktopWrapper"\x3e\x3cimg src\x3d"' + this.imgWrapper + '" width\x3d"100%" height\x3d"100%" style\x3d"position:absolute;top:0;left:0;z-index:-1" onerror\x3d"this.style.display\x3d\'none\'"\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Panel class\x3d"desktopPanel"\x3e\x3c/div\x3e') : $("#" + this.container).html('\x3cdiv class\x3d"desktopWrapper"\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Panel class\x3d"desktopPanel"\x3e\x3c/div\x3e') : ($("#" + this.container).html('\x3cdiv class\x3d"desktopWrapper"\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Panel class\x3d"desktopPanel"\x3e\x3c/div\x3e'),
            this.imgWrapper && "" != this.imgWrapper && $("#" + this.container + " .desktopWrapper").css("background", "transparent url(" + this.imgWrapper + ") repeat center top"))
        },
        setup: function(a) {
            var c = a ? a : {}
              , b = this.bTensile;
            this.bTensile = c.bTensile ? c.bTensile : !1;
            this.imgWrapper = c.imgWrapper;
            b && $("#" + this.container).find(".desktopWrapper").empty();
            this.bTensile ? $("#" + this.container).find(".desktopWrapper").html('\x3cimg src\x3d"' + this.imgWrapper + '" width\x3d"100%" height\x3d"100%" style\x3d "position:absolute;top:0;left:0;z-index:-1"\x3e') : this.imgWrapper && $("#" + this.container).find(".desktopWrapper").css("background", "transparent url(" + this.imgWrapper + ") repeat center top");
            $("#" + this.container).fadeTo("fast", 500);
            a.bTheme || $.ajax({
                type: "post",
                url: "/System/srv/setWrapper.ejs",
                data: {
                    bTensile: this.bTensile,
                    imgWrapper: this.imgWrapper,
                    deskTop: TUI.env.desktop
                },
                dataType: "text",
                error: function(a) {
                    playSound("error");
                    toastr.error("\u8bbe\u7f6e\u684c\u9762\u5899\u7eb8\u5931\u8d25,\u8bf7\u91cd\u8bd5\uff01", "\u684c\u9762\u5899\u7eb8\u8bbe\u5b9a")
                },
                success: function(a) {
                    "OK" == a ? (playSound("info"),
                    toastr.info("\u8bbe\u7f6e\u60a8\u7684\u684c\u9762\u5899\u7eb8\u6210\u529f\uff01", "\u684c\u9762\u5899\u7eb8\u8bbe\u5b9a")) : (playSound("warning"),
                    toastr.warn("\u8bbe\u7f6e\u684c\u9762\u5899\u7eb8\u4fdd\u5b58\u5931\u8d25\uff01", "\u684c\u9762\u5899\u7eb8\u8bbe\u5b9a"))
                }
            })
        },
        clear: function() {
            $("#" + this.container).find(".desktopWrapper").empty();
            $("#" + this.container).find(".desktopWrapper").css("background", "");
            $("#" + this.container).fadeTo("fast", 500)
        },
        blur: function(a) {
            $("#" + this.container).find(".desktopWrapper").css("-webkit-filter", "blur(" + a + "px)")
        },
        show: function(a) {
            $("#" + this.container).fadeIn(a)
        },
        hide: function(a) {
            $("#" + this.container).fadeOut(a)
        },
        getPanel: function() {
            return this.container + "_Panel"
        }
    }
}