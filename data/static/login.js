var centerMiddle = document.getElementById("l-center");
var h_screen = window.screen.availHeight || document.body.clientHeight;
var dragContainer = document.getElementById('jigsaw')
var userName;
var password;
var nameEle;
var passwordEle;
var loginBut;
var startValidation = false;
loginBut = document.getElementById('login');
nameEle = document.getElementById('inputName');
passwordEle = document.getElementById('inputPassword');
nameEle.onblur = function(){
    userName && loginBut.removeAttribute('disabled')
}
function getLoginUserInfo(ele) {
    switch (ele) {
        case ele = 'inputName':
            userName = nameEle.value;
            break;
        case ele = 'inputPassword':
            password = passwordEle.value;
            break;
    }
}
// 从后台请求成功后的会有一个cookie
function postUser(userName) {
    $.ajax({
        url: '/verificateUser',
        type: 'get',
        data: {
            userName: userName
        },
        success: function () {

        },
        fail: function () {

        }
    })
}
function login() {
    if (startValidation || getUrlParams()) {
        nameEle.value = '';
        passwordEle.value = '';
        postUser(userName);
        localStorage.setItem('userName', 'tpri');
        location.href = location.protocol + '//' + location.host + '/homePage.html';
    } 
}
loginBut.onclick = function () {
    eleBlock('mask')
    eleBlock('jigsaw')
    password = passwordEle.value;
};
document.onkeydown = function (e) {
    if (e.keyCode == 13) {
        password = passwordEle.value;
        if (password && userName){
            eleBlock('mask')
            eleBlock('jigsaw')
        }
        
    }
}
var searchName;
/**
 * @description 当从远程诊断平台跳转到该页面时的url中携带的参数是
 * '?user=tpri&xdm_e=http://redc.smart01.cn:8080&xdm_c=default3777&xdm_p=1'
 * 同时满足 user=tpri 和 hostname=redc.smart01.cn 则直接让登录
 */
http://106.53.233.188:4000/index.html?user=tpri&xdm_e=http://redc.smart01.cn:8080&xdm_c=default3777&xdm_p=1
function getUrlParams() {
    var isLogin = false;
    if (decodeURIComponent(location.search)) {
        var searchParams = decodeURIComponent(location.search).split('?')[1].split('&');
        if (searchParams[1]){
            if (searchParams[1].indexOf('=') > 0) {
                var searchHostName = searchParams[1].split('=')[1].split('//')[1].split(':')[0];
            }
        } 
        var jumpHost = "redc.smart01.cn";
        searchName = searchParams[0].split('=')[1];
        if (searchName == 'tpri' && searchHostName == jumpHost) {
            return isLogin = true;
        }
    }
    return isLogin;
}
if (getUrlParams()) {
    localStorage.setItem('userName', searchName);

    userName = 'tpri'
    login();
} else {
    localStorage.setItem('userName', '');
}
/**
 * @description 判断如何是从 微信 或者企业微信中 进入应用的话 就不需要登录页面
 */
function isWeixin() {
    var ua = navigator.userAgent.toLocaleLowerCase();
    if (ua.match(/micromessenger/i) == "micromessenger") {
        localStorage.setItem('userName', 'tpri');
        location.href = location.protocol + '//' + location.host + '/homePage.html';
    } else {
        return false;
    }
}
setTimeout(function () {
    isWeixin();
}, 0)

/**
 * @description 登录时添加拖动图片进行进一步的人工验证的功能
 */

function failCallBack (){
    location.reload()
}
drawImage.init({
    el: dragContainer,
    onsuccess: verifyUserName,
    onfail: failCallBack
})
function eleBlock(eleStr) {
    document.getElementById(eleStr).style.display = 'block'
}

function verifyUserName(){
    $.ajax({
        url: '/userInfo',
        type: 'post',
        data: {
            userName: userName,
            password: password
        },
        success: function(req) {
            if ( req.login ) {
                startValidation = true;
                login()
            } else {
                alert('用户名或密码输入错误');
                location.reload()
            }
        },
        fail: function(){
        }        
    })
}