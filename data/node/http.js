var http = require("http");
var mysql = require("mysql");
var url = require("url");
var express = require("express");
var app = express();
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'angular@1234',
    database: 'knowledge',
    port: '3306'
});
connection.connect();
var sqlSelect = "SELECT * FROM filemanagement";
connection.query(sqlSelect, function(error, result, fields){
    if (error){
        throw error;
    }
    sqlResult = result;
})

var sqlResult;
connection.end();



app.get("http://localhost:5000/fileInfo", function (req, res) {
    res.send(sqlResult)
});
var server = http.createServer(function(req, res){
    res.setHeader('Content-type', "text/html;charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    //解析url中的参数
    var params = url.parse(req.url, true).query;
    var name = params.name;
    var urlName = params.url;
    
    res.writeHead(200, 'ok');
    // res.write(JSON.stringify(sqlResult));
    // res.send(sqlResult);
    // res.write(JSON.stringify(sqlResult));
    // res.write(JSON.stringify(params));

    res.write(name + '\t' + urlName);
    res.end();
})



//接受请求

//上传文件



server.listen(5000);
console.log('node服务器打开');
