var express = require("express");
var mysql = require("mysql");
var path = require("path");
var bodyParser = require("body-parser");
var multer = require("multer");
var fs = require('fs');
var CreatePool = require("./node/db");
var createPool = new CreatePool();
var pool = createPool.getPool();
var GetUpload = require('./node/FileUploadNode');
var GetUpload = new GetUpload();
var GetFileContent = require('./node/getFileContentsNode');
var getFileContent = new GetFileContent();
var OtherInfo = require('./node/otherInfoNode');
var AddOrDeleteFolder = require('./node/addOrDeleteNode');
var addOrDeleteFolder = new AddOrDeleteFolder();
var otherInfo = new OtherInfo();
// var redisClient = require('./node/redisModule');
var app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json());
//17792296060

app.use(express.static("./static"));

/**
 * user_name 需要首先获取到的 再从filemanagement表中获取到当前用户已经创建过的文件夹
*/

app.get('/loginout', (req, res) => {
    // cookie 就是浏览器存储在用户电脑上的一小段文本文件
    // 一个web页面或服务器告知浏览器按照一定的规范来储存这些信息
    res.setHeader('Set-cookie', `sing_in_name=''`);
    
    res.send({
        'msg': 'login out'
    })
})

app.get('/verificateUser', (req, res) => {
    var loginName = req.query.userName;
    var expiresTime = new Date().getTime + 60 * 1000 * 30;
    if (loginName == 'tpri') {
        res.setHeader('Set-cookie', `sing_in_name=${loginName}`);
        res.setHeader("content_security_policy", "default-src 'self' style-src 'self' 'unsafe-inline';" )
    }
    res.send({
        'msg': 'success'
    })    
})

//下载文件内容
app.get('/downloadFile', (req, res) => {
    getFileContent.downloadFile(req, res);
})

//获取文件列表的function
app.get("/fileContent", (req, res) => {
    if (req.query.searchType == 1) {
        getFileContent.getFile(req, res);
    } else {
        getFileContent.keyWorldSearchFile(req, res);
    }
})

app.get("/foldername", (req, res) => {
    var folderSqlSec = "SELECT create_floder from filemanagement where user_name = "
})
app.get("/directoryList", (req, res) => {
    getFileContent.getFolderList(req, res)
})
// 使用本地连接的方式解决
app.get("/profession", (req, res) => {
    var proSqlSelect = "SELECT * FROM knowledge.profession_name";
    pool.getConnection((err, conn) => {
        conn.query(proSqlSelect, function (err, result, fields) {
            if (err) {
                throw err
            }
            res.send(result);
        })
        conn.release();
    })
});
app.get('/diskFolder', (req, res) => {
    otherInfo.fileDisplay('D:/public', req, res);
})

