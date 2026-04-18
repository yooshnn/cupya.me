PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE `al_arcades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`is_closed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(1,'싸이뮤직게임월드','cygameworld',0,'2026-03-08 11:45:16');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(2,'더벙커게임존','thebunker',0,'2026-03-08 11:45:16');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(3,'어뮤즈타운','amusetown',0,'2026-03-08 23:51:56');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(4,'게임디','gamed',0,'2026-03-09 00:16:37');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(5,'로얄상구','sanggu',0,'2026-03-09 00:28:38');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(6,'타이코랩스','taikolabs',0,'2026-03-09 00:52:27');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(7,'놀자','nolja',0,'2026-03-09 00:59:25');
INSERT INTO "al_arcades" ("id","name","slug","is_closed","created_at") VALUES(8,'게임플라자','gameplaza',0,'2026-03-10 06:08:21');
CREATE TABLE `al_channels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`arcade_id` integer NOT NULL,
	`youtube_channel_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`arcade_id`) REFERENCES `al_arcades`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(1,1,'UCG-csD9dY7pLkaJ7PsTOWOQ','2026-03-08 11:45:16');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(2,2,'UCLvuGQuvGYnYB6qvI7OpDKA','2026-03-08 11:45:16');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(3,3,'UCrfjvbLX1cMKxNgCY468vHQ','2026-03-08 23:52:39');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(4,4,'UCgVMW6Fuotx5z5ld2jNtGJw','2026-03-09 00:18:01');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(5,4,'UCwhu9jsWe7zDT9APi47WzvA','2026-03-09 00:18:01');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(6,4,'UCNb7BZC8hWrgasQZyTQ5lOw','2026-03-09 00:18:01');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(7,4,'UC83JoaXBbEyhkLQg01QTjhg','2026-03-09 00:18:01');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(8,4,'UCsZX0E0vg2WqBrJnbBIQ6bA','2026-03-09 00:18:01');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(9,5,'UC7o4reUePhwvBeCpxfUa8QQ','2026-03-09 00:29:52');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(10,5,'UCEQphuwuPHCWghzu9s_1zSA','2026-03-09 00:29:52');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(11,6,'UC0tzRzxBMM1-riQVHHYoADw','2026-03-09 00:52:49');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(12,7,'UCYaEzGnyLgHghiSMjrJRfbQ','2026-03-09 01:02:15');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(13,7,'UCAwOws8hSbNPdIOpPO6fnXw','2026-03-09 01:02:15');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(14,7,'UCJ7h38DHBimdkflSXIlGqnw','2026-03-09 01:02:15');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(15,8,'UCaTxEWzoi9sas8osPox-kcw','2026-03-10 06:08:43');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(16,1,'UCT4Jwp0Yn9OsxTKiaDVhqgQ','2026-03-31 00:33:08');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(17,1,'UC0SIVGtcYhp80-zRatpjnjg','2026-03-31 00:33:08');
