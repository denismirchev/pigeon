-- MariaDB dump 10.19  Distrib 10.5.22-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: pigeon
-- ------------------------------------------------------
-- Server version	10.5.22-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` VALUES (1,'bd4e99a69bb9f9f93c08867155b4ad285bdd74693dcaa7a2752fd42a3cb8820c',1732297575946);
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_post` (`user_id`,`post_id`),
  KEY `likes_post_id_posts_id_fk` (`post_id`),
  CONSTRAINT `likes_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,2,3,'2024-11-22 18:06:57'),(2,2,2,'2024-11-22 18:08:15'),(3,2,1,'2024-11-22 18:08:16'),(4,3,5,'2024-11-22 18:10:51'),(5,3,3,'2024-11-22 18:10:52'),(6,3,1,'2024-11-22 18:10:54'),(7,4,6,'2024-11-22 18:13:44'),(8,4,7,'2024-11-22 18:13:45'),(9,2,6,'2024-11-22 18:14:44'),(10,2,8,'2024-11-22 18:14:45'),(11,2,7,'2024-11-22 18:14:46'),(12,5,8,'2024-11-22 18:30:44'),(13,5,6,'2024-11-22 18:30:45'),(14,5,10,'2024-11-22 18:30:48'),(15,5,9,'2024-11-22 18:30:49'),(16,5,5,'2024-11-22 18:30:54'),(17,5,3,'2024-11-22 18:30:54'),(18,5,2,'2024-11-22 18:30:55'),(19,5,1,'2024-11-22 18:30:56'),(20,6,3,'2024-12-26 15:07:56'),(21,6,1,'2024-12-26 15:07:56'),(23,6,5,'2024-12-26 15:52:38'),(24,6,10,'2024-12-26 16:34:32');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `content` text NOT NULL,
  `attachments` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `repost_id` bigint(20) unsigned DEFAULT NULL,
  `likes_count` bigint(20) unsigned DEFAULT 0,
  `replies_count` bigint(20) unsigned DEFAULT 0,
  `reposts_count` bigint(20) unsigned DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `posts_parent_id_posts_id_fk` (`parent_id`),
  KEY `posts_repost_id_posts_id_fk` (`repost_id`),
  CONSTRAINT `posts_parent_id_posts_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `posts_repost_id_posts_id_fk` FOREIGN KEY (`repost_id`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'5 laws for engineer career success:\r\n\r\n1. Do good work\r\n2. Work on something you care about\r\n3. Never stop learning\r\n4. Focus on your strengths\r\n5. Don’t forget to have fun',NULL,'2024-11-22 17:50:55','2024-12-26 15:07:56',NULL,NULL,4,0,0),(2,1,'A Machine Learning Engineer walks into a bar.  \r\n\r\nThe bartender: What will you have? \r\n\r\nMachine Learning Engineer: What\'s everyone else having?',NULL,'2024-11-22 17:51:11','2024-11-22 18:30:55',NULL,NULL,2,0,0),(3,1,'On November 22, 1988 – In Palmdale, California, the first prototype B-2 Spirit stealth bomber is revealed.\r\n','1732297887281-Gc_is0FXwAAMPye.jpg','2024-11-22 17:51:27','2024-12-26 15:07:56',NULL,NULL,4,1,0),(4,2,'In January 1945, the world\'s first flying wing was flown in Germany, 43 years before the B-2. \r\n\r\nThe Horton prototype fell into the hands of the Americans in Thuringia. The Hortens were taken to London for interrogation. The V3 prototype of the Horton ended up in America.','1732298795678-GdAVZmpXwAApfYZ.jpg','2024-11-22 18:06:35','2024-11-22 18:06:35',3,NULL,0,0,0),(5,2,'Mercedes: \"We will turn over every stone\"\r\n\r\nMercedes Speaker \"In the coming years, we will reduce our costs by several billion euros a year\".\r\n\r\n\"The global economic situation remains extremely volatile. Only by sustainably increasing efficiency can we remain financially strong and able to act.\"\r\n\r\nAs long as automakers don\'t understand that the largest part of their problem is uncompetitive BEVs they won\'t get out of the down spiral\r\n\r\nMercedes emphasized that job security remains in place for most employees in Germany. Just as the VW Group had job security - until it was cancelled by VW from one day to the next. There is no such thing as job security because it can be canceled unilaterally at any time.\r\n\r\nCFO Wilhelm on the Q3 results ‘These results do not meet our expectations,’ explained CFO Harald Wilhelm at the end of October. He announced that he would pay even closer attention to costs and efficiency in future. \"We will turn over every stone,\" said Wilhelm.\r\n\r\nIt\'s only a question of time when Mercedes-Benz will announce job cuts and not if.',NULL,'2024-11-22 18:07:56','2024-12-26 15:52:38',NULL,NULL,3,0,0),(6,3,'I\'m not sure what changes @Tesla\r\n has implemented, but with the release of Tesla OS v2024.33.35 (also known as FSD v12.5.6.3), the trip planner is now remarkably precise. \r\n\r\nIn the past, especially on windy days like today, the trip planner could be off by as much as 10% (especially when going >5mph over the speed limit). Over the last two days, we\'ve experienced winds gusting over 30 mph, and despite maintaining a speed offset of +9 mph for much of the trip, the trip planner predicted our arrival SoC within a single percent! Perhaps FSD speed profiles are now fully integrated into the trip planner\'s calculations? Either way, great work @Tesla @Tesla_na @TeslaCharging!\r\n\r\n@notateslaapp','1732299089738-Gc6oCeQXoAABrrE.jpg','2024-11-22 18:11:29','2024-11-22 18:30:45',NULL,NULL,3,2,0),(7,3,'UPDATE: Many on v2024.33.5 (aka FSD v12.5.4.2) have also noticed similar improvements in trip planner accuracy. This leads me to believe these changes were either made in a previous build and/or changes were made server-side. Either way really appreciate this @Tesla!',NULL,'2024-11-22 18:11:48','2024-11-22 18:14:46',6,NULL,2,0,0),(8,4,'Actually trip planner got a huge rewrite on the back end. I had a great conversation with one of the engineers working on this over a morning run a few weeks back, it\'s pretty neat. The rewrite also unlocks additional features, like desired arrival charge.',NULL,'2024-11-22 18:13:56','2024-12-26 15:05:02',6,NULL,2,1,2),(9,2,'Its the continues improvements that make Tesla vehicles so awesome',NULL,'2024-11-22 18:14:57','2024-11-22 18:30:49',NULL,8,1,0,0),(10,5,'TESLA MAY SOON ALLOW DRIVERS TO SET DESIRED ARRIVAL CHARGE #HolidayUpdate 🤞\r\n@itskyleconner @Out_of_Spec',NULL,'2024-11-22 18:30:43','2024-12-26 16:34:32',NULL,8,2,0,0),(11,6,'Really?',NULL,'2024-12-26 15:05:02','2024-12-26 15:05:02',8,NULL,0,0,0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token` varchar(1024) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password_hash` text NOT NULL,
  `username` varchar(50) NOT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `profile_image_url` varchar(256) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'World of Engineering','engineers_feed@pigeon.com','$2b$12$/UenP3VgrMXJbgXRuk2j/eI5EqybojloL.GL5nswXXEN145VmKFfu','engineers_feed','The most fun way to learn something new everyday','','worldofengineering.com','1732297815837-profile-picture.png','2024-11-22 17:48:49','2024-11-22 17:50:15'),(2,'Alex','alex_avoigt@pigeon.com','$2b$12$/UenP3VgrMXJbgXRuk2j/eI5EqybojloL.GL5nswXXEN145VmKFfu','alex_avoigt','Author, Blogger, Influencer, YouTuber, Engineer, Sportsman, Thinker, Nerd, Environmentalist','Munich, Bavaria','patreon.com/AlexVoigt','1732298740621-profile-picture.png','2024-11-22 18:04:02','2024-11-22 18:05:40'),(3,'Dan Burkland','DBurkland@pigeon.com','$2b$12$/UenP3VgrMXJbgXRuk2j/eI5EqybojloL.GL5nswXXEN145VmKFfu','DBurkland','EV enthusiast, motorsports aficionado, and techy passionate about the move to sustainable energy & transport.','Minnesota, USA','dburkland.com','1732299036582-profile-picture.png','2024-11-22 18:09:39','2024-11-22 18:10:36'),(4,'Wes','wmorrill3@pigeon.com','$2b$12$/UenP3VgrMXJbgXRuk2j/eI5EqybojloL.GL5nswXXEN145VmKFfu','wmorrill3','Biking, Running, Hiking, Climbing - Always adventuring.   Cybertruck Lead Engineer + Reliability, Test, and Analysis for all Tesla vehicles.','Bay Area, CA','ts.la/westbrook42371','1732299214006-profile-picture.png','2024-11-22 18:12:46','2024-11-22 18:13:34'),(5,'Freddy','bruhther_fred@pigeon.com','$2b$12$/UenP3VgrMXJbgXRuk2j/eI5EqybojloL.GL5nswXXEN145VmKFfu','bruhther_fred','','Chicago, IL','','1732300196211-profile-picture.png','2024-11-22 18:29:03','2024-11-22 18:30:05'),(6,'test','test@test.com','$2b$12$/UenP3VgrMXJbgXRuk2j/eI5EqybojloL.GL5nswXXEN145VmKFfu','test','','','','1735230447254-profile-picture.png','2024-12-25 14:16:55','2024-12-26 16:27:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-26 18:50:14

