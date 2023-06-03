CREATE TABLE `User` (
	`user_num`	INT(6)	NOT NULL	AUTO_INCREMENT	PRIMARY KEY ,
	`user_id`	VARCHAR(20)	NOT NULL,
	`password`	VARCHAR(255)	NOT NULL,
	`nickname`	VARCHAR(30)	NOT NULL	DEFAULT 'user',
	`email`	VARCHAR(100)	NOT NULL,
	`img`	VARCHAR(255)	NULL,
	`profile_msg`	VARCHAR(255)	NULL,
	`alarm`	BOOLEAN	NOT NULL	DEFAULT 0,
	`user_status`	VARCHAR(30)	NOT NULL	DEFAULT '인증대기',
	`signup_date`	DATETIME	NULL,
	`last_login_date`	DATETIME	NULL,
	`expire_date`	DATETIME	NULL
);

CREATE TABLE `Todo` (
	`todo_id`	INT	NOT NULL	auto_increment PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`cat_id`	INT	NOT NULL,
	`todo_date`	DATETIME	NOT NULL,
	`todo_cont`	TEXT	NOT NULL,
	`todo_time`	DATETIME	NULL,
	`todo_create_time`	DATETIME	NOT NULL DEFAULT (current_time),
	`todo_checked`	BOOLEAN	NOT NULL	DEFAULT 0,
	`todo_check_time`	DATETIME	NULL
);

CREATE TABLE `Category` (
	`cat_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`cat_title`	VARCHAR(255)	NOT NULL,
	`cat_access`	VARCHAR(30)	NOT NULL DEFAULT '전체공개'
);

CREATE TABLE `Sticker_info` (
	`sticker_id`	INT	NOT NULL	auto_increment PRIMARY KEY,
	`sticker_img`	VARCHAR(255)	NOT NULL
);

CREATE TABLE `Sticker_history_todo` (
	`t_give_sticker_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`sticker_id`	INT	NOT NULL,
	`todo_id`	INT	NOT NULL,
	`user_num`	INT	NOT NULL
);

CREATE TABLE `Follow` (
	`follow_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`follower_num`	INT	NOT NULL,
	`following_num`	INT	NOT NULL
);

CREATE TABLE `EmailAuth` (
	`auth_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`auth_code`	INT(6)	NOT NULL,
	`auth_time`	DATETIME	NOT NULL	DEFAULT (current_time)
);


ALTER TABLE Todo ADD FOREIGN KEY(user_num) references User(user_num);

ALTER TABLE Todo ADD FOREIGN KEY(cat_id) references Category(cat_id);

ALTER TABLE Category ADD FOREIGN KEY(user_num) references User(user_num);

ALTER TABLE Sticker_history_todo ADD FOREIGN KEY(sticker_id) references Sticker_info(sticker_id);

ALTER TABLE Sticker_history_todo ADD FOREIGN KEY(todo_id) references Todo(todo_id);

ALTER TABLE Sticker_history_todo ADD FOREIGN KEY(user_num) references User(user_num);

ALTER TABLE Follow ADD FOREIGN KEY(following_num) references User(user_num);

ALTER TABLE EmailAuth ADD FOREIGN KEY(user_num) references User(user_num);