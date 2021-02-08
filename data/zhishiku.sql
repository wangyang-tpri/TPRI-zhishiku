SET NAMES utf8;
DROP TABLE IF EXISTS `fileManagement`;

CREATE TABLE `fileManagement`
(
    `file_id` INT
(11) NOT NULL AUTO_INCREMENT COMMENT '上传文件的id',
    `file_name` VARCHAR
(64) NOT NULL COMMENT '文件名称',
    `key_world` VARCHAR
(30) NOT NULL COMMENT '上传内容的关键字',
    `upload_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传文件的时间',
    `summary` VARCHAR
(1240)  NOT NULL COMMENT '上传文件的摘要',
    `professional` INT
(11) NOT NULL COMMENT '上传文件的专业',
    `floder_name` VARCHAR
(30) COMMENT '上传文件所属的文件夹',
    `create_floder` VARCHAR
(30) COMMENT '新建的文件夹',
    `file` VARCHAR
(120) COMMENT '上传文件的内容',
    `user_name` VARCHAR
(30) NOT NULL COMMENT '上传文件的用户',
    `file_type` INT
(11) COMMENT '上传文件类型',         
    `stanby_world` VARCHAR
(64) COMMENT '备用字段1',
    `standby_world2` VARCHAR
(64) COMMENT '备用字段2',    
    PRIMARY KEY
(`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;



CREATE TABLE
IF NOT EXISTS `user_Info`
(
    `user_id` INT
(11) NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR
(30) NOT NULL COMMENT '用户登录名称',
    `user_passworld` VARCHAR
(64) NOT NULL COMMENT '用户登录密码',
    `user_right` INT
(11) NOT NULL COMMENT '用户的权限',
    PRIMARY KEY
(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE
IF NOT EXISTS `right_control` (
    `right_id` INT
(11) NOT NULL AUTO_INCREMENT COMMENT '权限id',
    `rights` INT
(11) NOT NULL COMMENT '用户的不同权限',
    `file_folder` VARCHAR
(32) NOT NULL COMMENT '不同的用户权限对应的文件夹的目录',
    `user_menu` INT
(11) NOT NULL DEFAULT 1 COMMENT '不同权限在页面中展示不同的内容',
    `notes` VARCHAR
(128) NOT NULL DEFAULT '文件夹的说明' COMMENT '文件夹说明',
    PRIMARY KEY
(`right_id`) 
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;



CREATE TABLE
IF NOT EXISTS `file_format` (
    `file_id` INT
(11) NOT NULL AUTO_INCREMENT COMMENT '文件类型id',
    `file_type` VARCHAR
(32) NOT NULL COMMENT '文件夹的类型',
    `file_description` VARCHAR
(32) NOT NULL COMMENT '文件夹的描述',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY
(`file_id`)
 ) ENGINE InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE
IF NOT EXISTS `profession_name` (
    `profession_id` INT
(11) NOT NULL AUTO_INCREMENT COMMENT '专业id',
    `profession_name` VARCHAR
(32) NOT NULL COMMENT '专业名称',
    `profession_desc` VARCHAR
(32) NOT NULL COMMENT  '专业描述',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY
(`profession_id`)
 ) ENGINE InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;