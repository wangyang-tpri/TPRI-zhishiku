var fs = require('fs');
var CreatePool = require('./db');
var CreatePool = new CreatePool();
var pool = CreatePool.getPool();
var path = require('path');
const { get } = require('./redisModule');
//读取磁盘上面对应的文件夹下面的文件  展示到前台
function OtherInfo() {
    let titleFolder = {
        daily: '日常巡检报告',
        event: '重点事件分析',
        technical: '技术资料汇总',
        online: '在线视频教学'
    }
    this.getDailyCheck = function (req, res) {
        getFile(titleFolder.daily, req, res);
    }
    function getFile(folder, req, res) {
        var path2 = path.resolve('D:/public', folder);
        fs.readdir(path2, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    }
    this.getKeyEventAnalysis = function (req, res) {
        getFile(titleFolder.event, req, res);
    }

    this.getTechnicalSummary = function (req, res) {
        getFile(titleFolder.technical, req, res);
    }

    this.getOnlineTeaching = function (req, res) {
        getFile(titleFolder.online, req, res);
    }
    this.getFileDetails = (req, res) => {
        var name = req.query.name;
        var folder = req.query.folder;
        var fileArr = [];
        if (name) {
            var filePath = path.resolve('D:/public/' + folder, name);
            fs.stat(filePath, (err, result) => {
                if (err) throw err;
                fileArr.push(name);
                fileArr.push(result.birthtime);
                res.send(fileArr);
            })
        } else {
            res.send('请求的文件不存在');
        }

    }
    this.fileDisplay = async function (filePath, req, res) {
        var name = req.query.name;
        var reqType = req.query.type;
        var filePath2;
        if (name) {
            filePath2 = filePath + '/' + name;
        } else {
            filePath2 = filePath;
        }
        filePath2 = path.resolve(filePath2);
        fs.readdir(filePath2, (err, files) => {
            res.send(files);
        })
    }


    this.accrodionList = (filePath, req, res) => {
        var name = req.query.name;
        var reqType = req.query.type;
        var filePath2;
        if (name) {
            filePath2 = filePath + '/' + name;
        } else {
            filePath2 = filePath;
        }
        filePath2 = path.resolve(filePath2);
        var folderArr = [];
        var fileArr = [];
        fs.readdir(filePath2, function (err, files) {
            files.forEach((fileName) => {
                var fileDir = path.resolve(filePath2, fileName);
                fs.stat(fileDir, (err, fields) => {
                    if (err) {
                        throw err;
                    }

                    var isFil = fields.isFile();
                    var isDir = fields.isDirectory();
                    if (isFil) {
                        fileArr.push(fileName);
                    } else {
                        folderArr.push(fileName);
                    }
                })

                res.send({
                    fileResult: fileArr,
                    folderResult: folderArr
                })
            })
        })
    }

    this.createFolder = (req, res) => {
        var list = ['日常巡检报告', '重点事件分析', '技术资料汇总', '在线视频教学'];
        for (var key in list) {
            fs.mkdir(`D:/public/${list[key]}`, { recursive: true }, (err) => {
            })
        }
        res.send(
            'ok'
        )
    }
}

module.exports = OtherInfo;