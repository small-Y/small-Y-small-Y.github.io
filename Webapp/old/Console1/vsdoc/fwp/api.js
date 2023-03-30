/*************************************************************************
*
*			Request 对象的接口
*
**************************************************************************/
var Request = {};

Request.TotalBytes = 0;

Request.QueryString = function (variable) {
    /// <summary>QueryString 集合用于取回 HTTP 查询字符串中的变量值。</summary>
    /// <param name="variable" type="string">必需。在 HTTP 查询字符串中要取回的变量名称。</param>
    /// <returns type="variable">返回查询变量的值</returns>
};

Request.Form = function (element) {
    /// <summary>Form 集合用于从使用 POST 方法的表单获取表单元素的值。</summary>
    /// <param name="element" type="string">必需。表单元素的名称，此集合从中取回值。</param>
    /// <returns type="variable">返回对应表单元素的值</returns>
};

Request.Cookies = function (name) {
    /// <summary>Cookies 集合用于设置或取得 cookie 的值。如果 cookie 不存，就创建它，并赋予它规定的值。</summary>
    /// <param name="name" type="string">必需。cookie 的名称。</param>
};

Request.ServerVariables = function (server_variable) {
    /// <summary>ServerVariables 集合用于取回服务器变量的值。</summary>
    /// <param name="server_variable" type="string">必需。要取回的服务器变量的名称。</param>
    /// <returns type="variable">返回查询变量的值</returns>
};

Request.Read = function () {
    /// <summary>Read 方法用于获取作为 POST 请求的部分从客户机发送到服务器的文本数据。</summary>
    /// <returns type="text">返回从客户机发送到服务器的数据</returns>
};

Request.BinaryRead = function (count) {
    /// <summary>BinaryRead 方法用于获取作为 POST 请求的部分从客户机发送到服务器的数据。</summary>
    /// <param name="count" type="string">必需。规定要从客户机读取多少字节。</param>
    /// <returns type="data">返回从客户机发送到服务器的数据</returns>
};

Request.ReadUploadHead = function () {
    /// <summary>ReadUploadHead 方法用于获取上传文件信息头。</summary>
    /// <returns type="text">返回上传文件信息头</returns>
};

Request.ReadUploadData = function () {
    /// <summary>ReadUploadData 方法用于获取上传文件数据。</summary>
    /// <returns type="data">返回上传文件数据</returns>
};
/*************************************************************************
*
*			Response 对象的接口
*
**************************************************************************/
var Response = {};

Response.Buffer = false;
Response.CacheControl = "Private";
Response.CharSet = "ISO-8859-1";
Response.ContentType= "text/html";
Response.Expires = -1;
Response.ExpiresAbsolute= "#October 11,2003 16:00:00#";
Response.Status = "404 Not Found ";
Response.ContentDisposition = "";

Response.Cookies = function (name) {
    /// <summary>Cookies 集合用于设置或取得 cookie 的值。如果 cookie 不存，就创建它，并赋予它规定的值。</summary>
    /// <param name="name" type="string">必需。cookie 的名称。</param>
};

Response.IsClientConnected = function () {
    /// <summary>指示客户端是否已从服务器断开。</summary>
    /// <returns type="bool">返回连接状态</returns>
};

Response.Redirect = function (url) {
    /// <summary>Redirect 方法把用户重定向到一个不同的 URL 。</summary>
    /// <param name="name" type="string">必需。用户浏览器被重定向的 URL。</param>
};

Response.Write = function (text) {
    /// <summary>Write 方法向输出写一段指定的字符串。</summary>
    /// <param name="text" type="string">必需。要写的数据。</param>
};

Response.WriteFile = function (file) {
    /// <summary>WriteFile方法向输出写一个服务器文件</summary>
    /// <param name="file" type="string">必需。例如：/www/my.png</param>
    /// <returns type="bool">返回成功与否</returns>
};

Response.AddHeader = function (name,value) {
    /// <summary>向 HTTP 响应添加新的 HTTP 报头和值。</summary>
    /// <param name="name" type="string">必需。新头部变量的名称。</param>
    /// <param name="value" type="string">必需。新头部变量的初始值。</param>
};

Response.AppendToLog = function (appName,logType,logEntry,logLevel) {
    /// <summary>向服务器记录项目的添加日志字符串。</summary>
    /// <param name="appName" type="string">必需。应用程序名称。</param>
    /// <param name="logType" type="string">必需。日志类型。</param>
    /// <param name="logEntry" type="string">必需。日志内容。</param>
    /// <param name="logLevel" type="int">必需。日志级别。0-Debug、1-Info、2-Warn、3-Error、4-Fatal</param>
};

