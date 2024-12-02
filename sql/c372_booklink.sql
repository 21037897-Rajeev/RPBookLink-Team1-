CREATE DATABASE  IF NOT EXISTS `c372_booklink` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `c372_booklink`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: c372_booklink
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cartId` int NOT NULL AUTO_INCREMENT,
  `cartProductQuantity` int NOT NULL,
  `cartProductId` int NOT NULL,
  `cartUserId` int NOT NULL,
  PRIMARY KEY (`cartId`),
  KEY `cart_fk1_idx` (`cartProductId`),
  KEY `cart_user_fk2_idx` (`cartUserId`),
  CONSTRAINT `cart_product_fk1` FOREIGN KEY (`cartProductId`) REFERENCES `products` (`productId`),
  CONSTRAINT `cart_user_fk2` FOREIGN KEY (`cartUserId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `categoryId` int NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) NOT NULL,
  `categoryDescription` varchar(255) NOT NULL,
  `categoryImage` varchar(255) NOT NULL,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`categoryName`, `categoryDescription`, `categoryImage`) 
VALUES 
('Sweets and Snacks', 'A variety of sweet and savory snacks perfect for any occasion.', '/images/sweet.jpeg'),
('Beverages', 'Soft drinks, juices, and energy drinks to quench your thirst.', '/images/beverage.jpeg'),
('Stationery', 'Office and school supplies, including pens, notebooks, and other essentials.', '/images/stationary.jpeg'),
('Tech Accessories', 'Gadgets and accessories including chargers, USB drives, and more.', '/images/tech.jpeg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `orderId` int NOT NULL AUTO_INCREMENT,
  `orderProductId` int NOT NULL,
  `orderProductQuantity` int NOT NULL,
  `orderUserId` int NOT NULL,
  `orderDate` date NOT NULL,
  PRIMARY KEY (`orderId`),
  KEY `fk_product_order_idx` (`orderProductId`),
  KEY `fk_user_order_idx` (`orderUserId`),
  CONSTRAINT `fk_product_order` FOREIGN KEY (`orderProductId`) REFERENCES `products` (`productId`),
  CONSTRAINT `fk_user_order` FOREIGN KEY (`orderUserId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
ALTER TABLE order_items ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'To Ship';
--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;

UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(255) NOT NULL,
  `productDescription` text NOT NULL,
  `productImage` text NOT NULL,
  `productPrice` decimal(10,2) NOT NULL,
  `productStock` int DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  PRIMARY KEY (`productId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`productName`, `productDescription`, `productImage`, `productPrice`, `productStock`, `categoryId`) 
VALUES
-- Sweets and Snacks
('Chocolate Bars', 'A delicious selection of milk and dark chocolate bars.', 'chocolate.jpeg', 3.99, 50, 1),
('Gummy Bears', 'Chewy and fruity gummy bears in an assortment of colors and flavors.', 'bear.jpeg', 2.49, 100, 1),
('Potato Chips', 'Crunchy and salty potato chips, perfect for snacking.', 'chips.jpeg', 1.99, 75, 1),

-- Beverages
('Coca-Cola 330ml', 'Refreshing Coca-Cola, perfect for quenching your thirst.', 'cola.jpeg', 1.49, 200, 2),
('Pepsi 330ml', 'A chilled can of Pepsi, a classic refreshing drink.', 'pepsi.jpeg', 1.49, 150, 2),
('Lemonade', 'Fresh and tangy lemonade made with real lemons.', 'lemonade.jpeg', 2.29, 120, 2),

-- Stationery
('Notebooks', 'Pack of 3 high-quality notebooks for school and office use.', 'notebook.jpeg', 5.99, 60, 3),
('Pens', 'Pack of 10 blue ink pens, perfect for writing and note-taking.', 'pens.png', 2.99, 200, 3),
('Highlighters', 'Set of 4 colorful highlighters for marking important text.', 'highlighter.jpeg', 3.49, 150, 3),

-- Tech Accessories
('USB Flash Drive 32GB', 'Portable 32GB USB flash drive for storing files and documents.', 'usb.jpeg', 9.99, 100, 4),
('Wireless Mouse', 'Ergonomic wireless mouse, ideal for laptops and desktops.', 'mouse.jpeg', 15.99, 80, 4),
('Phone Charger Cable', 'Durable phone charging cable for quick charging on the go.', 'charger.jpeg', 6.49, 120, 4);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
UPDATE products SET categoryId = 3 WHERE productId IN (4, 5, 6);  -- For "Sweets and Snacks"
UPDATE products SET categoryId = 4 WHERE productId IN (7, 8, 9);  -- For "Beverages"
UPDATE products SET categoryId = 5 WHERE productId IN (10, 11, 12);  -- For "Stationery"
UPDATE products SET categoryId = 6 WHERE productId IN (13, 14, 15);  -- For "Tech Accessories"
--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `reviewId` int NOT NULL AUTO_INCREMENT,
  `reviewContent` varchar(255) NOT NULL,
  `reviewRating` int NOT NULL,
  `reviewImage` varchar(255) NOT NULL,
  `reviewedByUserId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`reviewId`),
  KEY `fk_product_review` (`productId`),
  KEY `fk_user_review_idx` (`reviewedByUserId`),
  CONSTRAINT `fk_product_review` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`),
  CONSTRAINT `fk_user_review` FOREIGN KEY (`reviewedByUserId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'I like the fact that it\'s plain. I can be as creative as I wish!',4,'ai-generated-8821413_640.jpg',1,1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `userRole` varchar(45) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `userEmail` (`userEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bobochan','bobochan@gmail.com','7c4a8d09ca3762af61e59520943dc26494f8941b','user'),(2,'admin','admin@gmail.com','7c4a8d09ca3762af61e59520943dc26494f8941b','admin'),(3,'mary','mary@gmail.com','7c4a8d09ca3762af61e59520943dc26494f8941b','user');
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

-- Dump completed on 2024-10-14 22:12:53
