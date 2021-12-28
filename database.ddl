CREATE DATABASE `users` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_turkish_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;


CREATE TABLE `token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `token` varchar(200) COLLATE utf8_turkish_ci DEFAULT NULL,
  `expire_date` datetime DEFAULT NULL,
  `url` varchar(200) COLLATE utf8_turkish_ci DEFAULT NULL,
  `ip` varchar(200) COLLATE utf8_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `token_ibfk_1` (`user_id`),
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;

CREATE TABLE `logs` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `LOG` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `Level` varchar(10) COLLATE utf8_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `user_name` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `user_surname` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `user_password` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `user_email` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `user_type` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_turkish_ci;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_user`(in username varchar(100), in user_name varchar(100), in user_surname varchar(100),in user_password varchar(100),in user_email varchar(1000),in user_type varchar(100),in createdAt varchar(100),in updateAt varchar(100))
BEGIN
 insert into users (username,user_name,user_surname,user_password,user_email, user_type,createdAt,updatedAt) VALUES (username,user_name , user_surname, user_password, user_email, user_type,createdAt,updateAt);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_user`(in user_id int)
BEGIN
 delete from users where id = user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAll`()
BEGIN
select * from users;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getById`(in user_id int)
BEGIN
 select * from users where id = user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_user`(in username varchar(100), in user_name varchar(100), in user_surname varchar(100),in user_password varchar(100),in user_email varchar(1000),in user_type varchar(100),in user_id varchar(100),in updateAt varchar(100))
BEGIN
UPDATE users
   SET username = username, user_name = user_name, user_surname = user_surname, user_password = user_password , user_email = user_email, user_type = user_type, updatedAt = updateAt
      WHERE id = user_id;
 DELETE FROM token WHERE token.user_id = user_id;   
END$$
DELIMITER ;
