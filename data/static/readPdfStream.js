// 从后台读取磁盘上面的pdf文件流、

var DEFAULT_URL = "";
var pdfData = "";

$.ajax({
    type: 'get',
    async: false,
    mimeType: 'text/plain; charset=x-user-defined',
    url: '/priviewPdf?filePath=' + encodeURIComponent(localStorage.getItem('pdfPath')),
    success: function(data) {
        pdfData = data;
    },
    fail: function(data) {

    }
})

var rawLength = pdfData.length;
// new ArrayBuffer()来创建一个指定长度的ArrayBuffer对象
var array = new Uint8Array(new ArrayBuffer(rawLength));
for (var i = 0; i < rawLength; i++) {
    array[i] = pdfData.charCodeAt(i) & 0xff;
}
DEFAULT_URL = array;
