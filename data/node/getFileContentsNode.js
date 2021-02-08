// 将文件中的内容读取成二进制格式的数据
var fs = require('fs');
var  CreatePool = require('./db');
const { type } = require('os');
const { response } = require('express');
var  CreatePool = new CreatePool();
var  pool = CreatePool.getPool();
const { runInThisContext } = require('vm');
function GetFileContents() {
    this.getFile = function (req, res) {
        var fileName = req.query.fileInput;
        var isDirectory = req.query.isDirectory;
        var searchSql;
        if (isDirectory) {
            searchSql = "SELECT file_name, upload_time, file From filemanagement WHERE file_name LIKE " + '\'%' + fileName + '%\'';
        } else {
            searchSql = "SELECT file FROM filemanagement WHERE create_floder LIKE " + '\'%' + fileName + '%\'';
        }
        pool.getConnection((err, conn) => {
            conn.query(searchSql, (err, result, fields) => {
                if (err) {
                    throw err;
                }
                if (result.length == 0) {
                    //从磁盘上面直接读取根据文件名 读取文件
                }
                res.send({
                    result: result
                });
            })
            conn.release();
        })

    }
    this.keyWorldSearchFile = function (req, res) {
        var keyWorld = req.query.fileInput;
        var isDirectory = req.query.isDirectory;
        var searchSql;

        searchSql = "SELECT file_name, upload_time, file From filemanagement WHERE allInformation  LIKE " + '\'%' + keyWorld + '%\'';

        pool.getConnection((err, conn) => {
            conn.query(searchSql, (err, result, fields) => {
                if (err) {
                    throw err;
                }
                res.send({
                    result: result
                });
            })
            conn.release();
        })

    }

    this.downloadFile = function (req, res) {
        var fileName = decodeURIComponent(req.query.fileName);
        fileName = fileName.split('.')[0];
        res.writeHead(200, {
            'Content-Type': 'application/msword',
            'Content-Disposition': 'attachment;filename=' + encodeURI(fileName) + '.docx'
        })
        // 根据fileName和userName获取对应文件的目录 filePath
        pool.getConnection((err, conn) => {
            var filePathSqlSelect = "SELECT file FROM filemanagement WHERE file_name = " + '\'' + fileName + '\'';
            conn.query(filePathSqlSelect, (err, result, fields) => {
                if (err) throw err;
                var fileStream;
                var filePathSplit;
                filePathSplit = result[0].file.split('/');
                if (filePathSplit[filePathSplit.length - 1].indexOf('.docx') != -1) {
                    fileStream = fs.createReadStream(result[0].file);
                } else {
                    fileStream = fs.createReadStream(result[0].file + '.docx'); //输入流
                }
                fileStream.on('data', (chuck) => {
                    res.write(chuck, 'binary')  //文档内容以二进制的格式的写到response的输出流
                })
                fileStream.on('end', () => {
                    res.end()
                })
            })
            conn.release();
        })
    }

    this.getFolderList = function (req, res) {
        var folderName = req.query.folder;
        var selectDirectorySql = "SELECT file_name FROM filemanagement WHERE create_floder = " + '\'' + folderName + '\'';
        pool.getConnection((err, conn) => {
            conn.query(selectDirectorySql, (err, result, fields) => {
                if (err) throw err;
                for (var key in result) {
                    if (result[key].file_name == "") {
                        result.splice(key, 1);
                    }
                }
                res.send(result)
            })
            conn.release();
        })
    }
    this.priviewWorld = (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'binary'
        })
        var filePath;
        if (req.query.fileName.indexOf('.') != -1) {
            filePath = decodeURIComponent(req.query.fileName);
        } else {
            filePath = decodeURIComponent(req.query.fileName) + '.docx';
        }
        var fileStream;
        fileStream = fs.createReadStream(filePath);
        fileStream.on('data', (chuck) => {
            res.write(chuck, 'binary')
        })
        fileStream.on('end', () => {
            res.end()
        })
    }
    this.priviewPdf = (req, res) => {
        var pdfPath = req.query.filePath;
        var fileStream;
        pdfPath = decodeURIComponent(pdfPath);
        fileStream = fs.createReadStream(pdfPath);
        fileStream.on('data', (chuck) => {
            res.write(chuck, 'binary')
        })
        fileStream.on('end', () => {
            res.end();
        })
    }
    this.priviewVideo = (req, res) => {
        var videoPath = req.query.filePath;
        let path = videoPath;
        videoPath = decodeURIComponent(videoPath);
        let stat = fs.statSync(videoPath);
        let fileSize = stat.size;
        let range = req.headers.range;
        let parts = range.replace(/bytes=/, "").split("-");
        if (parts[1] !== '') {
            let start = parseInt(parts[0], 10);
            // parseInt('string', 10)可解析一个字符串，并返回一个整数
            // 返回这个string被解析成的整数
            let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;
            // end 在最后取值为 fileSize - 1 
            end = end > fileSize - 1 ? fileSize - 1 : end;
            let chunksize = (end - start) + 1;
            let file = fs.createReadStream(path, { start, end });
            let head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            file.pipe(res);
        } else {
            let head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }
    }
}
module.exports = GetFileContents;