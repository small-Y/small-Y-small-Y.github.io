SmartLogin = function(g, e) {
    return {
        init: function() {
            this.container = g;
            var a = e ? e : {};
            this.userName = a.userName ? a.userName : "";
            this.passWord = a.passWord ? a.passWord : "";
            this.handler = a.handler ? a.handler : function() {
                alert("unlocked!")
            }
            ;
            var a = new Date
              , c = ""
              , d = ""
              , c = 10 > a.getMinutes() ? a.getHours() + ":0" + a.getMinutes() : a.getHours() + ":" + a.getMinutes()
              , d = a.getMonth() + 1 + "\u6708" + a.getDate() + "\u65e5 " + "\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" ")[a.getDay()];
            "" == this.userName ? $("#" + this.container).html("\x3cdiv id\x3d" + this.container + '_Time class\x3d"loginTime"\x3e' + c + "\x3c/div\x3e\x3cdiv id\x3d" + this.container + '_Date class\x3d"loginDate"\x3e' + d + "\x3c/div\x3e\x3cdiv id\x3d" + this.container + '_Load class\x3d"loginLoading"\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Form class\x3d"loginForm"\x3e\t\x3cdiv class\x3d"loginTitle"\x3e\u6b22\u8fce\x3c/div\x3e\t\x3cdiv class\x3d"loginsubTitle"\x3e\u5149\u4e34\uff0c\u53d1\u73b0\u5f00\u59cb . . .\x3c/div\x3e\t\x3cdiv class\x3d"loginUser"\x3e\u5e10 \u53f7\uff1a\x3cinput type\x3d"text" name\x3d"userName" id\x3d"userName" class\x3d"loginText" value\x3d"' + this.userName + '" placeholder\x3d"\u8bf7\u8f93\u5165\u5e10\u53f7" autocomplete\x3d"on" required\x3d"required"\x3e\x3c/div\x3e\t\x3cdiv class\x3d"loginPass"\x3e\u53e3 \u4ee4\uff1a\x3cinput type\x3d"password" name\x3d"passWord" id\x3d"passWord" class\x3d"loginText" value\x3d"' + this.passWord + '" placeholder\x3d"\u8bf7\u8f93\u5165\u53e3\u4ee4"  required\x3d"required"\x3e\x3c/div\x3e\t\x3cdiv id\x3d' + this.container + '_Info class\x3d"loginInfo"\x3e\x26nbsp;\x3c/div\x3e\t\x3cdiv id\x3d' + this.container + '_Slider class\x3d"loginSlider"\x3e\x26nbsp;\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"ssoLogin"\x3e\x3ca href\x3d"/API/SSO/AccessToken?state\x3d*"\x3e\u7edf\u4e00\u8eab\u4efd\u8ba4\u8bc1\x3c/a\x3e\x3c/div\x3e') : $("#" + this.container).html("\x3cdiv id\x3d" + this.container + '_Time class\x3d"loginTime"\x3e' + c + "\x3c/div\x3e\x3cdiv id\x3d" + this.container + '_Date class\x3d"loginDate"\x3e' + d + "\x3c/div\x3e\x3cdiv id\x3d" + this.container + '_Load class\x3d"loginLoading"\x3e\x3c/div\x3e\x3cdiv id\x3d' + this.container + '_Form class\x3d"loginForm"\x3e\t\x3cdiv class\x3d"loginTitle"\x3e\u6b22\u8fce\x3c/div\x3e\t\x3cdiv class\x3d"loginsubTitle"\x3e\u56de\u6765\uff0c\u7cbe\u5f69\u6709\u4f60 . . .\x3c/div\x3e\t\x3cdiv class\x3d"loginUser"\x3e\u5e10 \u53f7\uff1a\x3cinput type\x3d"text" name\x3d"userName" id\x3d"userName" class\x3d"loginText" value\x3d"' + this.userName + '" placeholder\x3d"\u8bf7\u8f93\u5165\u5e10\u53f7" autocomplete\x3d"on" required\x3d"required"\x3e\x3c/div\x3e\t\x3cdiv class\x3d"loginPass"\x3e\u53e3 \u4ee4\uff1a\x3cinput type\x3d"password" name\x3d"passWord" id\x3d"passWord" class\x3d"loginText" value\x3d"' + this.passWord + '" placeholder\x3d"\u8bf7\u8f93\u5165\u53e3\u4ee4" required\x3d"required"\x3e\x3c/div\x3e\t\x3cdiv id\x3d' + this.container + '_Info class\x3d"loginInfo"\x3e\x26nbsp;\x3c/div\x3e\t\x3cdiv id\x3d' + this.container + '_Slider class\x3d"loginSlider"\x3e\x26nbsp;\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"ssoLogin"\x3e\x3ca href\x3d"/API/SSO/AccessToken?state\x3d*"\x3e\u7edf\u4e00\u8eab\u4efd\u8ba4\u8bc1\x3c/a\x3e\x3c/div\x3e');
            $(this).everyTime(15E3, "logintime", function() {
                var b = new Date;
                10 > b.getMinutes() ? $("#" + this.container + "_Time").html(b.getHours() + ":0" + b.getMinutes()) : $("#" + this.container + "_Time").html(b.getHours() + ":" + b.getMinutes());
                $("#" + this.container + "_Date").html(b.getMonth() + 1 + "\u6708" + b.getDate() + "\u65e5 " + "\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" ")[b.getDay()])
            });
            this.loginSlider = new Slider(this.container + "_Slider",{
                infoid: this.container + "_Load",
                loginHandle: this,
                callfunction: this.handler,
                handler: function() {
                    var b = $("#userName").prop("value")
                      , a = $("#passWord").prop("value");
                    "" == b ? (playSound("warn"),
                    toastr.warning("\u8bf7\u8f93\u5165\u60a8\u7684\u8d26\u6237\u540d\uff01", "\u8d26\u6237\u767b\u5f55"),
                    $("#userName").focus(),
                    this.reset()) : "" == a ? (playSound("warn"),
                    toastr.warning("\u8bf7\u8f93\u5165\u60a8\u7684\u8d26\u6237\u53e3\u4ee4\uff01", "\u8d26\u6237\u767b\u5f55"),
                    $("#passWord").focus(),
                    this.reset()) : ($("#userName").blur(),
                    $("#passWord").blur(),
                    this.loginHandle.userName = b,
                    this.callfunction(b, a))
                }
            });
            this.loginSlider.init();
            var f = this;
            $("#userName").keydown(function(a) {
                13 == a.keyCode && $("#passWord").focus()
            });
            $("#passWord").keydown(function(a) {
                if (13 == a.keyCode) {
                    a = $("#userName").prop("value");
                    var b = $("#passWord").prop("value");
                    "" == a ? (playSound("warn"),
                    toastr.warning("\u8bf7\u8f93\u5165\u60a8\u7684\u8d26\u6237\u540d\uff01", "\u8d26\u6237\u767b\u5f55"),
                    $("#userName").focus()) : "" == b ? (playSound("warn"),
                    toastr.warning("\u8bf7\u8f93\u5165\u60a8\u7684\u8d26\u6237\u53e3\u4ee4\uff01", "\u8d26\u6237\u767b\u5f55"),
                    $("#passWord").focus()) : ($("#userName").blur(),
                    $("#passWord").blur(),
                    f.userName = a,
                    f.handler(a, b))
                }
            })
        },
        clear: function() {
            $("#" + this.container + "_Load").hide()
        },
        reset: function() {
            $("#passWord").val("");
            $("#" + this.container + "_Load").hide();
            this.loginSlider.reset();
            $("#" + this.container + "_Form").fadeIn(500)
        },
        show: function(a) {
            var c = this;
            $("#" + this.container + "_Form").css({
                left: -800,
                opacity: 0
            });
            $("#" + this.container + "_Form").animate({
                left: $(window).width() / 2,
                opacity: 1
            }, a, function() {
                $("#" + c.container + "_Form").css({
                    left: "50%"
                })
            })
        },
        hide: function(a) {
            var c = this;
            $("#" + this.container + "_Form").fadeOut(a, function() {
                $("#" + c.container + "_Load").show()
            })
        }
    }
}