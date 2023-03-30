/*************************************************************************
*
*			Array 对象的扩展
*
**************************************************************************/
Array.prototype.IndexOf = function (obj) {
    var result = -1;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            result = i;
            break;
        }
    }
    return result;
}

Array.prototype.IsContain = function (obj) {
    return (this.IndexOf(obj) >= 0);
}

Array.prototype.Append = function (obj, nodup) {
    if (nodup == null) {
        nodup = true;
    }
    if (!(nodup && this.IsContain(obj))) {
        this[this.length] = obj;
    }
}


function RemoveArray(array, attachId) {
    for (var i = 0, n = 0; i < array.length; i++) {
        if (array[i] != attachId) {
            array[n++] = array[i]
        }
    }
    array.length -= 1;
}

Array.prototype.remove = function (obj) {
    return RemoveArray(this, obj);
};
/*************************************************************************
*
*			Date 对象的扩展
*
**************************************************************************/
Date.prototype.Format = function (format) {
    /// <summary>格式化时间为字符串</summary>
    /// <param name="format" type="string">必需。例如："YYYY-MM-dd hh:mm:ss",其中M表示月，d表示日，h表示小时，m表示分钟，s表示秒，q表示季度，S表示毫秒</param>
    /// <returns type="string">返回对应格式时间</returns>
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour
        "m+": this.getMinutes(),  //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

Date.prototype.DateAdd = function (interval, number) {
    /// <summary>计算时间偏移,例如:var tc = now.DateAdd("y",1);</summary>
    /// <param name="interval" type="string">必需。y表示年，m表示年，d表示日，w表示周，h表示小时，n表示分钟，s表示秒，l表示毫秒</param>
    /// <param name="number" type="int">必需。可以为负值</param>
    /// <returns type="datetime">返回时间对象</returns>
    number = parseInt(number);
    var date = new Date();
    //
    switch (interval) {
        case "y": date.setFullYear(this.getFullYear() + number); break;
        case "m": date.setMonth(this.getMonth() + number); break;
        case "d": date.setDate(this.getDate() + number); break;
        case "w": date.setDate(this.getDate() + 7 * number); break;
        case "h": date.setHours(this.getHours() + number); break;
        case "n": date.setMinutes(this.getMinutes() + number); break;
        case "s": date.setSeconds(this.getSeconds() + number); break;
        case "l": date.setMilliseconds(this.getMilliseconds() + number); break;
    }
    return date;
}
/*************************************************************************
*
*			SmartOS人机交互全局命名空间
*
**************************************************************************/
var FUI = {};
/*************************************************************************
*
*			定义命名空间的方法
*
**************************************************************************/
FUI.namespace = function (ns) {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = ("" + a[i]).split(".");
        o = FUI;

        // SmartOS is implied, so it is ignored if it is included
        for (j = (d[0] == "FUI") ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }

    return o;
};

FUI.ns = FUI.namespace;

/*************************************************************************
*
*			继承对象类型的方法
*
**************************************************************************/
FUI.hasOwnProperty = (Object.prototype.hasOwnProperty) ?
    function (o, prop) {
        return o && o.hasOwnProperty && o.hasOwnProperty(prop);
    } : function (o, prop) {
        return !FUI.Utils.isUndefined(o[prop]) &&
                o.constructor.prototype[prop] !== o[prop];
    };

FUI.extend = function (subc, superc, overrides) {
    if (!superc || !subc) {
        throw new Error("extend failed, please check that " +
						"all dependencies are included.");
    }
    var f = function () { }, i;
    f.prototype = superc.prototype;
    subc.prototype = new f();
    subc.prototype.constructor = subc;
    subc.superclass = superc.prototype;
    if (superc.prototype.constructor == Object.prototype.constructor) {
        superc.prototype.constructor = superc;
    }

    if (overrides) {
        for (i in overrides) {
            if (FUI.hasOwnProperty(overrides, i)) {
                subc.prototype[i] = overrides[i];
            }
        }
        FUI.Utils._IEEnumFix(subc.prototype, overrides);
    }
};
/*************************************************************************
*
*			JSON处理的方法（encode，decode，toDate）
*
**************************************************************************/
FUI.JSON = new function () {
    this.errorCode = 0;
    this.errorText = "";
    /* Section: Methods - Public */

    /*
    Method: decode
    decodes a valid JSON encoded string.
	
    Arguments:
    [String / Function] - Optional JSON string to decode or a filter function if method is a String prototype.
    [Function] - Optional filter function if first argument is a JSON string and this method is not a String prototype.
	
    Returns:
    Object - Generic JavaScript variable or undefined
	
    Example [Basic]:
    >var	arr = JSON.decode('[1,2,3]');
    >alert(arr);	// 1,2,3
    >
    >arr = JSON.decode('[1,2,3]', function(key, value){return key * value});
    >alert(arr);	// 0,2,6
	
    Example [Prototype]:
    >String.prototype.parseJSON = JSON.decode;
    >
    >alert('[1,2,3]'.parseJSON());	// 1,2,3
    >
    >try {
    >	alert('[1,2,3]'.parseJSON(function(key, value){return key * value}));
    >	// 0,2,6
    >}
    >catch(e) {
    >	alert(e.message);
    >}
	
    Note:
    Internet Explorer 5 and other old browsers should use a different regular expression to check if a JSON string is valid or not.
    This old browsers dedicated RegExp is not safe as native version is but it required for compatibility.
    */

    this.decode = function () {
        var filter, result, self, tmp;
        if ($$("toString")) {
            switch (arguments.length) {
                case 2:
                    self = arguments[0];
                    filter = arguments[1];
                    break;
                case 1:
                    if ($[typeof arguments[0]](arguments[0]) === Function) {
                        self = this;
                        filter = arguments[0];
                    }
                    else
                        self = arguments[0];
                    break;
                default:
                    self = this;
                    break;
            };
            if (rc.test(self)) {
                try {
                    result = e("(".concat(self, ")"));
                    if (filter && result !== null && (tmp = $[typeof result](result)) && (tmp === Array || tmp === Object)) {
                        for (self in result)
                            result[self] = v(self, result) ? filter(self, result[self]) : result[self];
                    }
                }
                catch (z) { }
            }
            else {
                throw new Error("bad json data");
            }
        };
        return result;
    };

    /*
    Method: encode
    encode a generic JavaScript variable into a valid JSON string.
	
    Arguments:
    [Object] - Optional generic JavaScript variable to encode if method is not an Object prototype.
	
    Returns:
    String - Valid JSON string or undefined
	
    Example [Basic]:
    >var	s = JSON.encode([1,2,3]);
    >alert(s);	// [1,2,3]
	
    Example [Prototype]:
    >Object.prototype.toJSONString = JSON.encode;
    >
    >alert([1,2,3].toJSONString());	// [1,2,3]
    */
    this.encode = function () {
        var self = arguments.length ? arguments[0] : this,
			result, tmp;
        if (self === null)
            result = "null";
        else if (self !== undefined && (tmp = $[typeof self](self))) {
            switch (tmp) {
                case Array:
                    result = [];
                    for (var i = 0, j = 0, k = self.length; j < k; j++) {
                        if (self[j] !== undefined && (tmp = this.encode(self[j])))
                            result[i++] = tmp;
                    };
                    result = "[".concat(result.join(","), "]");
                    break;
                case Boolean:
                    result = String(self);
                    break;
                case Date:
                    result = '"'.concat(self.getFullYear(), '-', d(self.getMonth() + 1), '-', d(self.getDate()), 'T', d(self.getHours()), ':', d(self.getMinutes()), ':', d(self.getSeconds()), '"');
                    break;
                case Function:
                    break;
                case Number:
                    result = isFinite(self) ? String(self) : "null";
                    break;
                case String:
                    result = '"'.concat(self.replace(rs, s).replace(ru, u), '"');
                    break;
                default:
                    var i = 0, key;
                    result = [];
                    for (key in self) {
                        if (self[key] !== undefined && (tmp = this.encode(self[key])))
                            result[i++] = '"'.concat(key.replace(rs, s).replace(ru, u), '":', tmp);
                    };
                    result = "{".concat(result.join(","), "}");
                    break;
            }
        };
        return result;
    };

    /*
    Method: toDate
    transforms a JSON encoded Date string into a native Date object.
	
    Arguments:
    [String/Number] - Optional JSON Date string or server time if this method is not a String prototype. Server time should be an integer, based on seconds since 1970/01/01 or milliseconds / 1000 since 1970/01/01.
	
    Returns:
    Date - Date object or undefined if string is not a valid Date
	
    Example [Basic]:
    >var	serverDate = JSON.toDate("2007-04-05T08:36:46");
    >alert(serverDate.getMonth());	// 3 (months start from 0)
	
    Example [Prototype]:
    >String.prototype.parseDate = JSON.toDate;
    >
    >alert("2007-04-05T08:36:46".parseDate().getDate());	// 5

    */

    this.toDate = function () {
        var self = arguments.length ? arguments[0] : this, result;
        if (rd.test(self)) {
            result = new Date;
            result.setHours(i(self, 11, 2));
            result.setMinutes(i(self, 14, 2));
            result.setSeconds(i(self, 17, 2));
            result.setMonth(i(self, 5, 2) - 1);
            result.setDate(i(self, 8, 2));
            result.setFullYear(i(self, 0, 4));
        }
        else if (rt.test(self))
            result = new Date(self * 1000);
        return result;
    };

    /* Section: Properties - Private */

    /*
    Property: Private
	
    List:
    Object - 'c' - a dictionary with useful keys / values for fast encode convertion
    Function - 'd' - returns decimal string rappresentation of a number ("14", "03", etc)
    Function - 'e' - safe and native code evaulation
    Function - 'i' - returns integer from string ("01" => 1, "15" => 15, etc)
    Array - 'p' - a list with different "0" strings for fast special chars escape convertion
    RegExp - 'rc' - regular expression to check JSON strings (different for IE5 or old browsers and new one)
    RegExp - 'rd' - regular expression to check a JSON Date string
    RegExp - 'rs' - regular expression to check string chars to modify using c (char) values
    RegExp - 'rt' - regular expression to check integer numeric string (for toDate time version evaluation)
    RegExp - 'ru' - regular expression to check string chars to escape using "\u" prefix
    Function - 's' - returns escaped string adding "\\" char as prefix ("\\" => "\\\\", etc.)
    Function - 'u' - returns escaped string, modifyng special chars using "\uNNNN" notation
    Function - 'v' - returns boolean value to skip object methods or prototyped parameters (length, others), used for optional decode filter function
    Function - '$' - returns object constructor if it was not cracked (someVar = {}; someVar.constructor = String <= ignore them)
    Function - '$$' - returns boolean value to check native Array and Object constructors before convertion
    */
    var c = { "\b": "b", "\t": "t", "\n": "n", "\f": "f", "\r": "r", '"': '"', "\\": "\\", "/": "/" },
		d = function (n) { return n < 10 ? "0".concat(n) : n },
		e = function (c, f, e) { e = eval; delete eval; if (typeof eval === "undefined") eval = e; f = eval("" + c); eval = e; return f },
		i = function (e, p, l) { return 1 * e.substr(p, l) },
		p = ["", "000", "00", "0", ""],
		rc = null,
		rd = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
		rs = /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
		rt = /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
		ru = /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
		s = function (i, d) { return "\\".concat(c[d]) },
		u = function (i, d) {
		    var n = d.charCodeAt(0).toString(16);
		    return "\\u".concat(p[n.length], n)
		},
		v = function (k, v) { return $[typeof result](result) !== Function && (v.hasOwnProperty ? v.hasOwnProperty(k) : v.constructor.prototype[k] !== v[k]) },
		$ = {
		    "boolean": function () { return Boolean },
		    "function": function () { return Function },
		    "number": function () { return Number },
		    "object": function (o) { return o instanceof o.constructor ? o.constructor : null },
		    "string": function () { return String },
		    "undefined": function () { return null }
		},
		$$ = function (m) {
		    function $(c, t) { t = c[m]; delete c[m]; try { e(c) } catch (z) { c[m] = t; return 1 } };
		    return $(Array) && $(Object)
		};
    try { rc = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$') }
    catch (z) { rc = /^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/ }
};

/*****************************************************************************************
*
*			浏览器端环境
*
*******************************************************************************************/
FUI.env = FUI.env || {};

/**
* parses a user agent string (or looks for one in navigator to parse if
* not supplied).
* @method parseUA
* @since 2.9.0
* @static
*/
FUI.env.parseUA = function (agent) {

    var numberify = function (s) {
        var c = 0;
        return parseFloat(s.replace(/\./g, function () {
            return (c++ == 1) ? '' : '.';
        }));
    },

        nav = navigator,

        o = {

            /**
            * Internet Explorer version number or 0.  Example: 6
            * @property ie
            * @type float
            * @static
            */
            ie: 0,

            /**
            * Opera version number or 0.  Example: 9.2
            * @property opera
            * @type float
            * @static
            */
            opera: 0,

            /**
            * Gecko engine revision number.  Will evaluate to 1 if Gecko
            * is detected but the revision could not be found. Other browsers
            * will be 0.  Example: 1.8
            * <pre>
            * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
            * Firefox 1.5.0.9: 1.8.0.9 <-- 1.8
            * Firefox 2.0.0.3: 1.8.1.3 <-- 1.81
            * Firefox 3.0   <-- 1.9
            * Firefox 3.5   <-- 1.91
            * </pre>
            * @property gecko
            * @type float
            * @static
            */
            gecko: 0,

            /**
            * AppleWebKit version.  KHTML browsers that are not WebKit browsers
            * will evaluate to 1, other browsers 0.  Example: 418.9
            * <pre>
            * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the
            *                                   latest available for Mac OSX 10.3.
            * Safari 2.0.2:         416     <-- hasOwnProperty introduced
            * Safari 2.0.4:         418     <-- preventDefault fixed
            * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
            *                                   different versions of webkit
            * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
            *                                   updated, but not updated
            *                                   to the latest patch.
            * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native
            * SVG and many major issues fixed).
            * Safari 3.0.4 (523.12) 523.12  <-- First Tiger release - automatic
            * update from 2.x via the 10.4.11 OS patch.
            * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
            *                                   yahoo.com user agent hack removed.
            * </pre>
            * http://en.wikipedia.org/wiki/Safari_version_history
            * @property webkit
            * @type float
            * @static
            */
            webkit: 0,

            /**
            * Chrome will be detected as webkit, but this property will also
            * be populated with the Chrome version number
            * @property chrome
            * @type float
            * @static
            */
            chrome: 0,

            /**
            * The mobile property will be set to a string containing any relevant
            * user agent information when a modern mobile browser is detected.
            * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
            * devices with the WebKit-based browser, and Opera Mini.
            * @property mobile
            * @type string
            * @static
            */
            mobile: null,

            /**
            * Adobe AIR version number or 0.  Only populated if webkit is detected.
            * Example: 1.0
            * @property air
            * @type float
            */
            air: 0,
            /**
            * Detects Apple iPad's OS version
            * @property ipad
            * @type float
            * @static
            */
            ipad: 0,
            /**
            * Detects Apple iPhone's OS version
            * @property iphone
            * @type float
            * @static
            */
            iphone: 0,
            /**
            * Detects Apples iPod's OS version
            * @property ipod
            * @type float
            * @static
            */
            ipod: 0,
            /**
            * General truthy check for iPad, iPhone or iPod
            * @property ios
            * @type float
            * @static
            */
            ios: null,
            /**
            * Detects Googles Android OS version
            * @property android
            * @type float
            * @static
            */
            android: 0,
            /**
            * Detects Palms WebOS version
            * @property webos
            * @type float
            * @static
            */
            webos: 0,

            /**
            * Google Caja version number or 0.
            * @property caja
            * @type float
            */
            caja: nav && nav.cajaVersion,

            /**
            * Set to true if the page appears to be in SSL
            * @property secure
            * @type boolean
            * @static
            */
            secure: false,
            /**
            *
            * support html5
            *
            */
            html5: false,
            /**
            *
            * support touch
            *
            */
            ontouch: false,
            /**
            * The operating system.  Currently only detecting windows or macintosh
            * @property os
            * @type string
            * @static
            */
            os: null

        },

    ua = agent || (navigator && navigator.userAgent),

    loc = window && window.location,

    href = loc && loc.href,

    m;

    o.secure = href && (href.toLowerCase().indexOf("https") === 0);
    o.html5 = !!document.createElement("canvas").getContext;
    o.ontouch = 'ontouchend' in document;

    if (ua) {

        if ((/windows|win32/i).test(ua)) {
            o.os = 'windows';
        } else if ((/macintosh/i).test(ua)) {
            o.os = 'macintosh';
        } else if ((/rhino/i).test(ua)) {
            o.os = 'rhino';
        }

        // Modern KHTML browsers should qualify as Safari X-Grade
        if ((/KHTML/).test(ua)) {
            o.webkit = 1;
        }
        // Modern WebKit browsers are at least X-Grade
        m = ua.match(/AppleWebKit\/([^\s]*)/);
        if (m && m[1]) {
            o.webkit = numberify(m[1]);

            // Mobile browser check
            if (/ Mobile\//.test(ua)) {
                o.mobile = 'Apple'; // iPhone or iPod Touch

                m = ua.match(/OS ([^\s]*)/);
                if (m && m[1]) {
                    m = numberify(m[1].replace('_', '.'));
                }
                o.ios = m;
                o.ipad = o.ipod = o.iphone = 0;

                m = ua.match(/iPad|iPod|iPhone/);
                if (m && m[0]) {
                    o[m[0].toLowerCase()] = o.ios;
                }
            } else {
                m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                if (m) {
                    // Nokia N-series, Android, webOS, ex: NokiaN95
                    o.mobile = m[0];
                }
                if (/webOS/.test(ua)) {
                    o.mobile = 'WebOS';
                    m = ua.match(/webOS\/([^\s]*);/);
                    if (m && m[1]) {
                        o.webos = numberify(m[1]);
                    }
                }
                if (/ Android/.test(ua) || /ipad; u;/.test(ua)) {
                    o.mobile = 'Android';
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        o.android = numberify(m[1]);
                    }

                }
            }

            m = ua.match(/Chrome\/([^\s]*)/);
            if (m && m[1]) {
                o.chrome = numberify(m[1]); // Chrome
            } else {
                m = ua.match(/AdobeAIR\/([^\s]*)/);
                if (m) {
                    o.air = m[0]; // Adobe AIR 1.0 or better
                }
            }
        }

        if (!o.webkit) { // not webkit
            // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
            m = ua.match(/Opera[\s\/]([^\s]*)/);
            if (m && m[1]) {
                o.opera = numberify(m[1]);
                m = ua.match(/Version\/([^\s]*)/);
                if (m && m[1]) {
                    o.opera = numberify(m[1]); // opera 10+
                }
                m = ua.match(/Opera Mini[^;]*/);
                if (m) {
                    o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                }
            } else { // not opera or webkit
                m = ua.match(/MSIE\s([^;]*)/);
                if (m && m[1]) {
                    o.ie = numberify(m[1]);
                } else { // not opera, webkit, or ie
                    m = ua.match(/Gecko\/([^\s]*)/);
                    if (m) {
                        o.gecko = 1; // Gecko detected, look for revision
                        m = ua.match(/rv:([^\s\)]*)/);
                        if (m && m[1]) {
                            o.gecko = numberify(m[1]);
                        }
                    }
                }
            }
        }
    }

    return o;
};

