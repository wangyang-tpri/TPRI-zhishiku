'use strict'
var fileType;
var fileInput;
var directoryResult = [];
var flag = false;
var folderFlag = true;
var searchType;
var isDirectory = true;
var prensentFolder;
var nodeCount = 0;
var levelName;
var currentTarget;
var realTimeRes;
var buildTreeCount = 0;
var realTimeFloderCount = 0;
var _Cookie = document.cookie;
var ua = navigator.userAgent.toLocaleLowerCase()
setTimeout(function () {
    init()
}, 0)
$('.backToIndex').on('click', function () {
    window.location.href = "./homePage.html";
})
$('#alter').on('click', function () {
    $('#alter').hide(500);
    $('#mask').hide(500);
})
$('#folderCotainer').css('display', 'none');
$('#pollContent').css('display', 'block');
$('#videoContent').css('display', 'block');
function hrefToContent(item) {
    var screenWidth = window.screen.width;
    if (screenWidth > 920) {
        location.href = 'dialyCheck.html?item=' + item;
    } else {
    }
}

$(".dropdown-menu").on('click', 'a', function (e) {
    $("#selectFolder").html(e.target.innerHTML + "<span class='caret'></span>");
})
$('input').val("");
function getInfomation() {
    fileInput = $('#reserve').val();
}
//日常巡检报告
function getDailyCheckInfo() {
    $.ajax({
        url: '/dailyCheck',
        type: 'get',
        success: function (res) {
            fileConut = 0;
            //处理数据
            infoId = 'dailyCheck';
            showFileDetail(res, '日常巡检报告', 'getTitle', infoId);
        },
        fail: function () {
            console.log('内部服务器错误');
        }

    })
}

//重点事件分析
var infoId;
function getEventAnalysisInfo() {
    $.ajax({
        url: '/keyEventAnalysis',
        type: 'get',
        success: function (res) {
            fileConut = 0;
            //处理数据
            infoId = 'eventAnalysis';
            showFileDetail(res, '重点事件分析', 'getTitle', infoId);
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
            fileConut = 0;
            infoId = 'technical';
            showFileDetail(res, '技术资料汇总', 'getTitle', infoId);
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
            fileConut = 0;
            infoId = 'onlineTeaching';
            showFileDetail(res, '在线视频教学', 'getTitle', infoId);
        },
        fail: function (res) {

        }

    })
}
function init() {
    getDailyCheckInfo();
    getEventAnalysisInfo();
    getOnlineTeachingInfo();
    getTechnicalInfo();
    getDiskFolder();
}
createFolder();
// 获取磁盘上面所用文件夹的接口
var titleFolder;
function getThisFolder(infoId) {
    switch (infoId) {
        case 'dailyCheck':
            return titleFolder = '日常巡检报告';
        case 'eventAnalysis':
            return titleFolder = '重点事件分析';
        case 'technical':
            return titleFolder = '技术资料汇总';
        default:
            return titleFolder = '在线视频教学'
    }
}
function otherInfoBack(res, titleFolder, infoId) {
    var html = '';
    var file = {
        type: '',
        name: '',
        path: '',
        createTime: ''
    }
    if (res) {
        var processResult = processFileTypeAndDate(res[0], res[1]);
        file.name = res[0].split('.')[0];
        if (res[0].indexOf(' ') != -1) {
            res[0] = res[0].split(' ').join('***');
        }
        file.path = "D:/public/" + titleFolder + '/' + res[0];
        html += '<tbody><tr><td>'
        html += file.name + '</td><td>'
        html += processResult.type + '</td><td>'
        html += processResult.date + '</td>'
        html += '<td><button onclick = "priviewWorld($(this))" data-name = ' + file.path + '>预览</button></td>'
        html += '</tr></tbody>'
        $('#' + infoId).append(html);
    }
}
//下载文件的function    
function downloadFile(fileName) {
    return;
    var elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = '/downloadFile?fileName=' + encodeURIComponent(fileName);
    elink.click();
}
$('#folderCotainer').css('display', 'none');
$('#pollContent').css('display', 'block');
$('#videoContent').css('display', 'block');
function loading(content) {
    $('#alter').empty();
    $('#alter').css('height', 0);
    $('#alter').css('display', 'block');
    $('#alter').animate({
        height: '100px'
    })
    $('#alter').append('<div id = "content" >' + content + '</div><span>确定</span>')
    $('#mask').css('display', 'block');
}
function getFile() {
    $.ajax({
        url: '/fileContent',
        type: 'get',
        data: {
            fileInput: fileInput,
            isDirectory: isDirectory,
            searchType: searchType,
            t: new Date()
        },
        success: function (res) {
            fileInput = "";
            isDirectory = true;
            $('#alter').css('height', 0);
            if (res.result.length != 0) {
                if (res.result[0].file_name == "") {
                    $('#folderDetails tbody').empty();
                } else {
                    processData(res.result);
                    $('#folderCotainer').css('display', 'block');
                    $('#pollContent').css('display', 'none');
                    $('#videoContent').css('display', 'none');
                }
            } else {
                loading('没有找到数据');
                filePosition.html("");
            }
            $('#reserve').val("");
        },
        fail: function (res) {
        }
    })
}


