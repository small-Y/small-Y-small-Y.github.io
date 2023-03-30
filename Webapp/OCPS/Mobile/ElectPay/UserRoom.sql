/*
Navicat PGSQL Data Transfer

Source Server         : ThingsOS
Source Server Version : 100100
Source Host           : localhost:5432
Source Database       : ElectPay
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 100100
File Encoding         : 65001

Date: 2018-04-30 17:17:20
*/


-- ----------------------------
-- Table structure for UserRoom
-- ----------------------------
DROP TABLE IF EXISTS "public"."UserRoom";
CREATE TABLE "public"."UserRoom" (
"T_UserID" varchar(255) COLLATE "default" NOT NULL,
"T_RoomID" varchar(500) COLLATE "default",
"T_RoomName" varchar(500) COLLATE "default",
"T_isBinding" int2,
"notice" int2 DEFAULT 0
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------