Response.BinaryWrite = function (data) {
    /// <summary>在没有任何字符转换的情况下直接向输出写数据。</summary>
    /// <param name="data" type="string">必需。被发送的二进制信息。</param>
};

Response.Clear = function () {
    /// <summary>清除已缓存的 HTML 输出。</summary>
};

Response.End = function () {
    /// <summary>停止处理脚本，并返回当前的结果。</summary>
};

Response.Flush = function () {
    /// <summary>立即发送已缓存的 HTML 输出。</summary>
};
/*************************************************************************
*
*			Application 对象的接口
*
**************************************************************************/
var Application = {};

Application.Contents = function (key) {
    /// <summary>Contents 集合包含着通过脚本命令添加到 application/session 的所有项目。</summary>
    /// <param name="key" type="string">必需。要取回的项目的名称。</param>
};

Application.StaticObjects = function (key) {
    /// <summary>StaticObjects 集合包含所有使用 HTML 的 <object> 标签追加到 application/session 的对象。</summary>
    /// <param name="key" type="string">必需。要取回的项目的名称。</param>
};

Application.Lock = function () {
    /// <summary>防止其余的用户修改 Application 对象中的变量。</summary>
};

Application.Unlock = function () {
    /// <summary>使其他的用户可以修改 Application 对象中的变量（在被 Lock 方法锁定之后）。</summary>
};
/*************************************************************************
*
*			Server 对象的接口
*
**************************************************************************/
var Server = {};
Server.ScriptTimeout = 30;

Server.CreateObjectEx = function (progID) {
    /// <summary>创建对象的实例（instance）。</summary>
    /// <param name="progID" type="string">必需。要创建的对象的类型。</param>
    /// <returns type="object">返回对象的实例</returns>
};

Server.Execute = function (path) {
    /// <summary>从另一个 FWP 文件中执行一个 FWP 文件。</summary>
    /// <param name="path" type="string">必需。要执行的 FWP 文件的位置。</param>
};

Server.GetLastError = function () {
    /// <summary>返回可描述已发生错误状态信息。</summary>
};

Server.HTMLEncode = function (html) {
    /// <summary>将 HTML 编码应用到某个指定的字符串。</summary>
    /// <param name="html" type="string">必需。要编码的字符串。</param>
    /// <returns type="string">返回编码后的字符串。</returns>
};

Server.MapPath = function (path) {
    /// <summary>将一个指定的地址映射到一个物理地址。</summary>
    /// <param name="path" type="string">必需。URL地址。</param>
    /// <returns type="string">返回物理地址</returns>
};

Server.Transfer = function (path) {
    /// <summary>把一个 FWP 文件中创建的所有信息传输到另一个 FWP 文件。</summary>
    /// <param name="path" type="string">必需。FWP 文件的位置。向这个 FWP 文件转移控制权。</param>
};

Server.URLEncode = function (url) {
    /// <summary>把 URL 编码规则应用到指定的字符串。</summary>
    /// <param name="url" type="string">必需。要编码的字符串。</param>
    /// <returns type="string">返回编码后的字符串。</returns>
};

/*************************************************************************
*
*			Session 对象的接口
*
**************************************************************************/
var Session = {};

Session.CodePage = 0;
Session.LCID = 0;
Session.SessionID = "";
Session.Timeout = 90;

Session.Contents = function (key) {
    /// <summary>Contents 集合包含着通过脚本命令添加到 application/session 的所有项目。</summary>
    /// <param name="key" type="string">必需。要取回的项目的名称。</param>
};

Session.StaticObjects = function (key) {
    /// <summary>StaticObjects 集合包含所有使用 HTML 的 <object> 标签追加到 application/session 的对象。</summary>
    /// <param name="key" type="string">必需。要取回的项目的名称。</param>
};

Session.Abandon = function () {
    /// <summary>撤销一个用户的 session。</summary>
};

Session.Remove = function (sessionID) {
    /// <summary>HA使用时，移除指定会话</summary>
    /// <param name="sessionID" type="string">必需。会话ID。</param>
};

Session.RemoveAll = function () {
    /// <summary>HA使用时，移除所有会话</summary>
};
/*************************************************************************
*
*			System 对象的接口
*
**************************************************************************/
var System = {};

System.Net = new function(){

};

System.OPC = new function(){

};

System.RDC = new function(){

};

System.KVDB = new function(){

};

System.LDAP = new function(){

};

System.TmpFS = new function(){

};

