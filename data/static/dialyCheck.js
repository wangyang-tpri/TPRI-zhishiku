'use strict'
isLogin();

$('.backToIndex').on('click', function () {
    window.location.href = "./homePage.html";
})
var search = location.search;
search = search.split('=')[1];
var client_Width = window.screen.availHeight || document.body.clientHeight;
var leftMenuHeight = client_Width - 200 + 'px';
if (window.screen.width < 500) {
    leftMenuHeight = 300 + 'px';
}
$('#leftItem').css('height', leftMenuHeight);
hightLightItem(search);
whichMethodCall(search);
function hightLightItem(number) {
    $('ul li:nth-child(' + number + ')').addClass('activeItem');
    $('ul span').addClass('spanItem');
}
$('ul').on('click', 'li', function (e) {
    var tag = e.target;
    $(tag).addClass('activeItem').siblings().removeClass('activeItem');
    whichMethodCall($(tag).index() + 1);
})
var titleObj = {
    'daily': '日常巡检报告',
    'event': '重点事件分析',
    'technical': '技术资料汇总',
    'video': '在线视频教学'
}
var titleFolder;
function whichMethodCall(number) {
    number = parseInt(number);
    switch (number) {
        case 1:
            getDailyCheckInfo()
            break;
        case 2:
            getEventAnalysisInfo()
            break;
        case 3:
            getTechnicalInfo()
            break;
        case 4:
            getOnlineTeachingInfo()
            break;
        default:
            break;
    }
}
// 根据文件所在磁盘上面的目录请求文件的具体内容
function showFileDetail(fileArr, levelName) {
    for (var key in fileArr) {
        $.ajax({
            type: 'get',
            url: '/fileDetails',
            data: {
                folder: levelName,
                name: fileArr[key],
                t: new Date()
            },
            success: function (res) {
                otherInfoBack(res, 'bigInfo');
            },
            fail: function () {

            }
        })
    }
}
//日常巡检报告
function getDailyCheckInfo() {
    $.ajax({
        url: '/dailyCheck',
        type: 'get',
        success: function (res) {
            //处理数据
            titleFolder = titleObj.daily;
            getEachTitleDetail(res, titleFolder);
        },
        fail: function () {
            console.log('内部服务器错误');
        }

    })
}
//重点事件分析
function getEventAnalysisInfo() {
    $.ajax({
        url: '/keyEventAnalysis',
        type: 'get',
        success: function (res) {
            //处理数据
            titleFolder = titleObj.event;
            getEachTitleDetail(res, titleFolder);
        },
        fail: function () {
            console.log('内部服务器错误');
        }
    })
}
//技术资料汇总
function getTechnicalInfo() {
    $.ajax({
        url: '/technicalSummary',
        type: 'get',
        success: function (res) {
            titleFolder = titleObj.technical;
            getEachTitleDetail(res, titleFolder);
        },
        fail: function () {

        }
    })
}
//在线视频教学
function getOnlineTeachingInfo() {
    $.ajax({
        url: '/onlineVideoTeaching',
        type: 'get',
        success: function (res) {
            titleFolder = titleObj.video;
            getEachTitleDetail(res, titleFolder);
        },
        fail: function (res) {

        }

    })
}
function getEachTitleDetail(res, title) {
    if (res.length != 0) {
        $('#bigInfo').empty();
        showFileDetail(res, title);
    } else {
        $('#bigInfo').empty();
    }
}
function otherInfoBack(res, infoId) {
    var html = '';
    if (res) {
        var processResult = processFileTypeAndDate(res[0], res[1]);
        var spaceName;
        if (res[0].indexOf(' ') != -1) {
            res[0] = res[0].split(' ').join('***');
        }
        var filePath = "D:/public/" + titleFolder + '/' + res[0];
        html += '<tr><td>'
        html += res[0].split('.')[0] + '</td><td>'
        html += processResult.type + '</td><td>'
        html += processResult.date + '</td>'
        html += '<td><button onclick = "priviewWorld($(this))" data-name = ' + filePath + '>预览</button></td>'
        html += '</tr>'
        $('#' + infoId).append(html);
    }
}
//下载文件的function
function downloadFile(fileName) {
    return;
    var elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = '/downloadFile?fileName=' + fileName;
    elink.download = fileName + '.docx';
    elink.click();
}
function isLogin() {
    var name = localStorage.getItem('userName');
    if (name == 'null' || name == null || name == "") {
        location.href = './index.html';
    }
}

$('#h-user').html('你好 ' + "| " + 'TPRI');
var isSort = true;
function sortTable(tableId, colIndex) {
    var table = document.getElementById(tableId);
    var rows = table.rows;
    var arr = new Array();
    for (var i = 0; i < rows.length; i++) {
        if (i == 0) {
            continue;
        }
        arr.push(rows[i]);
    }

    if (!isSort) {
        arr.reverse()
        isSort = true;
    } else {
        arr.sort(function (a, b) {
            var t1 = new Date(a.cells[2].innerHTML.replace(/-/g, '/'));
            var t2 = new Date(b.cells[2].innerHTML.replace(/-/g, '/'));
            if (t1 < t2) {
                return 1;
            } else if (t1 > t2) {
                return -1;
            } else {
                return 0;
            }
        })
        isSort = false;
    }
    for (var i = 0; i < arr.length; i++) {
        $(table).append(arr[i]);
    }
}

function priviewWorld(target) {
    var dataName = $(target[0]).data("name");
    if (dataName.indexOf('***') != -1) {
        dataName = dataName.split('***').join(' ');
    }
    var priviewType;
    var dataPathLength = dataName.split('/').length;
    priviewType = dataName.split('/')[dataPathLength - 1].split('.')[1];
    if (priviewType == 'pdf') {
        localStorage.setItem('pdfPath', dataName);
        window.open('./priviewPdf.html');
    } else if (priviewType == 'docx' || priviewType == 'doc') {
        window.open('./priviewWorld.html?filName=' + encodeURIComponent(dataName))
    } else {
        window.open('./priviewVideo.html?fileName=' + encodeURIComponent(dataName));

    }
}
/**
 * @param {path} string
 * @param {date} string
 * @param {name} string
*/
function processFileTypeAndDate(path, date, name) {
    var result = {
        type: '',
        date: '',
        name: ''
    }
    var pathLength;
    var date = new Date(date);
    var hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
    var minuter = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
    if (path.indexOf('/') > 0) {
        pathLength = path.split('/').length;
        result.type = path.split('/')[pathLength - 1].split('.')[1];
    } else {
        result.type = path.split('.')[1];
    }
    result.date = date.toLocaleDateString() + ' ' + hour + ':' + minuter;
    return result;
}
document.getElementById('login_out').addEventListener('click', function (e) {
    _logout();
    localStorage.setItem('userName', '');
    location.href = './index.html';
})

