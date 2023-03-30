/// <reference path="../vsdoc/TUI/base.js" />

//dump
function tRow(s) {t = s.parentNode.lastChild;tTarget(t, tSource(s)) ;}function tTable(s) {var switchToState = tSource(s) ;var table = s.parentNode.parentNode;for (var i = 1; i < table.childNodes.length; i++) {t = table.childNodes[i] ;if (t.style) {tTarget(t, switchToState);}}}function tSource(s) {if (s.style.fontStyle == "italic" || s.style.fontStyle == null) {s.style.fontStyle = "normal";s.title = "click to collapse";return "open";} else {s.style.fontStyle = "italic";s.title = "click to expand";return "closed" ;}}function tTarget (t, switchToState) {if (switchToState == "open") {t.style.display = "";} else {t.style.display = "none";}}
//
var jConsol = function (settings) {
    var info = {
        help: ['<pre>log &#9;&#9; 显示调试打印信息,参数：-c 显示浏览器端调试信息，-s 显示服务器端调试信息，-a 显示全部调试信息</pre>',
                '<pre>cls &#9;&#9; 清除屏幕显示信息</pre>',
                '<pre>ps &#9;&#9; 显示当前运行的进程信息</pre>',
                '<pre>kill &#9;&#9; 关闭指定运行的进程程序</pre>',
                '<pre>clock &#9;&#9; 显示/设置系统时间信息</pre>',
                '<pre>crontab &#9; 显示/设置系统计划任务</pre>',
                '<pre>mail &#9;&#9; 向指定人发送邮件，如mail test@sina.com Hi，你好！ 测试内容...</pre>',
                '<pre>sms &#9;&#9; 向指定人发送短信，如sms 18912345678 Hi，你好！</pre>',
                '<pre>passwd &#9;&#9; 修改当前用户口令</pre>',
                '<pre>logname &#9; 显示当前用户登录信息</pre>',
                '<pre>logout &#9;&#9; 注销当前用户重新登录</pre>',
                '<pre>exit &#9;&#9; 退出命令控制台</pre>']
    };
    var defaults = {
        jQueryVersion: '1',
        promptVersion: false,
        force_jQueryOverride: false,
        force_noConflict: false,
        showGreeting: true,

        theme: {
            errMsgColor: '#f00',
            msgColor: '#f90',
            resultColor: '#9f3',
            indent: '14px',
            mainStyle: { color: '#fff', position: 'absolute', top: '5px', right: '2px', left: '2px', bottom: '2px' },
            logStyle: { fontSize: '12px', fontFamily: 'monospace', color: '#fff', marginBottom: '7px', overflow: 'auto', position: 'absolute', top: '0px', right: '0px', left: '0px', bottom: '24px', textAlign: 'left' },
            btnStyle: { color: '#fff', textDecoration: 'none', float: 'right', bottom: '0px', fontSize: '13px', fontFamily: 'monospace', lineHeight: '10px', border: '1px solid #a0a0a0', padding: '3px', margin: '5px 0 0 4px', cursor: 'pointer' },
            linkStyle: { color: '#6cf', textDecoration: 'none' },
            infoBlock: { fontFamily: 'Tahoma', fontSize: '11px', float: 'left', bottom: '0px', lineHeight: '20px' },
            name: '命令控制台',
            version: '1.0',
            author: "&copy;2016 ThingsLabs.",
            url: 'http://www.thingslabs.com'
        }
    };

    for (var i in settings)
        defaults[i] = settings[i];


    var init = function () {
        var $log = jQuery('<div/>').css(defaults.theme.logStyle);
        var $input = jQuery('<input type="text" class="inputStyle"/>');
        var cmdHistory = new Array();
        var cmdHistAt = -1;
        var loop;
        var bClientLogFlag = true;
        var bServerLogFlag = true;

        var post = function (text, color, indent) {
            if (indent)
                indent = '0 0 0 ' + defaults.theme.indent;
            $log.append(jQuery('<div/>').css({ 'color': color || $log.css('color'), margin: indent || 0, padding: 0, font: 'inherit' }).text(text));
            $log[0].scrollTop = $log[0].scrollHeight;
        };
        var postSpecial = function (text, color, indent) {
            if (indent)
                indent = '0 0 0 ' + defaults.theme.indent;
            $log.append(jQuery('<div/>').css({ 'color': color || $log.css('color'), margin: indent || 0, padding: 0 }).html(text));
            $log[0].scrollTop = $log[0].scrollHeight;
        };

        var log_disp = function (logdata) {
            if (logdata.type == "html") {
                switch (logdata.cat) {
                    case "info":
                        {
                            post(logdata.src, defaults.theme.resultColor, true);
                        }
                        break;
                    case "warn":
                        {
                            post(logdata.src, defaults.theme.msgColor, true);
                        }
                        break;
                    case "error":
                        {
                            post(logdata.src, defaults.theme.errMsgColor, true);
                        }
                        break;
                    default:
                        {
                            post(logdata.src, defaults.theme.resultColor, true);
                        }
                        break;
                }
                //
                postSpecial(logdata.msg, '#fff', true);
            }
            else {
                switch (logdata.cat) {
                    case "info":
                        {
                            post(logdata.msg + " [" + logdata.src + "]", defaults.theme.resultColor, true);
                        }
                        break;
                    case "warn":
                        {
                            post(logdata.msg + " [" + logdata.src + "]", defaults.theme.msgColor, true);
                        }
                        break;
                    case "error":
                        {
                            post(logdata.msg + " [" + logdata.src + "]", defaults.theme.errMsgColor, true);
                        }
                        break;
                    default:
                        {
                            post(logdata.msg + " [" + logdata.src + "]", defaults.theme.resultColor, true);
                        }
                        break;
                }
            }
        };

        var log_client = function () {
            while (TUI.env.log.length > 0) {
                var logdata = TUI.env.log.shift();
                log_disp(logdata);
            }
            //
            clearTimeout(loop);
            loop = setTimeout(log_client, 500);
        };

        var post_logserver = function (result) {
            var loglist = TUI.JSON.decode(result);
            while (loglist.length > 0) {
                var logdata = loglist.shift();
                log_disp(logdata);
            }
        };

        var log_server = function () {
            if (TUI.Comet.connect()) {
                if (!TUI.Comet.addsrv("log", "*", post_logserver)) {
                    post(TUI.Comet.errorText, defaults.theme.errMsgColor, true);
                }
                else {
                    if (!TUI.Comet.onlisten()) {
                        post(TUI.Comet.errorText, defaults.theme.errMsgColor, true);
                    }
                }
            }
            else {
                post(TUI.Comet.errorText, defaults.theme.errMsgColor, true);
            }
        };

        var log_stop = function () {
            clearTimeout(loop);
            TUI.Comet.close()
        };

        var log = function (arg) {
            if (arg.length >= 1) {
                if (arg[0] == "-a") {
                    log_client();
                    log_server();
                }
                else if (arg[0] == "-c") {
                    log_client();
                }
                else if (arg[0] == "-s") {
                    log_server();
                }
            }
            else {
                log_client();
                log_server();
            }
        };

        var sms = function (arg) {
            if (arg.length >= 2) {
                $.ajax({
                    type: 'post',
                    url: "/API/Contact/SMS",
                    data: { phonenum: arg[0], content: arg[1] },
                    dataType: "json",
                    error: function (result) {
                        post("发送短信网络通信错误！", defaults.theme.errMsgColor, true);
                    },
                    success: function (result) {
                        if (!result.flag) {
                            post(result.info, defaults.theme.errMsgColor, true);
                            return;
                        }
                        post("加入发送短信队列成功！", defaults.theme.resultColor, true);
                    }
                });
            }
            else {
                post("发送短信命令缺少参数！", defaults.theme.errMsgColor, true);
            }
        };

		var mail = function (arg) {
            if (arg.length >= 2) {
                $.ajax({
                    type: 'post',
                    url: "/API/Contact/Mail",
                    data: { mailto: arg[0], subject: arg[1],content:arg[2] },
                    dataType: "json",
                    error: function (result) {
                        post("发送邮件网络通信错误！", defaults.theme.errMsgColor, true);
                    },
                    success: function (result) {
                        if (!result.flag) {
                            post(result.info, defaults.theme.errMsgColor, true);
                            return;
                        }
                        post("加入发送邮件队列成功！", defaults.theme.resultColor, true);
                    }
                });
            }
            else {
                post("发送邮件命令缺少参数！", defaults.theme.errMsgColor, true);
            }
        };

        var help = function () {
            jQuery(info.help).each(function (i) {
                postSpecial(info.help[i], defaults.theme.resultColor, true);
            });
        };

        var clear = function () {
            $log.html('');
            about();
        };

        var exit = function () {
            TUI.APP.Close();
        };

        var about = function () {
            post("ThingsOS [版本 1.0.1]");
            postSpecial("&copy; 版权所有 2010-2016 ThingsLabs.");
            $input.focus();
        };

        $input.keydown(function (evt) {	// return key
            if (evt.keyCode == 13) {
                var cmdstr = this.value;
                cmdHistory.push(cmdstr);
                cmdHistAt = cmdHistory.length;
                //
                var arg = [];
                var clist = cmdstr.split(" ");
                var cmd = clist[0];
                if (clist.length > 1) {
                    for (i = 1; i < clist.length; i++)
                        arg.push(clist[i]);
                }
                //
                log_stop();
                //
                if (cmd.toLowerCase() == 'cls' || cmd.toLowerCase() == 'clear') {
                    clear();
                    this.value = '';
                }
                else if (cmd.toLowerCase() == 'info' || cmd.toLowerCase() == 'about') {
                    post('> ' + cmdstr);
                    about();
                    this.value = '';
                }
                else if (cmd.toLowerCase() == 'help' || cmd.toLowerCase() == '?' || cmd.toLowerCase() == 'h') {
                    post('> ' + cmdstr);
                    help();
                    this.value = '';
                }
                else if (cmd.toLowerCase() == 'log') {
                    post('> ' + cmdstr);
                    log(arg);
                    this.value = '';
                }
                else if (cmd.toLowerCase() == 'mail') {
                    post('> ' + cmdstr);
                    mail(arg);
                    this.value = '';
                }
                else if (cmd.toLowerCase() == 'sms') {
                    post('> ' + cmdstr);
                    sms(arg);
                    this.value = '';
                }
                else if (cmd.toLowerCase() == 'exit') {
                    post('> ' + cmdstr);
                    exit();
                    this.value = '';
                }
                else if (cmd == '') {
                    this.value = '';
                }
                else {
                    try {
                        post('> ' + cmdstr);
                        post((eval(cmd).toString()), defaults.theme.resultColor, true);
                    }
                    catch (e) {
                        post(e.toString(), defaults.theme.errMsgColor, true);
                    }
                    finally {
                        this.value = '';
                    }
                }
                $input.focus();
            }
            // command history
            else if (evt.keyCode == 38) { // upkey
                if (cmdHistAt > 0) {
                    cmdHistAt--;
                    this.value = cmdHistory[cmdHistAt];
                }
            }
            else if (evt.keyCode == 40) { // downkey
                if (cmdHistAt < cmdHistory.length - 1) {
                    cmdHistAt++;
                    this.value = cmdHistory[cmdHistAt];
                }
            }
        });
        var $container = jQuery('<div/>')
			.css(defaults.theme.mainStyle)
			.appendTo(document.body)
			.append($log).append($input);
        window.__JCONSOL__ = $container;
        //
        about();
    };

    init();
};