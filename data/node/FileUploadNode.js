var fs = require('fs');
var express = require('express');
var multer = require('multer');
var mysql = require('mysql');
var CreatePool = require('./db');
var CreatePool = new CreatePool();
var pool = CreatePool.getPool();
function insertToFilemanagement(insertSql) {
    pool.getConnection((err, conn) => {
        conn.query(insertSql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('数据插入成功');
            }
        })
        conn.release();
    })
}

function GetUpload() {
    this.upload = function (req, res) {
        /**
         * fs模块异步读取文件中的信息内容
         * 
        */
        var fileName, keyword, summary, professional, folderName, createDataBaseFolderName, file, userName, requestData, fileType, bufferInfo, standbyInfo;
        var allInfo;
        requestData = req.body;
        var fileInfo = req.file;
        var flag;
        if (requestData.createFolderName || requestData.folderName) {
            flag = true;
        } else {
            flag = false;
        }
        //在这里我可以读取到新建的文件夹
        if (flag) {
            var folder;
            folder = requestData.createFolderName || requestData.folderName;
            fs.mkdir(`D:/public/${folder}/`, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }
            })
            fs.writeFile(`D:/public/${folder}/${fileInfo.originalname}`, Buffer.from(fileInfo.buffer), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            fs.writeFile(`D:/public/${fileInfo.originalname}`, Buffer.from(fileInfo.buffer), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        fileName = requestData.fileName;
        keyword = requestData.keyWorld;
        summary = requestData.summary;
        professional = requestData.professional;
        folderName = requestData.folderName;
        standbyInfo = requestData.standbyInfo;
        fileType = requestData.fileType;
        allInfo = keyword + summary + standbyInfo + '';
        if ( requestData.createFolderName){
            var temporayName = requestData.createFolderName.split('/');
            createDataBaseFolderName = temporayName[ temporayName.length - 1 ];
        } else {
            createDataBaseFolderName = requestData.folderName;
        }
        // createDataBaseFolderName = requestData.createFolderName = requestData.folderName;
        var proTypeSqlSec = "SELECT profession_id FROM profession_name WHERE profession_desc =" + '\'' + professional + '\'';
        var fileTypeSqlSec = "SELECT file_id FROM file_format WHERE file_type = " + '\'' + fileType + '\'';
        var professionId, fileId;
        switch (professional) {
            case '锅炉专业':
                professionId = 1;
                break;
            case '气化专业':
                professionId = 2;
                break;
            case '电气专业':
                professionId = 3;
                break;
            case '化水专业':
                professionId = 4;
                break;
            case '环保专业':
                professionId = 5;
                break;
            default:
                professionId = 6;
                break
        }
        switch (fileType) {
            case '.doc':
                fileId = 1;
                break;
            case '.txt':
                fileId = 2;
                break;
            case '.ppt':
                fileId = 3;
                break;
            case '.xls':
                fileId = 4;
                break;

            case '.pdf':
                fileId = 5;
                break;
            case '日常巡检':
                fileId = 6;
                break;
            case '重点事件':
                fileId = 7;
                break;
            case '技术资料':
                fileId = 8;
                break;
            default:
                fileId = 1;
                break;

        }
        if (flag) {
            if (createDataBaseFolderName) {
                file = `D:/public/${requestData.createFolderName}/${fileInfo.originalname}`;
            } else {
                file = `D:/public/${folderName}/${fileInfo.originalname}`;
            }
        } else {
            file = `D:/public/${fileInfo.originalname}`;
        }
        userName = requestData.userName;
        // userName = "wangyang2";
        res.send({
            msg: '文件上传成功'
        });
        insertSql = "INSERT INTO filemanagement (" +
            "file_name, key_world, summary, professional, floder_name, create_floder, file, user_name, file_type, allInformation" +
            ") VALUES (" + '\'' + fileName + '\'' + ',' + '\'' + keyword + '\'' + ',' + '\'' + summary + '\'' + ',' + professionId + ',' + '\'' + folderName + '\'' + ',' + '\'' + createDataBaseFolderName + '\'' + ',' + '\'' + file + '\'' + ',' + '\'' + userName + '\'' + ',' + fileId + ',' + '\''+ allInfo + '\''+ ")";
        insertToFilemanagement(insertSql);
    }

}

module.exports = GetUpload;