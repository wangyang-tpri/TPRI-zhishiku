//红外图谱的 js文件 
// 需要满足响应式的要求  使用bootstrap 响应式框架  
var option = {
    switchImage: false, // false代表的是以表格的形式显示  切换后则为true 代表的是以缩络图显示  
    globalPath: '',
    img: document.createElement('img'),
    imageCount: 0,
    showEleId: 'table-info'
}
// 制作表格
var makeTable = {
    enlargeImage: function (target) {
        img = option.img
        img.src = ''
        option.globalPath = target;
        var path = $(target[0]).data('path')
        this.commonUrl(path, img)
        // 点击图片可以进行放大
        // 会有一个600 * 400的一个区域放大的位置
        img.style.display = 'none'
        $('#enlarge').css('display', 'block')
        img.style.width = 600 + 'px'
        img.style.height = 400 + 'px'
        img.style.position = 'absolute'
        img.style.top = '50%'
        img.style.left = '50%'
        img.style.marginTop = '-200px'
        img.style.marginLeft = '-300px'
        img.style.display = 'block'
        $('#enlarge').append(img)
    },
    getImageUrl: function (imagePath, key) {
        var httpClient = new XMLHttpRequest()
        httpClient.open('get', '/showImage?imagepath=' + imagePath, true)
        httpClient.responseType = 'blob'
        httpClient.onload = function () {
            if (this.status == 200) {
                var blob = this.response
                $('#iii' + key)[0].src = window.URL.createObjectURL(blob)
            }
        }
        httpClient.send()
    },
    commonUrl: function (imagePath, ele) {
        var httpClient = new XMLHttpRequest()
        httpClient.open('get', '/showImage?imagepath=' + imagePath, true)
        httpClient.responseType = 'blob'
        httpClient.onload = function () {
            if (this.status == 200) {
                var blob = this.response
                ele.src = window.URL.createObjectURL(blob)
            }
        }
        httpClient.send()
    },
    showEachImage: function (imageName) {
        $.ajax({
            type: 'get',
            url: '/imageInfo',
            data: {
                imageName: imageName
            },
            success: function (res) {
               makeTable.processData(res, option.showEleId)
            },
            error: function (res) {
            }
        })
    },
    processImage: function(data){
        for (var key in data) {
            this.showEachImage(data[key])
        }
    },
    getInfraredInfo: function () {
        $.ajax({
            type: 'get',
            url: '/infrared',
            data: {},
            success: function (res) {
                // 对返回的图片数据进行处理 
                makeTable.processImage(res)
            },
            error: function () {
            }
        })
    },
    processData: function (data, element) {
        var html = ''
        for (var key in data) {
            var info = data[key];
            var imageSize = Math.floor(((info.size) / 1000)) + 'kb'
            var imagePath = 'd:/public/红外图谱/' + info.name;
            if (element == 'thum-info') {
                html += '<ul><li><img id=' + "iii" + option.imageCount + ' class="thum-image" onclick="makeTable.enlargeImage($(this))" data-path=' + imagePath + '></li>' 
                html += '<li class="thum-title">'+info.name+'</li></ul>'
            } else {
                html += '<tr><td><img id=' + "iii" + option.imageCount + ' class="infr-image" onclick="makeTable.enlargeImage($(this))" data-path=' + imagePath + '>' + info.name + '</td><td>'
                html += '已上传</td><td>' + imageSize
                html += '</td><td style="cursor: pointer" onclick="downEachLoadImage($(this))" data-path = ' + imagePath + '>' + '下载</td></tr>'
            }
        }
        $('#'+ element).append(html)
        this.getImageUrl(imagePath, option.imageCount)
        option.imageCount++;
    },
    closeMask: function(){
        $('#enlarge').css('display', 'none')
    }
}
function init() {
    makeTable.getInfraredInfo()
}
// init()
$('.infrared-svg').on('click', function () {
    option.switchImage = !option.switchImage
    switchFunc()
})
// 图片下载时使用  target 点击下载按钮的那个元素 
function downEachLoadImage(target) {
    var path = $(target[0]).data('path')
    var eLink = document.createElement('a')
    eLink.style.display = 'none'
    eLink.href = 'downloadImage/?imagepath=' + encodeURIComponent(path)
    eLink.click()
}
// 图片的数据请求一次 然后在两种图片的不同展示形式中通过变量switchImage进行样式的展示切换
function switchFunc() {
    if (!option.switchImage) {
        option.showEleId = 'table-info'
        $('#infr-table').css('display', 'block')
        $('#infr-thum').css('display', 'none')
    } else {
        option.showEleId = 'thum-info'      
        $('#thum-info').empty()
        makeTable.getInfraredInfo()
        $('#infr-table').css('display', 'none')
        $('#infr-thum').css('display', 'block')
    }
}
$('#close').on('click', function () {
    makeTable.closeMask()
})
$('#down').on('click', function () {
    downEachLoadImage(option.globalPath)
})

// 制作缩络图
var makeThumbnail = {   
}