//通过请求redis数据库获取userName
// app.get('/username', (req, res) => {
//     var key = req.query.userNameKey;
//     redisClient.get(key, (err, result) => {
//         if (err) {
//             throw err;
//         }
//         console.log(result)
//         res.send(result);
//     })
// })
app.get('/diskFolderList', (req, res) => {
    otherInfo.accrodionList('D:/public', req, res);
})
app.get('/folderList', (req, res) => {
    var folderSqlSelect = "SELECT create_floder FROM filemanagement";
    pool.getConnection((err, conn) => {
        conn.query(folderSqlSelect, (err, result, fields) => {
            var newArr = [];
            var newObj = {};
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                if (!newObj[item['create_floder']]) {
                    newObj[item['create_floder']] = newArr.push(item.create_floder);
                }
            }
            var filePath = path.resolve('D:/public');
            var deleteFloder = [];
            var addFolder = [];

            // 在这里对数据库中的文件夹和磁盘上的文件夹做一个比较 最终以磁盘上文件夹为准
            fs.readdir(filePath, (err, fields) => {
                for (var j = 0; j < newArr.length; j++) {
                    if (fields.indexOf(newArr[j]) == -1) {
                        deleteFloder.push(newArr[j]);
                        addOrDeleteFolder.deleteFloderFunc(newArr[j]);
                    }
                }
                for (var k = 0; k < fields.length; k++) {
                    if (newArr.indexOf(fields[k]) == -1) {
                        addFolder.push(fields[k]);
                    }
                }
                if (addFolder.length == 0 && fields.length == newArr.length) {
                    newArr.forEach(function (itemF) {
                        var addFile = [];
                        var deleteFile = [];
                        var filesR = [];
                        var folderPath = path.join(filePath, itemF);
                        var files = fs.readdirSync(folderPath);
                        files.forEach((itemR) => {
                            // filesR.push(itemR.split('.')[0]);
                            filesR.push(itemR);
                        })
                        var fileListSelect = "SELECT file FROM filemanagement WHERE create_floder = " + '\'' + itemF + '\'';
                        conn.query(fileListSelect, (err, result, fields) => {
                            var resultP = [];
                            for (var key in result) {
                                if (result[key].file !== 'undefined') {
                                    // resultP.push(result[key].file.split('/')[3].split('.')[0]);
                                    resultP.push(result[key].file.split('/')[3]);
                                }
                            }
                            if (filesR.length >= resultP.length) {
                                //在磁盘上面新增文件
                                filesR.forEach((itemD) => {
                                    if (resultP.indexOf(itemD) == -1) {
                                        var path2 = path.join(folderPath, itemD);
                                        path2 = 'D:/public' + '/' + itemF + '/' + itemD;
                                        addOrDeleteFolder.addFolder(itemD.split('.')[0], 'wangyang', itemF, path2);
                                    }
                                })
                                resultP.forEach((ele) => {
                                    if (filesR.indexOf(ele) == -1) {
                                            if (ele.lastIndexOf('.') != -1) {
                                                ele = ele.split('.')[0];
                                            }
                                        addOrDeleteFolder.deleteFileFunc(ele);
                                    }
                                })
                            } else if (filesR.length < resultP.length) {
                                // 在磁盘上面删除文件
                                filesR.forEach((itemD) => {
                                    if (resultP.indexOf(itemD) == -1) {
                                        var path2 = path.join(folderPath, itemD);
                                        path2 = 'D:/public' + '/' + itemF + '/' + itemD;
                                        addOrDeleteFolder.addFolder(itemD.split('.')[0], 'wangyang', itemF, path2);
                                    }
                                })
                                resultP.forEach((ele) => {
                                    if (filesR.indexOf(ele) == -1) {
                                        if (ele.lastIndexOf('.') != -1) {
                                            ele = ele.split('.')[0];
                                            
                                        }
                                        addOrDeleteFolder.deleteFileFunc(ele);
                                    }
                                })
                            } else {
                                resultP.forEach((item) => {
                                    if (filesR.indexOf(item) == -1) {
                                        addOrDeleteFolder.deleteFileFunc(item);
                                        deleteFile.push(item);
                                    }
                                })
                            }

                        })
                    })
                }

                addFolder.forEach(function (folder) {
                    var folderPath = path.join(filePath, folder);
                    var files = fs.readdirSync(folderPath);
                    var fPath;
                    if (files.length == 0) {
                        //这块应该怎么处理
                        //当文件夹下面没有文件时
                        addOrDeleteFolder.addFolder('', 'wangyang', folder, fPath);
                    } else {
                        files.forEach((item) => {
                            fPath = path.join(folderPath, item);
                            fPath = 'D:/public' + '/' + folder + '/' + item;
                            addOrDeleteFolder.addFolder(item.split('.')[0], 'wangyang', folder, fPath)
                        })
                    }
                })
            })
            if (err) throw err;
            res.send(result);
        })
        conn.release();
    })
})
//获取首页的4个title的get方法

app.get('/dailyCheck', (req, res) => {
    otherInfo.getDailyCheck(req, res);
})
app.get('/keyEventAnalysis', (req, res) => {
    otherInfo.getKeyEventAnalysis(req, res);
})

app.get('/technicalSummary', (req, res) => {
    otherInfo.getTechnicalSummary(req, res);
})

app.get('/onlineVideoTeaching', (req, res) => {
    otherInfo.getOnlineTeaching(req, res);
})

app.get("/fileType", (req, res) => {
    var sqlSelect = "SELECT * FROM knowledge.file_format";
    pool.getConnection((err, conn) => {
        conn.query(sqlSelect, function (error, result, fields) {
            if (error) {
                throw error;
            }
            res.send(result);
        })
        conn.release();
    })
});


// 将文件的具体信息 保存到buffer中 然后通过fs.writeFile读取到创建的文件夹内
var storageUpload = multer.memoryStorage();
var upload = multer({
    storage: storageUpload
})

app.post("/upload", upload.single('file'), (req, res) => {
    //文件上传的具体信息
    if (req.file) {
        GetUpload.upload(req, res);
    } else {
        res.send({
            msg: '上传的文件信息不能为空'
        });
    }
})


app.get('/fileDetails', (req, res) => {
    otherInfo.getFileDetails(req, res);
})

app.get('/createFolder', (req, res) => {
    otherInfo.createFolder(req, res);
})

//预览world pdf video文件
app.get('/priview', (req, res) => {
    getFileContent.priviewWorld(req, res);
})
app.get('/priviewPdf', (req, res) => { 
    getFileContent.priviewPdf(req, res);
})
app.get('/priviewVideo', (req, res) => {
    getFileContent.priviewVideo(req, res);
})
app.listen(4000);