/**
 * @description
 * 检索类型 searchType
 * 1 fileSearch
 * 2 keyWorldSearch  
 *
*/
$('#searchFile').on('click', function () {
    commonSearch(1);
})
$('#keyWorldSearch').on('click', function () {
    commonSearch(2);
})
function commonSearch(type) {
    if (!fileInput) {
        loading('文件名或关键词不能为空');
    } else {
        searchType = type;
        folderFlag = false;
        getFile();
    }
}
$('#refresh').on('click', function () {
    $('#treeNode').empty();
    getFolderList();
    getDiskFolder();
    getFolderList2(currentTarget);
})
function processData(res) {
    $('#folderDetails tbody').empty();
    if (res.length != 0) {
        for (var key in res) {
            var splitRes,
                splitFilePath = [],
                html = "",
                data = "";
            splitRes = res[0].file.split('/');
            splitFilePath.push(splitRes[0]);
            splitFilePath.push(splitRes[1]);
            flag = true;
            if (!folderFlag) {
                prensentFolder = res[0].file.split('/')[2];
                for (var k in directoryResult) {
                    if (directoryResult[k].create_floder == prensentFolder) {
                        nodeCount = k;
                    }
                }
                getDirectoryList(prensentFolder);
                folderFlag = true;
            }
            splitFilePath.push(prensentFolder);
            filePosition.html(splitFilePath.join('/'));
            var processResult = processFileTypeAndDate(res[key].file, res[key].upload_time);
            if (res[key].file.indexOf(' ') != -1) {
                res[key].file = res[key].file.split(' ').join('***');
            }
            html += '<tr><td>'
            html += res[key].file_name + '</td>'
            html += '<td>' + processResult.type + '</td>'
            html += '<td>' + processResult.date + '</td>';
            html += '<td><button onclick = "priviewWorld($(this))" data-name = ' + res[key].file + '>预览</button></td>'
            html += '</tr>'
            $('#folderDetails tbody').append(html);
        }
    } else {
        $('#folderDetails tbody').append('<p>没有找到数据</p>');
    }

}
//获取此用户下的所有文件夹
function getFolderList() {
    $.ajax({
        url: '/folderList',
        type: 'get',
        data: {
            t: new Date()
        },
        success: function (res) {
        },
        fail: function (res) {
        }
    })
}
var filePosition = $('.filePosition');
function getDirectoryList(prensentFolder) {
    $.ajax({
        url: '/directoryList',
        type: 'get',
        data: {
            folder: prensentFolder
        },
        success: function (res) {
            //这块请求回来的是当前文件夹下的文件
            if (res.length == 0) {
                // loading('此文件下没有数据');
            } else {
                openFolder(res)
            }
        },
        fail: function () {
        }
    })
}
function getThisFileContent(target) {
    searchType = 1;
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    fileInput = $(target).text();
    getFile()
}
function getThisCurrentDirectory(target) {
    fileInput = "";
    flag = false;
    searchType = 1;
    nodeCount = $(target).index();
    prensentFolder = $(target).children('span').text();
    getDirectoryList(prensentFolder);
}
function openFolder(res) {
    //动态生成每个文件夹下的文件
    $('#tree' + nodeCount).children('ul').css('display', 'block');
    $('#tree' + nodeCount).siblings().children('ul').css('display', 'none');
    $('#tree' + nodeCount).children('ul').empty();
    var html = "";
    for (var key in res) {
        fileInput ? fileInput : fileInput = res[0].file_name;
        flag ? "" : getFile();
        html += '<ul><li onclick = "getThisFileContent(this)">' + res[key].file_name
        html += '</li></ul>'
    }
    $('#tree' + nodeCount).append(html);
}
function distinct1(arr, key) {
    var newobj = {}, newArr = [];
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (!newobj[item[key]]) {
            newobj[item[key]] = newArr.push(item);
        }
    }
    return newArr;
}

