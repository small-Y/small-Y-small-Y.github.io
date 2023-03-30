Slider = function(e, d) {
    return {
        init: function() {
            this.container = e;
            var a = d ? d : {};
            this.handler = a.handler ? a.handler : function() {
                alert("unlocked!")
            };
            this.callfunction = a.callfunction ? a.callfunction : function() {
                alert("unlocked!")
            };
            this.mode = a.mode ? a.mode : "click";
            this.waver = a.waver ? a.waver : 150;
            this.infoid = a.infoid ? a.infoid : "";
            this.loginHandle = a.loginHandle;
            $("#" + this.container).html('\x3cdiv class\x3d"track"\x3e\x3cdiv class\x3d"track-message"\x3e\u79fb\u52a8\u6ed1\u5757\u6765\u767b\u5f55\x3c/div\x3e\x3cdiv class\x3d"handle"\x3e\x3c/div\x3e\x3c/div\x3e');
            this.handle = $("#" + this.container + " .handle");
            this.track = $("#" + this.container + " .track");
            this.message = $("#" + this.container + " .track-message");
            var b = this;
            TUI.env.ua.ontouch ? ("noclick" == this.mode ? this.handle.bind("touchstart", function(a) {
                a.preventDefault();
                b.initX(a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
                $("html").bind("touchmove", {
                    slider: b
                }, b.slideNoClick1)
            }) : this.handle.bind("touchstart", function(a) {
                a.preventDefault();
                b.initX(a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
                $("html").bind("touchmove", {
                    slider: b
                }, b.slide1);
                $("html").one("touchend", {
                    slider: b
                }, b.release)
            }),
            "windows" == TUI.env.ua.os && ("noclick" == this.mode ? this.handle.mouseover(function(a) {
                b.initX(a);
                $("html").bind("mousemove", {
                    slider: b
                }, b.slideNoClick2)
            }) : this.handle.mousedown(function(a) {
                b.initX(a);
                $("html").bind("mousemove", {
                    slider: b
                }, b.slide2);
                $("html").one("mouseup", {
                    slider: b
                }, b.release)
            }))) : "noclick" == this.mode ? this.handle.mouseover(function(a) {
                b.initX(a);
                $("html").bind("mousemove", {
                    slider: b
                }, b.slideNoClick2)
            }) : this.handle.mousedown(function(a) {
                b.initX(a);
                $("html").bind("mousemove", {
                    slider: b
                }, b.slide2);
                $("html").one("mouseup", {
                    slider: b
                }, b.release)
            })
        },
        initX: function(a) {
            this.track.get(0);
            var b = this.track.get(0).offsetTop;
            this.track.get(0);
            var c = this.track.get(0).offsetHeight
              , d = this.handle.get(0).offsetLeft;
            this.handle.get(0);
            this.min = 0;
            this.zero = d;
            this.delta = a.clientX - this.zero;
            this.max = 218;
            this.maxY = b + c + this.waver;
            this.minY = b - this.waver
        },
        slideX: function(a) {
            return Math.max(this.min, Math.min(a.clientX - this.zero - this.delta, this.max))
        },
        slide1: function(a) {
            var b = a.data.slider;
            a.preventDefault();
            a = b.slideX(a.originalEvent.touches[0] || a.originalEvent.changedTouches[0]);
            b.handle.css("left", a);
            b.message.css("opacity", Math.max(0, 1 - 2 * a / b.max))
        },
        slide2: function(a) {
            var b = a.data.slider;
            a = b.slideX(a);
            b.handle.css("left", a);
            b.message.css("opacity", Math.max(0, 1 - 2 * a / b.max))
        },
        slideNoClick1: function(a) {
            var b = a.data.slider;
            a.preventDefault();
            var c = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0];
            b.slide(c);
            (b.handle.css("left").replace(/[^0-9]/g, "") == b.max || c.clientY > b.maxY || c.clientY < b.minY) && b.release(a)
        },
        slideNoClick2: function(a) {
            var b = a.data.slider;
            b.slide(a);
            (b.handle.css("left").replace(/[^0-9]/g, "") == b.max || a.clientY > b.maxY || a.clientY < b.minY) && b.release(a)
        },
        release: function(a) {
            a = a.data.slider;
            TUI.env.ua.ontouch ? ($("html").unbind("touchmove"),
            "windows" == TUI.env.ua.os && $("html").unbind("mousemove")) : $("html").unbind("mousemove");
            a.handle.css("left").replace(/[^0-9]/g, "") == a.max ? a.handler() : a.reset()
        },
        setMessage: function(a) {
            this.message.html(a)
        },
        reset: function() {
            this.handle.animate({
                left: 0
            }, 400);
            this.message.animate({
                opacity: 1
            }, 400)
        },
        COLORS: {
            plain: 0,
            red: 1,
            green: 2
        }
    }
};