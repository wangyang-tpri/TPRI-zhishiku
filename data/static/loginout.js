(function (window, document) {
    this._Cookie = document.cookie;
    this._splitCookie = function () {
        var o = {};
        var a = [];
        a = this._Cookie.split(';')
        for (var key in a) {
            var n = a[key].indexOf('=')
            if (n == -1) continue
            var cookieKey = a[key].slice(0, n);
            var cookieVal = a[key].slice(n, a[key].length)
            o[cookieKey] = cookieVal
            return o;
        }
    }
    this._getCookie = function () {
        if (this._splitCookie() && this._splitCookie()['sing_in_name'].split('=')[1] !== 'tpri') {
            if (isPc()) {
                location.href = './index.html';
            }
        }
    }

    /**
     * @returns true 代表是在pc端登录的
    */
    function isPc() {
        var pcFlag = true;
        var navagitorInfo = navigator.userAgent;
        var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone"];
        for (var i = 0; i < agents.length; i++) {
            if (navagitorInfo && navagitorInfo.indexOf(agents[i]) > 0) {
                return pcFlag = false;
            }
        }
        return pcFlag;
    }
    this._getCookie();
    this._logout = function () {
        $.ajax({
            type: 'get',
            url: '/loginout',
            data: {},
            success: {},
            fail: {}
        })
    }
    this._onBridgeReady = function () {
        WeixinJSBridge.call('hideOptionMenu');
    }
    this._weixin = function () {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this._onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this._onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', this._onBridgeReady);
            }
        } else {
            this._onBridgeReady();
        }
    }

})(window, document)