var CreatePool = require("./db");
var createPool = new CreatePool();
var pool = createPool.getPool();


function AddOrDeleteFolder() {
    this.addFolder = function (fileName, userName, folderName, fPath) {
        var addSql = "INSERT INTO filemanagement (" +
            "file_name, key_world, summary, professional, floder_name, create_floder, file, user_name, file_type" +
            ") VALUES (" + '\'' + fileName + '\'' + ',' + '\'' + '磁盘插入' + '\'' + ',' + '\'' + '磁盘插入' + '\'' + ',' + 1 + ',' + '\'' + folderName + '\'' + ',' + '\'' + folderName + '\'' + ',' + '\'' + fPath + '\'' + ',' + '\'' + userName + '\'' + ',' + 1 + ")";
        pool.getConnection((err, conn) => {
            conn.query(addSql, (err, result) => {
                if (err) throw err;

            })
            conn.release();
        })

    }
    this.deleteFloderFunc = function (folderName) {
        
        var deleteSql = "DELETE FROM filemanagement WHERE create_floder = " + '\'' + folderName + '\'';
        pool.getConnection((err, conn) => {
            conn.query(deleteSql, (err, result) => {
                if (err) throw err;
                console.log('删除操作完成');
            })
            conn.release();
        })
    }
    this.deleteFileFunc = function (fileName){
        var deleteFileSql = "DELETE FROM filemanagement WHERE file_name = " + '\'' + fileName + '\'';
        pool.getConnection( (err, conn) => {
            conn.query(deleteFileSql, (err, result) => {
                if(err) throw err;
            })
        })
    }
}

module.exports = AddOrDeleteFolder;