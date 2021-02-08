var fs = require('fs');
var path = require('path');
var folderArr = [];
var filePath = path.resolve('D:/public', '测试');
var fileArr = [];
var folderArr = [];
fileDisplay(filePath);
function fileDisplay(filePath) {
    console.log(filePath);
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err);
        } else {
            files.forEach(function (folderName) {
                var filedir = path.join(filePath, folderName);
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isDir = stats.isDirectory();//是文件夹
                        var isFir = stats.isFile();
                        if (isDir){
                            folderArr.push(folderName);
                            console.log(folderArr);
                        } else {
                            fileArr.push (folderName);
                            console.log(fileArr);
                        }
                    }
                })
            });
        }
    });
}

exports.fileDisplay = fileDisplay();





