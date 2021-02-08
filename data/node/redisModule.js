/**
 * 封装一个redis的module 
*/
var redis = require('redis');
var log4js = require('log4js');
var logger = log4js.getLogger('redis');
var client = redis.createClient('6379', '10.91.11.23');
var redisDb = {};
var RDS_PWD = 'redc123@tpri';
client.auth(RDS_PWD, () => {
    console.log("通过认证");
})

client.on('error', (err) => {
    logger.error('redis error: ' + err);
})

client.on('connect', () => {
    logger.info('redis connect success');
})
/**
 * @param key 键
 * @param callback 回调
 * 
*/
redisDb.get = (key, callback) => {
    client.get(key, (err, result) => {
        if (err) {
            logger.error('redis失败：' + err);
            callback(err, null);
            return
        }
        callback(null, result);
    })

}
module.exports = redisDb;