function realTimeGetFolderList() {
    $.ajax({
        type: 'get',
        data: {
            t: new Date()
        },
        url: '/folderList',
        success: function (res) {
            realTimeRes = distinct1(res, 'create_floder');
            realTimeFloderCount = realTimeRes.length;

            var html = ''
            if (buildTreeCount != realTimeFloderCount) {
                $('#treeNode').empty();
                getFile();
                for (var key in realTimeRes) {
                    html += '<div onclick = "getThisCurrentDirectory(this)" style = "cursor: pointer; margin-top: 5px; padding-left: 10px;" id = "tree' + key + '">'
                    html += '<span>' + realTimeRes[key].create_floder + '</span></div>'
                }
                $('#folderDetails tbody').empty();
            }
            $('#treeNode').append(html);
        },
        fail: function () {

        }
    })
}
function buildNodeTree(directoryResult) {
    var html = '';

    for (var key in directoryResult) {
        html += '<div onclick = "getThisCurrentDirectory(this)" style = "cursor: pointer; margin-top: 5px; padding-left: 10px;" id = "tree' + key + '">'
        html += '<span>' + directoryResult[key].create_floder + '</span></div>'
    }

    $('#treeNode').append(html);
}
function initTreeNode(res) {
    directoryResult = distinct1(res, 'create_floder');
    buildTreeCount = directoryResult.length;
    buildNodeTree(directoryResult);
}
//在搜索框中进行文件检索时用这个树结构
$("#chooseFileType").on('click', 'span', function (e) {
    fileType = e.target.innerHTML;
    e.target.parentNode.className = 'label label-default';
})


$("#fileUpload").on('click', function () {
    window.location.href = "fileUpload.html"
})
function getDiskFolder(folderName) {
    $.ajax({
        url: '/diskFolder',
        data: {
            t: new Date(),
            name: folderName,
            type: 1
        },
        success: function (res) {
            initTreeNode2(res);
        },

        fail: function (res) {

        }
    })
}


function initTreeNode2(res) {
    var fileArr = [], folderArr = [];
    for (var key in res) {
        if (res[key] == '红外图谱') {
            continue
        }
        if (res[key].indexOf('.') != -1) {
            fileArr.push(res[key]);
        } else {
            folderArr.push(res[key]);
        }
    }
    buildNodeTree2(fileArr, folderArr);
}