System.Storage = new function(){
    this.ListDir = function(folder,filter){
    
    };

    this.CreateDir = function (folder) {
    
    };

    this.DeleteDir = function (folder) {
    
    };

	this.DeleteFile = function(file){
    
    };

	this.IsFileExist = function(file){
    
    };

	this.ReadTextFile = function(file){
    
    };

	this.WriteTextFile = function(file,content){
    
    };

	this.UploadFile = function(dstfile,data,attach){
    
    };

	this.UnzipFile = function(dstfolder,zipfile){
    
    };

	this.GetLastError = function () {

	};

};

System.Image = new function(){
    this.GetImageSize = function (imgFile) {

    };
    this.CreateImageThumbs = function (imgPath,imgWidth) {

    };
    this.GetLastError = function () {

    };
};

System.Message = new function(){
    this.PushLog = function (itemStr) {

    };
    this.PushSms = function (phoneNum,smsText) {

    };
    this.GetLastError = function () {

    };
};

System.Security = new function(){

};

System.OAuth = new function(){
    this.VerifyUser = function (userName, passHash) {

    };

    this.GetCurrentUser = function () {

    };

    this.ReadUserConfig = function () {

    };

    this.WriteUserConfig = function (content) {

    };

    this.LogoutUser = function () {

    };

    this.IsUserSuper = function(){
    
    };
};

System.Timers = new function(){

};

System.OrgChart = new function(){

};

System.Users = new function(){

};

System.TaskQueue = new function () {

};
/*************************************************************************
*
*			Array 对象的扩展
*
**************************************************************************/
Array.prototype.IndexOf = function (obj) {
    /// <summary>查询数组元素返回对应索引号</summary>
    /// <param name="obj" type="Object">必需。要查询的数组元素</param>
    /// <returns type="int">元素存在返回索引号，否则返回-1.</returns>
}

Array.prototype.IsContain = function (obj) {
    /// <summary>查询数组元素是否存在</summary>
    /// <param name="obj" type="Object">必需。要查询的数组元素</param>
    /// <returns type="bool">元素存在返回true，否则返回false.</returns>
}

Array.prototype.Append = function (obj, nodup) {
    /// <summary>末尾附加新的数组元素</summary>
    /// <param name="obj" type="Object">必需。要添加的数组元素</param>
    /// <param name="nodup" type="bool">可选；是否允许重复元素</param>
}

Array.prototype.remove = function (obj) {
    /// <summary>删除指定数组元素</summary>
    /// <param name="obj" type="Object">必需。要删除的数组元素</param>
};

/*************************************************************************
*
*			Date 对象的扩展
*
**************************************************************************/
Date.prototype.Format = function (patrn) {
    /// <summary>格式化时间为字符串</summary>
    /// <param name="patrn" type="string">必需。例如："YYYY-MM-dd hh:mm:ss",其中M表示月，d表示日，h表示小时，m表示分钟，s表示秒，q表示季度，S表示毫秒</param>
    /// <returns type="string">返回对应格式时间</returns>
}

Date.prototype.DateAdd = function (interval, number) {
    /// <summary>计算时间偏移,例如:var tc = now.DateAdd("y",1);</summary>
    /// <param name="interval" type="string">必需。y表示年，m表示年，d表示日，w表示周，h表示小时，n表示分钟，s表示秒，l表示毫秒</param>
    /// <param name="number" type="int">必需。可以为负值</param>
    /// <returns type="datetime">返回时间对象</returns>
}

/*************************************************************************
*
*			核心扩展API全局命名空间
*
**************************************************************************/
var FWP = {};
/*************************************************************************
*
*			定义命名空间的方法
*
**************************************************************************/
FWP.namespace = function (ns) {
    /// <summary>自定义命名空间</summary>
    /// <param name="ns" type="string">必需。例如：Jiangnan.EMS</param>
    /// <returns type="object">返回命名空间对象</returns>
};

FWP.ns = FWP.namespace;

/*************************************************************************
*
*			继承对象类型的方法
*
**************************************************************************/
FWP.extend = function (subc, superc, overrides) {
    /// <summary>继承，并由传递的值决定是否覆盖原对象的属性 </summary>
    /// <param name="subc" type="Object">必需。用于继承（该类继承了父类所有属性，并最终返回该对象）</param>
    /// <param name="superc" type="Object">必需。父类，被继承</param>
    /// <param name="overrides" type="Object">可选; 一个对象，将它本身携带的属性对子类进行覆盖</param>
};