FUI.env.ua = FUI.env.parseUA();

if (window != top) {
    FUI.env.us = top.FUI.env.us
    FUI.env.log = top.FUI.env.log
}
else {
    FUI.env.log = [];
}
/*****************************************************************************************
*
*			扩展方法工具包
*
*******************************************************************************************/
FUI.Utils = new function () {
    var keyStr = "ABCDEFGHIJKLMNOP" +
                "QRSTUVWXYZabcdef" +
                "ghijklmnopqrstuv" +
                "wxyz0123456789+/" +
                "=",
    OP = Object.prototype,
	ARRAY_TOSTRING = '[object Array]',
    FUNCTION_TOSTRING = '[object Function]',
    OBJECT_TOSTRING = '[object Object]',
    NOTHING = [],

    HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    },

    // ADD = ["toString", "valueOf", "hasOwnProperty"],
    ADD = ["toString", "valueOf"];

    /* Section: Methods - Public */
    /**
    * Determines wheather or not the provided object is an array.
    * @method isArray
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isArray = function (o) {
        return OP.toString.apply(o) === ARRAY_TOSTRING;
    };

    /**
    * Determines whether or not the provided object is a boolean
    * @method isBoolean
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isBoolean = function (o) {
        return typeof o === 'boolean';
    };

    /**
    * Determines whether or not the provided object is a function.
    * Note: Internet Explorer thinks certain functions are objects:
    *
    * var obj = document.createElement("object");
    * FUI.lang.isFunction(obj.getAttribute) // reports false in IE
    *
    * var input = document.createElement("input"); // append to body
    * FUI.lang.isFunction(input.focus) // reports false in IE
    *
    * You will have to implement additional tests if these functions
    * matter to you.
    *
    * @method isFunction
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isFunction = function (o) {
        return (typeof o === 'function') || OP.toString.apply(o) === FUNCTION_TOSTRING;
    };

    /**
    * Determines whether or not the provided object is null
    * @method isNull
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isNull = function (o) {
        return o === null;
    };

    /**
    * Determines whether or not the provided object is a legal number
    * @method isNumber
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isNumber = function (o) {
        return typeof o === 'number' && isFinite(o);
    };

    /**
    * Determines whether or not the provided object is of type object
    * or function
    * @method isObject
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isObject = function (o) {
        return (o && (typeof o === 'object' || this.isFunction(o))) || false;
    };

    /**
    * Determines whether or not the provided object is a string
    * @method isString
    * @param {any} o The object being testing
    * @return {boolean} the result
    */
    this.isString = function (o) {
        return typeof o === 'string';
    };

    this.isUndefined = function (o) {
        return typeof o === 'undefined';
    };

    /**
    * Returns a string without any leading or trailing whitespace.  If
    * the input is not a string, the input will be returned untouched.
    * @method trim
    * @since 2.3.0
    * @param s {string} the string to trim
    * @return {string} the trimmed string
    */
    this.trim = function (s) {
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch (e) {
            return s;
        }
    };

    /**
    * A convenience method for detecting a legitimate non-null value.
    * Returns false for null/undefined/NaN, true for other values,
    * including 0/false/''
    * @method isValue
    * @since 2.3.0
    * @param o {any} the item to test
    * @return {boolean} true if it is not null/undefined/NaN || false
    */
    this.isValue = function (o) {
        // return (o || o === false || o === 0 || o === ''); // Infinity fails
        return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
    };

    //校验是否全由数字组成 
    this.isDigit = function (s) {
        var patrn = /^[0-9]{1,20}$/;
        if (!patrn.exec(s))
            return false;

        return true;
    }

    //校验密码：只能输入6-20个字母、数字、下划线  
    this.isPasswd = function (s) {
        var patrn = /^(\w){6,20}$/;
        if (!patrn.exec(s))
            return false;
        return true;
    }

    //校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”  
    this.isTel = function (s) {
        var patrn = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
        if (!patrn.exec(s))
            return false;
        return true;
    }

    //校验手机号码：必须以数字开头，除数字外，可含有“-”  
    this.isMobil = function (s) {
        var patrn = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
        if (!patrn.exec(s))
            return false;
        return true;
    }


    this.isIPAddr = function (s) //by zergling  
    {
        var patrn = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
        if (!patrn.exec(s))
            return false;
        return true;
    }

    /**
    * IE will not enumerate native functions in a derived object even if the
    * function was overridden.  This is a workaround for specific functions
    * we care about on the Object prototype.
    * @property _IEEnumFix
    * @param {Function} r  the object to receive the augmentation
    * @param {Function} s  the object that supplies the properties to augment
    * @static
    * @private
    */
    this._IEEnumFix = (FUI.env.ua.ie) ? function (r, s) {
        var i, fname, f;
        for (i = 0; i < ADD.length; i = i + 1) {

            fname = ADD[i];
            f = s[fname];

            if (this.isFunction(f) && f != OP[fname]) {
                r[fname] = f;
            }
        }
    } : function () { };
    /*
    Method: parseDate
    transforms a encoded Date string into a native Date object.
	
    Arguments:
    [String/Number] - Optional Date string or server time if this method is not a String prototype. Server time should be an integer, based on seconds since 1970/01/01 or milliseconds / 1000 since 1970/01/01.
	
    Returns:
    Date - Date object or undefined if string is not a valid Date
	
    Example [Basic]:
    >var	serverDate = Utils.parseDate("2007-04-05 08:36:46");
    >alert(serverDate.getMonth());	// 3 (months start from 0)

    */

    this.parseDate = function (str) {
        if (typeof str == 'string') {
            var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
            if (results && results.length > 3)
                return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10));
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}) *$/);
            if (results && results.length > 5)
                return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10));
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
            if (results && results.length > 6)
                return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10));
            results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
            if (results && results.length > 7)
                return new Date(parseInt(results[1], 10), parseInt(results[2], 10) - 1, parseInt(results[3], 10), parseInt(results[4], 10), parseInt(results[5], 10), parseInt(results[6], 10), parseInt(results[7], 10));
        }
        else if (typeof str == 'number') {
            return new Date(str * 1000);
        }
        return null;
    };
    //输出调试日志
    this.log = function (msg, cat, src) {
        if (FUI.Utils.isUndefined(msg))
            return;
        if (FUI.Utils.isUndefined(cat))
            cat = "info";
        if (FUI.Utils.isUndefined(src))
            src = window.location.pathname;
        //
        var tc = new Date();
        if (FUI.env.log.length > 1024) {
            FUI.env.log.shift();
        }
        FUI.env.log.push({ msg: tc.Format("hh:mm:ss.S") + " " + msg, cat: cat, src: src, type: "text" });
        //
    };
    //Base64编码
    this.encode64 = function (input) {
        input = escape(input).replace(/\+/g, '%2B');
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
			keyStr.charAt(enc1) +
			keyStr.charAt(enc2) +
			keyStr.charAt(enc3) +
			keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    };
    //Base64解码
    this.decode64 = function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
			   "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='\n" +
			   "Expect errors in decoding.");
        }


        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");


        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);


        return unescape(output);
    };

    /**
    * 数字对象的格式化;
    */
    this.formatNumber = function (num, pattern) {
        var strarr = num ? num.toString().split('.') : ['0'];
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr = '';

        // 整数部分  
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length - 1;
        var comma = false;
        for (var f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0':
                    if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                    else retstr = '0' + retstr;
                    break;
                case ',':
                    comma = true;
                    retstr = ',' + retstr;
                    break;
            }
        }
        if (i >= 0) {
            if (comma) {
                var l = str.length;
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr;
                    if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
                }
            }
            else retstr = str.substr(0, i + 1) + retstr;
        }

        retstr = retstr + '.';
        // 处理小数部分  
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (var f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i < str.length) retstr += str.substr(i++, 1);
                    break;
                case '0':
                    if (i < str.length) retstr += str.substr(i++, 1);
                    else retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    };

    //计算字符串Hash值
    var hexcase = 0;
    var b64pad = "";
    var chrsz = 8;
    this.hex_sha1 = function (s) { return binb2hex(core_sha1(str2binb(s), s.length * chrsz)); }
    this.hex_hmac_sha1 = function (key, data) { return binb2hex(core_hmac_sha1(key, data)); }

    function core_sha1(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for (var j = 0; j < 80; j++) {
                if (j < 16) w[j] = x[i + j];
                else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = rol(b, 30);
                b = a;
                a = t;
            }

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
            e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);

    }
    function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | ((~b) & d);
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    }
    function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
         (t < 60) ? -1894007588 : -899497514;
    }
    function core_hmac_sha1(key, data) {
        var bkey = str2binb(key);
        if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
        return core_sha1(opad.concat(hash), 512 + 160);
    }
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
        return bin;
    }
    function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
           hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return str;
    }

    /*
    Method: varDump
    print a native Date object to string.
	
    Arguments:
    [object data,addwhitespace,safety,level].
	
    Returns:
    String or Html
	
    Example:
    >var aa="sddd";
    >var bb={a:1,b:34.5,df:aa};
    >var cc={x:bb,aa:1};
    >alert(Utils.varDump(cc,"html",5));

    */
    this.dump = function (object, cat, src) {
        if (FUI.Utils.isUndefined(cat))
            cat = "info";
        if (FUI.Utils.isUndefined(src))
            src = window.location.pathname;
        //
        var tc = new Date();
        if (FUI.env.log.length > 1024) {
            FUI.env.log.shift();
        }
        //
        var st = typeof showTypes == 'undefined' ? true : showTypes;
        var dumpHtml = (/string|number|undefined|boolean/.test(typeof (object)) || object == null) ? object : recurse(object, typeof object);
        //
        FUI.env.log.push({ msg: dumpHtml, cat: cat, src: tc.Format("hh:mm:ss.S") + " " + cat + " [" + src + "]", type: "html" });
        //
        function recurse(o, type) {
            var i;
            var j = 0;
            var r = '';
            type = _dumpType(o);
            switch (type) {
                case 'regexp':
                    var t = type;
                    r += '<table' + _dumpStyles(t, 'table') + '><tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
                    r += '<tr><td colspan="2"' + _dumpStyles(t, 'td-value') + '><table' + _dumpStyles('arguments', 'table') + '><tr><td' + _dumpStyles('arguments', 'td-key') + '><i>RegExp: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o + '</td></tr></table>';
                    j++;
                    break;
                case 'date':
                    var t = type;
                    r += '<table' + _dumpStyles(t, 'table') + '><tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
                    r += '<tr><td colspan="2"' + _dumpStyles(t, 'td-value') + '><table' + _dumpStyles('arguments', 'table') + '><tr><td' + _dumpStyles('arguments', 'td-key') + '><i>Date: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o + '</td></tr></table>';
                    j++;
                    break;
                case 'function':
                    var t = type;
                    var a = o.toString().match(/^.*function.*?\((.*?)\)/im);
                    var args = (a == null || typeof a[1] == 'undefined' || a[1] == '') ? 'none' : a[1];
                    r += '<table' + _dumpStyles(t, 'table') + '><tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
                    r += '<tr><td colspan="2"' + _dumpStyles(t, 'td-value') + '><table' + _dumpStyles('arguments', 'table') + '><tr><td' + _dumpStyles('arguments', 'td-key') + '><i>Arguments: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + args + '</td></tr><tr><td' + _dumpStyles('arguments', 'td-key') + '><i>Function: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o + '</td></tr></table>';
                    j++;
                    break;
                case 'domelement':
                    var t = type;
                    r += '<table' + _dumpStyles(t, 'table') + '><tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
                    r += '<tr><td' + _dumpStyles(t, 'td-key') + '><i>Node Name: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o.nodeName.toLowerCase() + '</td></tr>';
                    r += '<tr><td' + _dumpStyles(t, 'td-key') + '><i>Node Type: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o.nodeType + '</td></tr>';
                    r += '<tr><td' + _dumpStyles(t, 'td-key') + '><i>Node Value: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o.nodeValue + '</td></tr>';
                    r += '<tr><td' + _dumpStyles(t, 'td-key') + '><i>innerHTML: </i></td><td' + _dumpStyles(type, 'td-value') + '>' + o.innerHTML + '</td></tr>';
                    j++;
                    break;
            }
            if (/object|array/.test(type)) {
                for (i in o) {
                    var t = _dumpType(o[i]);
                    if (j < 1) {
                        r += '<table' + _dumpStyles(type, 'table') + '><tr><th colspan="2"' + _dumpStyles(type, 'th') + '>' + type + '</th></tr>';
                        j++;
                    }
                    if (typeof o[i] == 'object' && o[i] != null) {
                        r += '<tr><td' + _dumpStyles(type, 'td-key') + '>' + i + (st ? ' [' + t + ']' : '') + '</td><td' + _dumpStyles(type, 'td-value') + '>' + recurse(o[i], t) + '</td></tr>';
                    } else if (typeof o[i] == 'function') {
                        r += '<tr><td' + _dumpStyles(type, 'td-key') + '>' + i + (st ? ' [' + t + ']' : '') + '</td><td' + _dumpStyles(type, 'td-value') + '>' + recurse(o[i], t) + '</td></tr>';
                    } else {
                        r += '<tr><td' + _dumpStyles(type, 'td-key') + '>' + i + (st ? ' [' + t + ']' : '') + '</td><td' + _dumpStyles(type, 'td-value') + '>' + o[i] + '</td></tr>';
                    }
                }
            }
            if (j == 0) {
                r += '<table' + _dumpStyles(type, 'table') + '><tr><th colspan="2"' + _dumpStyles(type, 'th') + '>' + type + ' [empty]</th></tr>';
            }
            r += '</table>';
            return r;
        };

        function _dumpStyles(type, use) {
            var r = '';
            var table = 'font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;cell-spacing:2px;';
            var th = 'font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;text-align:left;color: white;padding: 5px;vertical-align :top;cursor:hand;cursor:pointer;';
            var td = 'font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;';
            var thScript = 'onClick="tTable(this);" title="click to collapse"';
            var tdScript = 'onClick="tRow(this);" title="click to collapse"';
            switch (type) {
                case 'string':
                case 'number':
                case 'boolean':
                case 'undefined':
                case 'object':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#0000cc;"';
                            break;
                        case 'th':
                            r = ' style="' + th + 'background-color:#4444cc;"' + thScript;
                            break;
                        case 'td-key':
                            r = ' style="' + td + 'background-color:#ccddff;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                        case 'td-value':
                            r = ' style="' + td + 'background-color:#fff;"';
                            break;
                    }
                    break;
                case 'array':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#006600;"';
                            break;
                        case 'th':
                            r = ' style="' + th + 'background-color:#009900;"' + thScript;
                            break;
                        case 'td-key':
                            r = ' style="' + td + 'background-color:#ccffcc;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                        case 'td-value':
                            r = ' style="' + td + 'background-color:#fff;"';
                            break;
                    }
                    break;
                case 'function':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#aa4400;"';
                            break;
                        case 'th':
                            r = ' style="' + th + 'background-color:#cc6600;"' + thScript;
                            break;
                        case 'td-key':
                            r = ' style="' + td + 'background-color:#fff;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                        case 'td-value':
                            r = ' style="' + td + 'background-color:#fff;"';
                            break;
                    }
                    break;
                case 'arguments':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#dddddd;cell-spacing:3;"';
                            break;
                        case 'td-key':
                            r = ' style="' + th + 'background-color:#eeeeee;color:#000000;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                    }
                    break;
                case 'regexp':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#CC0000;cell-spacing:3;"';
                            break;
                        case 'th':
                            r = ' style="' + th + 'background-color:#FF0000;"' + thScript;
                            break;
                        case 'td-key':
                            r = ' style="' + th + 'background-color:#FF5757;color:#000000;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                        case 'td-value':
                            r = ' style="' + td + 'background-color:#fff;"';
                            break;
                    }
                    break;
                case 'date':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#663399;cell-spacing:3;"';
                            break;
                        case 'th':
                            r = ' style="' + th + 'background-color:#9966CC;"' + thScript;
                            break;
                        case 'td-key':
                            r = ' style="' + th + 'background-color:#B266FF;color:#000000;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                        case 'td-value':
                            r = ' style="' + td + 'background-color:#fff;"';
                            break;
                    }
                    break;
                case 'domelement':
                    switch (use) {
                        case 'table':
                            r = ' style="' + table + 'background-color:#FFCC33;cell-spacing:3;"';
                            break;
                        case 'th':
                            r = ' style="' + th + 'background-color:#FFD966;"' + thScript;
                            break;
                        case 'td-key':
                            r = ' style="' + th + 'background-color:#FFF2CC;color:#000000;cursor:hand;cursor:pointer;"' + tdScript;
                            break;
                        case 'td-value':
                            r = ' style="' + td + 'background-color:#fff;"';
                            break;
                    }
                    break;
            }
            return r;
        };
        function _dumpType(obj) {
            var t = typeof (obj);
            if (t == 'function') {
                var f = obj.toString();
                if ((/^\/.*\/[gi]??[gi]??$/).test(f)) {
                    return 'regexp';
                } else if ((/^\[object.*\]$/i).test(f)) {
                    t = 'object'
                }
            }
            if (t != 'object') {
                return t;
            }
            switch (obj) {
                case null:
                    return 'null';
                case window:
                    return 'window';
                case document:
                    return document;
                case window.event:
                    return 'event';
            }
            if (window.event && (event.type == obj.type)) {
                return 'event';
            }
            var c = obj.constructor;
            if (c != null) {
                switch (c) {
                    case Array:
                        t = 'array';
                        break;
                    case Date:
                        return 'date';
                    case RegExp:
                        return 'regexp';
                    case Object:
                        t = 'object';
                        break;
                    case ReferenceError:
                        return 'error';
                    default:
                        var sc = c.toString();
                        var m = sc.match(/\s*function (.*)\(/);
                        if (m != null) {
                            return 'object';
                        }
                }
            }
            var nt = obj.nodeType;
            if (nt != null) {
                switch (nt) {
                    case 1:
                        if (obj.item == null) {
                            return 'domelement';
                        }
                        break;
                    case 3:
                        return 'string';
                }
            }
            if (obj.toString != null) {
                var ex = obj.toString();
                var am = ex.match(/^\[object (.*)\]$/i);
                if (am != null) {
                    var am = am[1];
                    switch (am.toLowerCase()) {
                        case 'event':
                            return 'event';
                        case 'nodelist':
                        case 'htmlcollection':
                        case 'elementarray':
                            return 'array';
                        case 'htmldocument':
                            return 'htmldocument';
                    }
                }
            }
            return t;
        };
    };
};