function buildNodeTree2(fileArr, folderArr) {
    $('#folderDetails tbody').empty();
    var html = '';
    var fileEle = '';
    for (var key in fileArr) {
        html += '<tr><td>'
        html += '<a style = "cursor: pointer" href = "javascript: void(0)" onclick = "downloadFile($(this).html())" >'
        html += fileArr[key] + '</a></td>'
        html += '</tr>'
    }

    for (var key in folderArr) {
        var list = folderArr[key];
        fileEle += '<ul onclick = "getFolderList2(this)" data-name ="' + list + '">';
        fileEle += '<span class ="glyphicon glyphicon-folder-open"></span>';
        fileEle += '<span id="folderNameEle" >' + list + '</span></ul>';

    }
    $('#folderDetails tbody').append(html);
    $('#treeNode').append(fileEle);
}
function getFolderList2(target) {
    currentTarget = target;
    var levelCount = 1;
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    if (target) {
    }
    levelName = target.dataset.name;
    $(target).children('ul').remove().css('background', 'beige');
    $(target).addClass('folder-back').siblings().removeClass('folder-back');
    $(target).siblings().children('ul').empty();
    $('.filePosition').html('D:/public' + '/' + levelName);
    $.ajax({
        url: '/diskFolder',
        data: {
            t: new Date(),
            name: levelName
        },
        type: 'get',
        success: function (res) {
            if (res.length == 0) {

            } else {
                $('#folderDetails tbody').empty();
                processData2(res, levelCount, target);
            }

        },
        fail: function () {

        }
    })
}
function processData2(res, levelCount, target) {
    var fileArr = [], folderArr = [];
    for (var key in res) {
        if (res[key].indexOf('.') != -1) {
            fileArr.push(res[key]);
        } else {
            folderArr.push(res[key]);
        }
    }
    var html = '';
    var fileEle = '';
    if (levelName.split('/').length >= 2 && folderArr.length > 2) {
        levelCount = 2;
    }
    for (var key in folderArr) {
        var list = folderArr[key];
        html += '<ul>';
        html += '<li style="margin-bottom:' + '-' + (levelCount * 10) + 'px; margin-left: -20px">' + '|---';
        html += '<span class ="glyphicon glyphicon-folder-open"></span>';
        html += '<span style ="cursor: pointer; margin-left: 10px;" data-name ="' + levelName + '/' + list + '" onclick="getFolderList2(this)">' + list + '</span>';
        html += '</li>';
        html += '</ul>'
    }
    showFileDetail(fileArr, levelName)
    $(target).append(html);
}
var fileConut = 0;
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
function showFileDetail(fileArr, levelName, getType, infoId) {
    /**
     * pc端的话 每次只加载5个内容   移动端的话 全部加载
    */
    isPc() ? (fileArr = getType && fileArr.length > 5 ? fileArr.slice(0, 5) : fileArr) : fileArr = fileArr;
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
                fileConut++;
                if (getType == 'getTitle') {
                    otherInfoBack(res, levelName, infoId);
                } else {
                    buildFileTable(res);
                }
            },
            fail: function () {

            }
        })
    }
}
function buildFileTable(res) {
    var fileEle = "";
    var fileArr = res;
    var filePath = 'D:/public/' + levelName + '/' + fileArr[0];
    var processResult = processFileTypeAndDate(fileArr[0], fileArr[1]);
    fileEle += '<tr><td>'
    fileEle += fileArr[0].split('.')[0] + '</td>'
    fileEle += '<td>' + processResult.type + '</td>'
    fileEle += '<td>' + processResult.date + '</td>'
    fileEle += '<td><button onclick = "priviewWorld($(this))" data-name = ' + filePath + '>预览</button></td>'
    fileEle += '</tr>'

    $('#folderDetails tbody').append(fileEle);
}
//从远程诊断模块跳转到知识库管理页面做的处理
authenticaFun();
var globalName;

function getUserName(key) {
    $.ajax({
        url: '/username',
        data: {
            t: new Date(),
            userNameKey: key
        },
        type: 'get',
        success: function (res) {
            var globalName = res.split('@')[1];
            // localStorage.setItem('userName', globalName);
            $('#h-user').html('你好 ' + '| ' + globalName);
        },
        fail: function (res) {

        }
    })
}

function authenticaFun() {
    //最后的这个 key是需要从 远程诊断平台跳转到知识库管理的url中动态获取的
    var key = "RedcToken_BGF7E61877827AAD702594A306E08800";
    getUserName(key);
}
//给表格做一个时间的排序功能
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


//左侧的文件夹目录可以自由拖动改变宽度
var isMoveRight = false;
var move_w;
$('#cc').mouseup(function (e) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    var start_w = $('#treeNode').outerWidth(true);
    var move_w = e.screenX;
    var aa = start_w - move_w;
    var window_w = window.screen.width;
    var end_w = start_w - aa;
    if (move_w <= 260) {
        move_w = 260;
        aa = 0;
        isMoveRight = true;
    } else if (move_w >= 500) {
        move_w = 500;
    }
    $('#treeNode').css('width', move_w + 'px');
    $('#treeNode').parent().css('width', move_w + 30 + 'px');
    $("#folderDetails").css('width', window_w - move_w - 60 + 'px');
})

//在public下新建4个文件夹
function createFolder() {
    $.ajax({
        url: '/createFolder',
        type: 'get',
        data: {
            t: new Date()
        },
        success: function () {

        },
        fail: function () { }
    })
}
// 预览world文档的function
var btn = document.getElementsByTagName('button');
btn.onclick = function () {
    alert(1);
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
 * 
 * 处理文件类型和文件创建事件的方法
 * @param {path} string
 * @param {date} string
 * 
*/

function processFileTypeAndDate(path, date) {
    var result = {
        type: '',
        date: ''
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
    $.ajax({
        type: 'get',
        url: '/loginout',
        data: {},
        success: {},
        fail: {}
    })
    localStorage.setItem('userName', '');
    location.href = './index.html';
})

if (localStorage.getItem('userName') == 'null' ||
    localStorage.getItem('userName') == null ||
    localStorage.getItem('userName') == "") {
    location.href = './index.html';
};

