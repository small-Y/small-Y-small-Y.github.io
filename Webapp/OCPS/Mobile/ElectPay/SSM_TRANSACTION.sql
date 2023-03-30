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

Date: 2018-04-30 17:17:36
*/


-- ----------------------------
-- Table structure for SSM_TRANSACTION
-- ----------------------------
DROP TABLE IF EXISTS "public"."SSM_TRANSACTION";
CREATE TABLE "public"."SSM_TRANSACTION" (
"ROWID" varchar(50) COLLATE "default" NOT NULL,
"PayID" varchar(50) COLLATE "default" NOT NULL,
"InsideNO" varchar(100) COLLATE "default",
"OutsideNO" varchar(200) COLLATE "default",
"BusinessType" varchar(255) COLLATE "default",
"PayUserID" varchar(255) COLLATE "default",
"PayUserName" varchar(255) COLLATE "default",
"ReceiveUserID" varchar(100) COLLATE "default",
"ReceiveUserName" varchar(255) COLLATE "default",
"AmountPay" float4,
"PayType" varchar(255) COLLATE "default",
"PreBalance" varchar(255) COLLATE "default",
"Balance" varchar(255) COLLATE "default",
"OperateStatus" varchar(255) COLLATE "default",
"BusinessStatus" varchar(255) COLLATE "default",
"Note" text COLLATE "default",
"Operator" varchar(255) COLLATE "default",
"CreateTime" timestamptz(6),
"UpdateTime" timestamptz(6),
"HTTP_HOST" varchar(1000) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table SSM_TRANSACTION
-- ----------------------------
ALTER TABLE "public"."SSM_TRANSACTION" ADD PRIMARY KEY ("ROWID");
