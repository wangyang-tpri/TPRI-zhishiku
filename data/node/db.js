var mysql = require("mysql");

function CreatePool() {
    this.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'angular@#1234',
        database: 'knowledge',
        port: 3306
    })

    this.getPool = function () {
        return this.pool;
    }
}


module.exports = CreatePool;