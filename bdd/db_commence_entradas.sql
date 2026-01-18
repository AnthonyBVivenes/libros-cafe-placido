-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db_commence
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `entradas`
--

DROP TABLE IF EXISTS `entradas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entradas` (
  `identradas` int NOT NULL,
  `ventanaHTML` varchar(16) NOT NULL,
  `imagen` varchar(256) NOT NULL DEFAULT '[0]',
  `alt` varchar(128) NOT NULL,
  `titulo` varchar(128) NOT NULL,
  `parrafo` varchar(512) NOT NULL DEFAULT '',
  PRIMARY KEY (`identradas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entradas`
--

LOCK TABLES `entradas` WRITE;
/*!40000 ALTER TABLE `entradas` DISABLE KEYS */;
INSERT INTO `entradas` VALUES (1,'index','[4,6,4]','[\"Los mejores libro\",\"Un espacio agradable\",\"Al mejor precio\"]','[\"Los mejores libro\",\"Un espacio agradable\",\"Al mejor precio\"]','[\"Tu mente merece lo mejor. en la librerira La Casa de la Sabiduria, encuentras los libros que inspiran, enseñan y transforman.\",\" Descubre el libro que cambiara tu historia.\",\" En librería La casa de la Sabiduria, cada pagina es una oportunidad. Libros para todos, precios para ti.\"]'),(2,'index','[16]','[\"algo\"]','[\"Precios y Accesibilidad\"]','[\"...\"]'),(3,'index','[17]','[\"otro mas\"]','[\"Experiencia del lector\"]','[\"...\"]'),(4,'index','[17]','[\"cosas\"]','[\"Variedad y Curaduria\"]','[\"Tu proxima gran lectura esta aqui\"]'),(5,'index','[17]','[\"cosas\"]','[\"mas articulos\"]','[\"Aquí\"]');
/*!40000 ALTER TABLE `entradas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-18 10:29:38