/*************************************************************************
*
*			JSON处理的方法（encode，decode，toDate）
*
**************************************************************************/
FWP.JSON = new function () {
    this.errorCode = 0;
    this.errorText = "";

    this.decode = function (input) {
        /// <summary>解析JSON格式字符串</summary>
        /// <param name="input" type="string">必需。例如：'[1,2,3]'</param>
        /// <returns type="object">返回JSON对象数据</returns>
    };

    this.encode = function (o) {
        /// <summary>序列化JSON对象数据为字符串</summary>
        /// <param name="o" type="object">必需。例如：[1,2,3]</param>
        /// <returns type="string">返回JSON格式字符串</returns>
    };

    this.toDate = function (d) {
        /// <summary>解析JSON对象中时间字符串数据</summary>
        /// <param name="d" type="string">必需。例如："2007-04-05T08:36:46"</param>
        /// <returns type="date">返回时间类型数据</returns>
    };
};

/*****************************************************************************************
*
*			SOAP协议辅助处理的方法（parseResquest,getSoapMethod or getSoapParameters
*                                  or getSoapParamArr or getSoapResponse or makeResponse）
*
*******************************************************************************************/
FWP.SOAP = new function () {
    this.errorCode = -1;
    this.errorText = "";
    this.xmlObj = null;

    this.parseResquest = function (xml) {
        /// <summary>解析SOAP协议请求XML</summary>
        /// <param name="xml" type="string">必需。例如：var soapRequestXml = Request.Read();</param>
        /// <returns type="object">返回SOAP协议解析器对象</returns>
    }

    this.getSoapMethod = function () {
        /// <summary>获取当前SOAP协议请求的方法</summary>
        /// <returns type="string">返回SOAP请求的方法名</returns>
    };

    this.getSoapParameters = function (parameterName) {
        /// <summary>获取当前SOAP协议请求的参数值</summary>
        /// <returns type="var">返回SOAP请求的参数值</returns>
    };

    this.getSoapParamArr = function () {
        /// <summary>获取当前SOAP协议请求的参数名列表</summary>
        /// <returns type="Array">返回SOAP请求的参数名列表数组</returns>
    };

    this.makeResponse = function (resultValue) {
        /// <summary>生成SOAP协议响应XML</summary>
        /// <param name="xml" type="var">必需。响应返回值</param>
        /// <returns type="string">返回SOAP协议解析器对象</returns>
    };

    return this;
};

/*****************************************************************************************
*
*			扩展方法工具包
*
*******************************************************************************************/
FWP.Utils = new function () {
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
    * YAHOO.lang.isFunction(obj.getAttribute) // reports false in IE
    *
    * var input = document.createElement("input"); // append to body
    * YAHOO.lang.isFunction(input.focus) // reports false in IE
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
    this._IEEnumFix = function (r, s) {
        var i, fname, f;
        for (i = 0; i < ADD.length; i = i + 1) {

            fname = ADD[i];
            f = s[fname];

            if (this.isFunction(f) && f != OP[fname]) {
                r[fname] = f;
            }
        }
    };
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

    this.parseDate = function (strTime) {
        /// <summary>将字符串转换成时间类型</summary>
        /// <param name="strTime" type="string or number">必需。时间字符串或1970-1-1以来的秒值</param>
        /// <returns type="date">返回时间对象</returns>
    };

    this.encode64 = function (input) {
        /// <summary>Base64编码</summary>
        /// <param name="input" type="string">必需。需要编码的内容</param>
        /// <returns type="string">返回编码后的字符串</returns>
    };

    this.decode64 = function (input) {
        /// <summary>Base64解码</summary>
        /// <param name="input" type="string">必需。需要解码的内容</param>
        /// <returns type="string">返回解码后的字符串</returns>
    };
    /**
    * 数字对象的格式化;
    */
    this.formatNumber = function (num, pattern) {
        /// <summary>数字对象的格式化</summary>
        /// <param name="num" type="num">必需。格式化数字</param>
        /// <param name="pattern" type="pattern">必需。如 #,###.##  0.###</param>
        /// <returns type="string">返回数据的格式化字符串</returns>
    };
    /*
    *  生成APP的唯一ID
    */
    this.makeAppGuid = function () {
        var guid = Server.CreateObject("Scriptlet.TypeLib").GUID;
        return guid.substr(1, guid.length - 2);
    };
    //输出调试日志
    this.log = function (msg, cat, src) {
        /// <summary>输出调试文本日志</summary>
        /// <param name="msg" type="string">必需。调试日志文本</param>
        /// <param name="cat" type="string">必需。调试日志级别，包括：info、warn、error</param>
        /// <param name="src" type="string">必需。调试日志来源</param>
    };

    this.dump = function (object, cat, src) {
        /// <summary>输出调试对象日志</summary>
        /// <param name="msg" type="string">必需。调试日志文本</param>
        /// <param name="cat" type="string">必需。调试日志级别，包括：info、warn、error</param>
        /// <param name="src" type="string">必需。调试日志来源</param>
    };
};