INSERT INTO "al_channels" ("id","arcade_id","youtube_channel_id","created_at") VALUES(18,1,'UCpNAEJ-rMg9CoguWZNYBLSg','2026-03-31 00:33:08');
CREATE TABLE `al_games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`alias` text NOT NULL,
	`slug` text NOT NULL
);
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(1,'CHUNITHM','츄니즘','chunithm');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(2,'SOUND VOLTEX','SDVX','sdvx');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(3,'beatmania IIDX','IIDX','iidx');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(4,'maimai でらっくす','마이마이','maimai');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(5,'jubeat','유비트','jubeat');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(6,'GITADORA','기타도라','gitadora');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(7,'DanceDanceRevolution','DDR','ddr');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(8,'NOSTALGIA','노스텔지어','nos');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(9,'EZ2AC','EZ2AC','ez2ac');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(10,'太鼓の達人','태고의 달인','taiko');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(11,'pop''n music','팝픈뮤직','popn');
INSERT INTO "al_games" ("id","name","alias","slug") VALUES(12,'DANCERUSH STARDOM','댄스러시','drs');
CREATE TABLE `al_stream_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`arcade_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	`keyword` text NOT NULL,
	`machine_label` text,
	`priority` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`arcade_id`) REFERENCES `al_arcades`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`game_id`) REFERENCES `al_games`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(1,1,1,'[CHUNITHM] [No.1]','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(2,1,1,'[CHUNITHM] [No.4]','4',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(3,1,2,'[SDVX] [VM - No.1]','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(4,1,2,'[SDVX] [VM - No.2]','2',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(5,1,2,'[SDVX] [VM - No.3]','3',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(6,1,2,'[SDVX] [VM - No.4]','4',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(7,1,2,'[SDVX] [VM - No.7]','7',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(8,1,2,'[SDVX] [VM - No.8]','8',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(9,1,2,'[SDVX] [VM - No.9]','9',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(10,1,2,'[SDVX] [VM - No.10]','10',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(11,1,3,'[IIDX] [LM - No.1]','LM 1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(12,1,3,'[IIDX] [LM - No.2]','LM 2',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(13,1,3,'[IIDX] [SM]','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(14,1,4,'[maimai DX] [No.1]','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(15,1,4,'[maimai DX] [No.3]','3',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(16,1,4,'[maimai DX] [No.4]','4',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(17,1,4,'[maimai DX] [No.6]','6',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(18,1,4,'[maimai DX] [No.7]','7',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(19,1,4,'[maimai DX] [No.8]','8',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(20,1,5,'[jubeat]','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(21,1,6,'[GITADORA GF ARENA]','기타',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(22,1,6,'[GITADORA DM ARENA]','도라',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(23,1,7,'[DDR]',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(24,1,8,'[NOS]',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(25,1,9,'[EZ2AC]',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(26,1,10,'[Taiko]',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(27,1,11,'[pop''n PPM] [No.1]','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(28,1,11,'[pop''n PPM] [No.2]','2',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(29,1,11,'[pop''n PPM] [No.3]','3',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(30,1,11,'[pop''n PPM] [No.4]','4',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(31,2,1,'츄니즘','1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(32,2,2,'사운드볼텍스 발키리 1번','VM 1',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(33,2,2,'사운드볼텍스 발키리 2번','VM 2',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(34,2,2,'사운드볼텍스 발키리 3번','VM 3',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(35,2,2,'사운드볼텍스','1',10,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(36,2,3,'비트매니아 라이트닝','LM',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(37,2,3,'비트매니아','1',10,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(38,2,4,'마이마이 디럭스 2번','2',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(39,2,4,'마이마이 디럭스','1',10,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(40,2,5,'유비트',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(41,2,6,'기타도라 세션','세션',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(42,2,7,'DDR',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(43,2,8,'노스텔지어',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(44,2,9,'EZ2FN',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(45,2,10,'태고의달인',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(46,2,11,'신 팝픈뮤직 팝군모델','PM',0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(47,2,11,'팝픈뮤직','1',10,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(48,2,12,'댄스러쉬',NULL,0,'2026-03-08 11:45:16');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(49,3,11,'Pop''n music','2',0,'2026-03-09 00:01:11');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(50,3,2,'SDVX -Valkyrie model-','2',0,'2026-03-09 00:01:11');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(51,3,5,'jubeat',NULL,0,'2026-03-09 00:01:11');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(52,3,3,'IIDX LIGHTNING MODEL','1',0,'2026-03-09 00:01:11');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(53,3,9,'EZ2DJ',NULL,0,'2026-03-09 00:01:11');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(54,3,7,'DDR',NULL,0,'2026-03-09 00:01:11');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(55,3,1,'CHUNITHM','2',0,'2026-03-09 00:01:12');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(56,3,6,'GITADORA ARENA DM','도라',0,'2026-03-09 00:01:12');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(57,3,6,'GITADORA ARENA GF','기타',0,'2026-03-09 00:01:12');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(58,4,1,'CHUNITHM',NULL,0,'2026-03-09 00:21:27');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(59,4,11,'pop''n music',NULL,0,'2026-03-09 00:21:27');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(60,4,2,'SOUND VOLTEX',NULL,0,'2026-03-09 00:21:27');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(61,4,4,'maimai',NULL,0,'2026-03-09 00:21:27');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(62,4,10,'太鼓の達人',NULL,0,'2026-03-09 00:21:27');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(63,5,6,'GUITAR','기타',0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(64,5,6,'Drum','도라',0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(65,5,2,'SOUND VOLTEX Valkyrie model No.2','2',0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(66,5,2,'SOUND VOLTEX Valkyrie model No.4','4',0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(67,5,4,'maimaiDX A LIVE','A',0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(68,5,4,'maimaiDX B LIVE','B',0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(69,5,1,'CHUNITHM',NULL,0,'2026-03-09 00:34:05');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(70,6,10,'TAIKO LABS #1','1',0,'2026-03-09 00:54:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(71,6,10,'TAIKO LABS #2','2',0,'2026-03-09 00:54:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(72,6,10,'TAIKO LABS #3','3',0,'2026-03-09 00:54:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(73,6,10,'TAIKO LABS #4','4',0,'2026-03-09 00:54:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(74,6,10,'TAIKO LABS #5','5',0,'2026-03-09 00:54:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(75,6,10,'TAIKO LABS #C','콘솔',0,'2026-03-09 00:54:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(76,7,4,'maimaiDX',NULL,0,'2026-03-09 01:01:28');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(77,7,2,'SOUND VOLTEX EXCEED GEAR LIVE No.1',NULL,0,'2026-03-09 01:01:28');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(78,7,9,'이지투 아케이드',NULL,0,'2026-03-09 01:01:28');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(79,8,9,'EZ2AC',NULL,0,'2026-03-10 06:21:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(80,8,4,'maimai DX (1번기)','1',0,'2026-03-10 06:21:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(81,8,4,'maimai DX (2번기)','2',0,'2026-03-10 06:21:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(82,8,4,'maimai DX (3번기)','3',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(83,8,4,'maimai DX (4번기)','4',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(84,8,4,'maimai DX (5번기)','5',0,'2026-03-10 06:21:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(85,8,2,'SOUND VOLTEX VM (1번기)','1',0,'2026-03-10 06:21:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(86,8,2,'SOUND VOLTEX VM (2번기)','2',0,'2026-03-10 06:21:39');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(87,8,2,'SOUND VOLTEX VM (3번기)','3',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(88,8,2,'SOUND VOLTEX VM (4번기)','4',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(89,8,2,'SOUND VOLTEX VM (5번기)','5',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(90,8,2,'SOUND VOLTEX VM (6번기)','6',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(91,8,2,'SOUND VOLTEX VM (7번기)','7',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(92,8,2,'SOUND VOLTEX VM (8번기)','8',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(93,8,2,'SOUND VOLTEX VM (9번기)','9',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(94,8,2,'SOUND VOLTEX VM (10번기)','10',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(95,8,2,'SOUND VOLTEX VM (11번기)','11',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(96,8,2,'SOUND VOLTEX VM (12번기)','12',0,'2026-03-10 06:21:42');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(97,8,2,'SOUND VOLTEX VM (13번기)','13',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(98,8,1,'CHUNITHM (1번기)','1',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(99,8,1,'CHUNITHM (2번기)','2',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(100,8,1,'CHUNITHM (3번기)','3',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(101,8,3,'beatmania IIDX (1번기)','1',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(102,8,3,'beatmania IIDX (2번기)','2',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(103,8,3,'beatmania IIDX LIGHTNING MODEL','LM',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(104,8,11,'pop''n music (1번기)','1',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(105,8,11,'pop''n music (2번기)','2',0,'2026-03-10 06:21:40');
INSERT INTO "al_stream_rules" ("id","arcade_id","game_id","keyword","machine_label","priority","created_at") VALUES(106,8,11,'pop''n music (3번기)','3',0,'2026-03-10 06:21:40');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('al_games',12);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('al_arcades',8);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('al_channels',18);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('al_stream_rules',106);
CREATE UNIQUE INDEX `al_arcades_slug_unique` ON `al_arcades` (`slug`);
CREATE INDEX `idx_arcades_is_closed` ON `al_arcades` (`is_closed`);
CREATE INDEX `idx_arcades_slug` ON `al_arcades` (`slug`);
CREATE UNIQUE INDEX `al_channels_youtube_channel_id_unique` ON `al_channels` (`youtube_channel_id`);
CREATE INDEX `idx_channels_arcade_id` ON `al_channels` (`arcade_id`);
CREATE UNIQUE INDEX `al_games_name_unique` ON `al_games` (`name`);
CREATE UNIQUE INDEX `al_games_alias_unique` ON `al_games` (`alias`);
CREATE UNIQUE INDEX `al_games_slug_unique` ON `al_games` (`slug`);
CREATE INDEX `idx_stream_rules_arcade_id_priority` ON `al_stream_rules` (`arcade_id`,`priority`);
CREATE INDEX `idx_stream_rules_game_id` ON `al_stream_rules` (`game_id`);
CREATE UNIQUE INDEX `al_stream_rules_arcade_id_game_id_keyword_unique` ON `al_stream_rules` (`arcade_id`,`game_id`,`keyword`);
CREATE INDEX al_idx_channels_arcade_id ON al_channels(arcade_id);
CREATE INDEX al_idx_stream_rules_arcade_id_priority ON al_stream_rules(arcade_id, priority);
CREATE INDEX al_idx_stream_rules_game_id ON al_stream_rules(game_id);
CREATE INDEX al_idx_arcades_is_closed ON al_arcades(is_closed);
CREATE INDEX al_idx_arcades_slug ON al_arcades(slug);
