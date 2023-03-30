CREATE TABLE [UserScoreOrderTable] (
	[T_OrderID] varchar(256)  PRIMARY KEY NOT NULL,
	[T_UserID] bigint NOT NULL, 
	[T_UserName] varchar(64) NOT NULL,
	[T_OrderNo] varchar(256) UNIQUE NOT NULL,
	[T_OrderTime] datetime NOT NULL,
	[T_Year] int NOT NULL,
	[T_Month] int NOT NULL,
	[T_Day] int NOT NULL,
	[T_Hour] int NOT NULL,
	[T_Subject] varchar(2000) NOT NULL,
	[T_Body] varchar(4000) NOT NULL,
	[T_Description] varchar(4000) NULL,
	[T_UserScore] int, 
	[T_Paid] int NULL,
	[T_Refund] int NULL,
	[T_RefundTime] datetime NULL,
	[T_Type] int NOT NULL,
	[T_AppID] varchar(256) NOT NULL,
	[T_OrderCreated] varchar(32) NOT NULL
)
GO

CREATE INDEX [IDX_UserScoreOrderTable1] ON [UserScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_Year]  ASC,
	[T_Month]  ASC,
	[T_Day]  ASC,
	[T_Hour] ASC
)
GO

CREATE INDEX [IDX_UserScoreOrderTable2] ON [UserScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_Year]  ASC,
	[T_Month]  ASC,
	[T_Day]  ASC
)
GO

CREATE INDEX [IDX_UserScoreOrderTable3] ON [UserScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_Year]  ASC,
	[T_Month]  ASC
)
GO

CREATE INDEX [IDX_UserScoreOrderTable4] ON [UserScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_AppID]  ASC
)
GO

CREATE TABLE [GoldScoreOrderTable] (
	[T_OrderID] varchar(256)  PRIMARY KEY NOT NULL,
	[T_UserID] bigint NOT NULL, 
	[T_UserName] varchar(64) NOT NULL,
	[T_OrderNo] varchar(256) UNIQUE NOT NULL,
	[T_OrderTime] datetime NOT NULL,
	[T_Year] int NOT NULL,
	[T_Month] int NOT NULL,
	[T_Day] int NOT NULL,
	[T_Hour] int NOT NULL,
	[T_Subject] varchar(2000) NOT NULL,
	[T_Body] varchar(4000) NOT NULL,
	[T_Description] varchar(4000) NULL,
	[T_GoldScore] int, 
	[T_Paid] int NULL,
	[T_Refund] int NULL,
	[T_RefundTime] datetime NULL,
	[T_AppID] varchar(256) NOT NULL,
	[T_OrderCreated] varchar(32) NOT NULL
)
GO

CREATE INDEX [IDX_GoldScoreOrderTable1] ON [GoldScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_Year]  ASC,
	[T_Month]  ASC,
	[T_Day]  ASC,
	[T_Hour] ASC
)
GO

CREATE INDEX [IDX_GoldScoreOrderTable2] ON [GoldScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_Year]  ASC,
	[T_Month]  ASC,
	[T_Day]  ASC
)
GO

CREATE INDEX [IDX_GoldScoreOrderTable3] ON [GoldScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_Year]  ASC,
	[T_Month]  ASC
)
GO

CREATE INDEX [IDX_GoldScoreOrderTable4] ON [GoldScoreOrderTable](
	[T_OrderTime]  ASC,
	[T_AppID]  ASC
)
GO



CREATE TABLE [ProductDataTable] (
	[T_ProductID] varchar(256)  PRIMARY KEY NOT NULL,
	[T_ProductName] varchar(256) NOT NULL,
	[T_ProductDescription] varchar(4000) NOT NULL,
	[T_ProductCount] int NULL,
	[T_Amount] int NULL,
	[T_Discount] int NULL,
	[T_Goldcount] int NULL,
	[T_SupplierName] varchar(256) NOT NULL,
	[T_SupplierAddress] varchar(256) NOT NULL,
	[T_SupplierPhone] varchar(256) NOT NULL
)
GO

CREATE TABLE [ProductImageTable] (
	[T_ProductID] varchar(256)  PRIMARY KEY NOT NULL,
	[T_ProductImage] varchar(2000) NOT NULL
)
GO


CREATE TABLE [ProductSuggestionTable] (
	[T_ParentID] int  NOT NULL,
	[T_SuggestionID] int  PRIMARY KEY NOT NULL,
	[T_ProductID] varchar(256)  NULL,
	[T_Time] datetime  NULL,
	[T_UserID] varchar(256)  NULL,
	[T_UserName] varchar(64)  NULL,
	[T_UserImg] varchar(2000)  NULL,
	[T_Body] varchar(4000)  NULL,
	[T_Goodcount] int NULL
)
GO

CREATE TABLE [ProductSuggestionImageTable] (
	[T_SuggestionID] int  NOT NULL,
	[T_ImageFile] varchar(2000)  NULL
)
GO

CREATE TABLE [ProductLinkTable] (
	[T_ProductID] varchar(256)  NULL,
	[T_LinkUser] varchar(256)  NULL
)
GO

CREATE TABLE [ProductOpenTable] (
	[T_ProductID] varchar(256)  NULL,
	[T_OpenUser] varchar(256)  NULL
)
GO

CREATE TABLE [PointValueAppTable] (
	[T_AppID] varchar(256)  PRIMARY KEY NOT NULL,
	[T_AppName] varchar(256) NOT NULL,
	[T_AppSecret] varchar(256) NOT NULL
)
GO

INSERT INTO PointValueAppTable(T_AppID,T_AppName,T_AppSecret) VALUES ('tsa0cc6750d16cc2cd','内置积分应用','fc8f34da990edf89c2438095417bf59fcd542215')
GO

CREATE TABLE [PointValueActivityTable] (
	[T_ActivityID] varchar(256)  PRIMARY KEY NOT NULL,
	[T_ActivityName] varchar(256) NOT NULL,
	[T_Double] int NULL,
	[T_StartTime] datetime NOT NULL,
	[T_EndTime] datetime NOT NULL,
	[T_AppID] varchar(256) NOT NULL,
	[T_ActivityCreated] varchar(256) NOT NULL
)
GO