FUI.Comet = new function () {
    var now = new Date();
    var cometTask = [];
    var tunnelID = Math.floor(now.getTime() / 1000);
    var cometID = 0;
    //
    var handle = this;
    var dataObject = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    var eventObject = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    //
    this.errorText = "";
    this.cometStatus = "close";
    this.taskCount = 0;
    //
    this.connect = function () {
        if (eventObject) {
            try {
                eventObject.open("GET", "cometevent.srv?CmdType=Connect&TunnelID=" + tunnelID + "&CometID=0&ReqType=all&ReqStr=all", false);
                //
                eventObject.setRequestHeader("If-Modified-Since", "0");
                eventObject.send(null);
                //
                var cometStatusCode = parseInt(eventObject.responseXML.documentElement.attributes[0].value);
                if (cometStatusCode == 7) {
                    handle.cometStatus = "connect";
                    return true;
                }
            }
            catch (ex) {
                handle.errorText = ex.message;
            }
        }
        return false;
    };
    //
    this.onlisten = function () {
        try {
            dataObject.open("GET", "cometevent.srv?CmdType=Listen&TunnelID=" + tunnelID + "&CometID=0&ReqType=all&ReqStr=all", true);
            dataObject.setRequestHeader("If-Modified-Since", "0");
            //
            dataObject.onreadystatechange = function () {
                if (dataObject.readyState == 4 && dataObject.status == 200) {
                    if (dataObject.responseText == "")//防止防火墙掐断长连接
                    {
                        handle.onlisten();
                        return;
                    }
                    //
                    var cometTunnelID = parseInt(dataObject.responseXML.documentElement.attributes[2].value);
                    if (cometTunnelID != tunnelID) {
                        handle.errorText = "Comet侦听数据异常";
                        handle.close();
                        return;
                    }
                    //
                    var cometStatusCode = parseInt(dataObject.responseXML.documentElement.attributes[0].value);
                    if (cometStatusCode == 4) {
                        handle.cometStatus = "data";
                        for (i = 0; i < cometTask.length; i++) {
                            if (cometTask[i].cometID == parseInt(dataObject.responseXML.documentElement.attributes[3].value)) {
                                handle.onchange = cometTask[i].fn;
                                if (typeof handle.onchange == "function") {
                                    handle.onchange(decodeURIComponent(dataObject.responseXML.getElementsByTagName("CometData")[0].firstChild.nodeValue).replace(/\+/g, ' '));
                                }
                                break;
                            }
                        }
                        //
                        handle.onlisten();
                    }
                    else if (cometStatusCode == 2) {
                        for (i = 0; i < cometTask.length; i++) {
                            if (cometTask[i].cometID == parseInt(dataObject.responseXML.documentElement.attributes[3].value)) {
                                handle.onchange = cometTask[i].fn;
                                if (typeof handle.onchange == "function") {
                                    handle.onchange(decodeURIComponent(dataObject.responseXML.getElementsByTagName("CometData")[0].firstChild.nodeValue).replace(/\+/g, ' '));
                                }
                                //
                                handle.cometStatus = "leave";
                                handle.taskCount--;
                                cometTask.splice(i, 1);
                                break;
                            }
                        }
                        //
                        handle.onlisten();
                    }
                    else if (cometStatusCode == 5) {
                        handle.cometStatus = "close";
                        handle.taskCount = 0;
                        cometTask = [];
                    }
                    else {
                        handle.errorText = "Comet侦听通讯异常";
                        handle.close();
                    }
                }
            };
            dataObject.send(null);
            handle.cometStatus = "onlisten";
            return true;
        }
        catch (ex)//catch the ex 
		{
            handle.errorText = ex.message;
        }
        return false;
    };
    //
    this.onchange = function (result) {
        handle.cometStatus = "data";
    };
    //
    this.close = function () {
        if (eventObject) {
            try {
                eventObject.open("GET", "cometevent.srv?CmdType=Close&TunnelID=" + tunnelID + "&CometID=0&ReqType=all&ReqStr=all", false);
                //
                eventObject.setRequestHeader("If-Modified-Since", "0");
                eventObject.send(null);
                //
                var cometStatusCode = parseInt(eventObject.responseXML.documentElement.attributes[0].value);
                if (cometStatusCode == 7) {
                    handle.cometStatus = "close";
                    handle.taskCount = 0;
                    cometTask = [];
                }
            }
            catch (ex) {
                handle.errorText = ex.message;
            }
        }
    };
    //
    this.addsrv = function (reqType, reqStr, userFunction) {
        if (eventObject) {
            try {
                //
                eventObject.open("GET", "cometevent.srv?CmdType=Join&TunnelID=" + tunnelID + "&CometID=" + cometID + "&ReqType=" + reqType + "&ReqStr=" + encodeURIComponent(reqStr), false);
                eventObject.setRequestHeader("If-Modified-Since", "0");
                eventObject.send(null);
                //
                var cometStatusCode = parseInt(eventObject.responseXML.documentElement.attributes[0].value);
                if (cometStatusCode == 7) {
                    handle.cometStatus = "join";
                    handle.taskCount++;
                    cometTask.push({ reqType: reqType, reqStr: reqStr, fn: userFunction, cometID: cometID });
                    cometID++;
                }
                //
                return true;
            }
            catch (ex) {
                handle.errorText = ex.message;
            }
        }
        //
        return false;
    };
    //
    this.removesrv = function (reqType, reqStr) {
        if (eventObject) {
            try {
                for (i = 0; i < cometTask.length; i++) {
                    if (cometTask[i].reqType = reqType
					    && cometTask[i].reqStr == reqStr) {
                        //
                        eventObject.open("GET", "cometevent.srv?CmdType=Leave&TunnelID=" + tunnelID + "&CometID=" + cometTask[i].cometID + "&ReqType=" + reqType + "&ReqStr=" + encodeURIComponent(reqStr), false);
                        eventObject.setRequestHeader("If-Modified-Since", "0");
                        eventObject.send(null);
                        //
                        var cometStatusCode = parseInt(eventObject.responseXML.documentElement.attributes[0].value);
                        if (cometStatusCode == 7) {
                            handle.cometStatus = "leave";
                            handle.taskCount--;
                            cometTask.splice(i, 1);
                        }
                        return true;
                    }
                }
            }
            catch (ex) {
                handle.errorText = ex.message;
            }
        }
        //
        return false;
    };
};
 
