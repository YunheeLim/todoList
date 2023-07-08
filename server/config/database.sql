CREATE DATABASE tododb  default CHARACTER SET UTF8;

use tododb;

CREATE TABLE `User` (
	`user_num`	INT(6)	NOT NULL	AUTO_INCREMENT	PRIMARY KEY ,
	`user_id`	VARCHAR(20)	NOT NULL,
	`password`	VARCHAR(255)	NOT NULL,
	`user_name`	VARCHAR(30)	NOT NULL,
	`email`	VARCHAR(100)	NOT NULL,
	`img`	VARCHAR(255)	NULL,
	`profile_msg`	VARCHAR(255)	NULL,
	`alarm`	BOOLEAN	NOT NULL	DEFAULT 0,
	`user_status`	VARCHAR(30)	NOT NULL	DEFAULT '인증대기',
	`signup_date`	DATETIME	NULL,
	`last_login_date`	DATETIME	NULL,
	`expire_date`	DATETIME	NULL
);

CREATE TABLE `EmailAuth` (
	`auth_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`auth_code`	INT(6)	NOT NULL,
	`auth_time`	DATETIME	NOT NULL	DEFAULT (current_time),
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Login_history` (
	`login_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`login_date`    DATETIME	NOT NULL    DEFAULT (current_time),
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Category` (
	`cat_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`cat_title`	VARCHAR(255)	NOT NULL,
	`cat_access`	VARCHAR(30)	NOT NULL DEFAULT '전체공개',
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE
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
	`todo_check_time`	DATETIME	NULL,
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (cat_id) 
    REFERENCES Category (cat_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Diary` (
	`diary_id`	INT	NOT NULL	auto_increment PRIMARY KEY,
	`user_num`	INT	NOT NULL,
	`diary_cont`	TEXT	NOT NULL,
	`diary_create_time`	DATETIME	NOT NULL DEFAULT (current_time),
	`diary_update_time`	DATETIME    NULL,
    `diary_access`	VARCHAR(30)	NOT NULL	DEFAULT '전체공개',
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Sticker_info` (
	`sticker_id`	INT	NOT NULL	auto_increment PRIMARY KEY,
	`sticker_img`	VARCHAR(255)	NOT NULL
);

CREATE TABLE `Sticker_history_todo` (
	`t_give_sticker_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`sticker_id`	INT	NOT NULL,
	`todo_id`	INT	NOT NULL,
	`user_num`	INT	NOT NULL,
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (todo_id) 
    REFERENCES Todo (todo_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sticker_id) 
    REFERENCES Sticker_info (sticker_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Sticker_history_diary` (
	`d_give_sticker_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`sticker_id`	INT	NOT NULL,
	`diary_id`	INT	NOT NULL,
	`user_num`	INT	NOT NULL,
    FOREIGN KEY (user_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (diary_id) 
    REFERENCES Diary (diary_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sticker_id) 
    REFERENCES Sticker_info (sticker_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Follow` (
	`follow_id`	INT	NOT NULL	auto_increment	PRIMARY KEY,
	`follower_num`	INT	NOT NULL,
	`following_num`	INT	NOT NULL,
    FOREIGN KEY (follower_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (following_num) 
    REFERENCES User (user_num) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX todo_idx ON Todo (user_num,cat_id);
CREATE INDEX cat_idx ON Category (user_num);
CREATE INDEX emailAuth_idx ON EmailAuth (user_num);
CREATE INDEX follower_idx ON Follow (follower_num);
CREATE INDEX following_idx ON Follow (following_num);
CREATE INDEX diary_idx ON Diary (user_num);
CREATE INDEX todo_stick_his_idx ON Sticker_history_todo (todo_id);
CREATE INDEX diary_stick_his_idx ON Sticker_history_diary (diary_id);

CREATE VIEW todo_sticker_view AS 
SELECT T.todo_id, T.user_num, T.cat_id, T.todo_date, T.todo_cont, T.todo_time, T.todo_create_time, T.todo_checked, S.sticker_id, S.user_num "by_user"
FROM Todo AS T, Sticker_history_todo AS S 
WHERE T.todo_id = S.todo_id;

CREATE VIEW diary_sticker_view AS 
SELECT D.diary_id, D.user_num, D.diary_cont, D.diary_create_time, D.diary_update_time, D.diary_access, S.sticker_id, S.user_num "by_user"
FROM Diary AS D, Sticker_history_diary AS S 
WHERE D.diary_id = S.diary_id;