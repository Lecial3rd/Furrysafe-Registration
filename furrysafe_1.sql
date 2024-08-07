-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 03:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `furrysafe_1`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_animal_vaccine`
--

CREATE TABLE `tbl_animal_vaccine` (
  `vaccine_id` int(11) NOT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `vaccinnation_type_id` int(11) DEFAULT NULL,
  `vaccination_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_badges`
--

CREATE TABLE `tbl_badges` (
  `badge_id` int(11) NOT NULL,
  `badge_name` varchar(100) DEFAULT NULL,
  `badge_description` text DEFAULT NULL,
  `badge_icon_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_breed`
--

CREATE TABLE `tbl_breed` (
  `breed_id` int(11) NOT NULL,
  `breed_name` varchar(100) DEFAULT NULL,
  `breed_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pet`
--

CREATE TABLE `tbl_pet` (
  `pet_id` int(11) NOT NULL,
  `shelter_id` int(11) DEFAULT NULL,
  `rescuer` int(11) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pet_details`
--

CREATE TABLE `tbl_pet_details` (
  `pet_id` int(11) DEFAULT NULL,
  `breed_id` int(11) DEFAULT NULL,
  `pet_type_id` int(11) DEFAULT NULL,
  `pet_qr_code_url` varchar(255) DEFAULT NULL,
  `pet_name` varchar(50) DEFAULT NULL,
  `pet_nickname` varchar(50) DEFAULT NULL,
  `pet_age` int(11) DEFAULT NULL,
  `pet_date_of_birth` date DEFAULT NULL,
  `pet_gender` char(1) DEFAULT NULL,
  `about_pet` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pet_photos`
--

CREATE TABLE `tbl_pet_photos` (
  `pet_id` int(11) DEFAULT NULL,
  `pet_photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pet_type`
--

CREATE TABLE `tbl_pet_type` (
  `pet_type_id` int(11) NOT NULL,
  `type_name` varchar(100) DEFAULT NULL,
  `type_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_post`
--

CREATE TABLE `tbl_post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `shelter_id` int(11) DEFAULT NULL,
  `post_type_id` int(11) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_post_details`
--

CREATE TABLE `tbl_post_details` (
  `post_id` int(11) DEFAULT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `post_image_url` varchar(255) DEFAULT NULL,
  `report_type_id` int(11) DEFAULT NULL,
  `latitude` decimal(9,9) DEFAULT NULL,
  `longitude` decimal(9,9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_post_type`
--

CREATE TABLE `tbl_post_type` (
  `post_type_id` int(11) NOT NULL,
  `type_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_report_type`
--

CREATE TABLE `tbl_report_type` (
  `report_type_id` int(11) NOT NULL,
  `type_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_shelter`
--

CREATE TABLE `tbl_shelter` (
  `shelter_id` int(11) NOT NULL,
  `shelter_name` varchar(100) DEFAULT NULL,
  `shelter_address` varchar(255) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `shelter_contactno` varchar(20) DEFAULT NULL,
  `shelter_email` varchar(100) DEFAULT NULL,
  `shelter_profile_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_shelter_details`
--

CREATE TABLE `tbl_shelter_details` (
  `shelter_id` int(11) DEFAULT NULL,
  `account_detail` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_shelter_photos`
--

CREATE TABLE `tbl_shelter_photos` (
  `shelter_id` int(11) DEFAULT NULL,
  `shelter_photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_shelter_socials`
--

CREATE TABLE `tbl_shelter_socials` (
  `shelter_id` int(11) DEFAULT NULL,
  `social_media_username` varchar(50) DEFAULT NULL,
  `social_media_url` varchar(255) DEFAULT NULL,
  `socials_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_socials_type`
--

CREATE TABLE `tbl_socials_type` (
  `social_type_id` int(11) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `social_type_logo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `user_id` int(11) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`user_id`, `user_email`, `user_password`, `date_created`) VALUES
(13, 'leosalpocial@gmail.com', '123465', '2024-08-07 07:47:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_badges`
--

CREATE TABLE `tbl_user_badges` (
  `user_id` int(11) DEFAULT NULL,
  `user_badge_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_details`
--

CREATE TABLE `tbl_user_details` (
  `user_id` int(11) DEFAULT NULL,
  `user_username` varchar(50) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `mi` varchar(50) DEFAULT NULL,
  `suffixes` varchar(10) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `user_profile_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user_details`
--

INSERT INTO `tbl_user_details` (`user_id`, `user_username`, `firstname`, `lastname`, `mi`, `suffixes`, `date_of_birth`, `gender`, `user_profile_url`) VALUES
(13, 'Lecial', 'Leopoldo', 'Salpocial', 'G', NULL, '2024-08-07', 'M', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_vaccination_type`
--

CREATE TABLE `tbl_vaccination_type` (
  `vaccinnation_type_id` int(11) NOT NULL,
  `vaccine_type` varchar(150) DEFAULT NULL,
  `vaccine_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_animal_vaccine`
--
ALTER TABLE `tbl_animal_vaccine`
  ADD PRIMARY KEY (`vaccine_id`),
  ADD KEY `fk_tbl_animal_vaccine_pet_id` (`pet_id`),
  ADD KEY `fk_tbl_animal_vaccine_vaccine_type` (`vaccinnation_type_id`);

--
-- Indexes for table `tbl_badges`
--
ALTER TABLE `tbl_badges`
  ADD PRIMARY KEY (`badge_id`),
  ADD UNIQUE KEY `badge_name` (`badge_name`);

--
-- Indexes for table `tbl_breed`
--
ALTER TABLE `tbl_breed`
  ADD PRIMARY KEY (`breed_id`),
  ADD UNIQUE KEY `breed_name` (`breed_name`);

--
-- Indexes for table `tbl_pet`
--
ALTER TABLE `tbl_pet`
  ADD PRIMARY KEY (`pet_id`),
  ADD KEY `fk_tbl_pet_shelter_id` (`shelter_id`),
  ADD KEY `fk_tbl_pet_rescuer` (`rescuer`),
  ADD KEY `fk_tbl_pet_owner` (`owner`);

--
-- Indexes for table `tbl_pet_details`
--
ALTER TABLE `tbl_pet_details`
  ADD KEY `fk_tbl_pet_details_pet_id` (`pet_id`),
  ADD KEY `fk_tbl_pet_details_breed_id` (`breed_id`),
  ADD KEY `fk_tbl_pet_details_pet_type_id` (`pet_type_id`);

--
-- Indexes for table `tbl_pet_photos`
--
ALTER TABLE `tbl_pet_photos`
  ADD KEY `fk_tbl_pet_photos` (`pet_id`);

--
-- Indexes for table `tbl_pet_type`
--
ALTER TABLE `tbl_pet_type`
  ADD PRIMARY KEY (`pet_type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Indexes for table `tbl_post`
--
ALTER TABLE `tbl_post`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `fk_tbl_post_user_id` (`user_id`),
  ADD KEY `fk_tbl_post_shelter_id` (`shelter_id`),
  ADD KEY `fk_tbl_post_type_id` (`post_type_id`);

--
-- Indexes for table `tbl_post_details`
--
ALTER TABLE `tbl_post_details`
  ADD KEY `fk_tbl_post_details_post_id` (`post_id`),
  ADD KEY `fk_tbl_post_details_pet_id` (`pet_id`),
  ADD KEY `fk_tbl_post_details_report_type_id` (`report_type_id`);

--
-- Indexes for table `tbl_post_type`
--
ALTER TABLE `tbl_post_type`
  ADD PRIMARY KEY (`post_type_id`);

--
-- Indexes for table `tbl_report_type`
--
ALTER TABLE `tbl_report_type`
  ADD PRIMARY KEY (`report_type_id`);

--
-- Indexes for table `tbl_shelter`
--
ALTER TABLE `tbl_shelter`
  ADD PRIMARY KEY (`shelter_id`),
  ADD UNIQUE KEY `shelter_name` (`shelter_name`);

--
-- Indexes for table `tbl_shelter_details`
--
ALTER TABLE `tbl_shelter_details`
  ADD KEY `fk_shelter_details_shelter_id` (`shelter_id`);

--
-- Indexes for table `tbl_shelter_photos`
--
ALTER TABLE `tbl_shelter_photos`
  ADD KEY `fk_shelter_photos` (`shelter_id`);

--
-- Indexes for table `tbl_shelter_socials`
--
ALTER TABLE `tbl_shelter_socials`
  ADD KEY `fk_shelter_socials_socials_type_id` (`socials_type_id`),
  ADD KEY `fk_shelter_socials_shelter_id` (`shelter_id`);

--
-- Indexes for table `tbl_socials_type`
--
ALTER TABLE `tbl_socials_type`
  ADD PRIMARY KEY (`social_type_id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Indexes for table `tbl_user_badges`
--
ALTER TABLE `tbl_user_badges`
  ADD KEY `fk_user_badges_user_id` (`user_id`),
  ADD KEY `fk_user_badge_badge_id` (`user_badge_id`);

--
-- Indexes for table `tbl_user_details`
--
ALTER TABLE `tbl_user_details`
  ADD UNIQUE KEY `uq_user_details_user_full_name` (`firstname`,`mi`,`lastname`),
  ADD KEY `fk_user_details_user_id` (`user_id`);

--
-- Indexes for table `tbl_vaccination_type`
--
ALTER TABLE `tbl_vaccination_type`
  ADD PRIMARY KEY (`vaccinnation_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_animal_vaccine`
--
ALTER TABLE `tbl_animal_vaccine`
  ADD CONSTRAINT `fk_tbl_animal_vaccine_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `tbl_pet` (`pet_id`),
  ADD CONSTRAINT `fk_tbl_animal_vaccine_vaccine_type` FOREIGN KEY (`vaccinnation_type_id`) REFERENCES `tbl_vaccination_type` (`vaccinnation_type_id`);

--
-- Constraints for table `tbl_pet`
--
ALTER TABLE `tbl_pet`
  ADD CONSTRAINT `fk_tbl_pet_owner` FOREIGN KEY (`owner`) REFERENCES `tbl_user` (`user_id`),
  ADD CONSTRAINT `fk_tbl_pet_rescuer` FOREIGN KEY (`rescuer`) REFERENCES `tbl_user` (`user_id`),
  ADD CONSTRAINT `fk_tbl_pet_shelter_id` FOREIGN KEY (`shelter_id`) REFERENCES `tbl_shelter` (`shelter_id`);

--
-- Constraints for table `tbl_pet_details`
--
ALTER TABLE `tbl_pet_details`
  ADD CONSTRAINT `fk_tbl_pet_details_breed_id` FOREIGN KEY (`breed_id`) REFERENCES `tbl_breed` (`breed_id`),
  ADD CONSTRAINT `fk_tbl_pet_details_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `tbl_pet` (`pet_id`),
  ADD CONSTRAINT `fk_tbl_pet_details_pet_type_id` FOREIGN KEY (`pet_type_id`) REFERENCES `tbl_pet_type` (`pet_type_id`);

--
-- Constraints for table `tbl_pet_photos`
--
ALTER TABLE `tbl_pet_photos`
  ADD CONSTRAINT `fk_tbl_pet_photos` FOREIGN KEY (`pet_id`) REFERENCES `tbl_pet` (`pet_id`);

--
-- Constraints for table `tbl_post`
--
ALTER TABLE `tbl_post`
  ADD CONSTRAINT `fk_tbl_post_shelter_id` FOREIGN KEY (`shelter_id`) REFERENCES `tbl_shelter` (`shelter_id`),
  ADD CONSTRAINT `fk_tbl_post_type_id` FOREIGN KEY (`post_type_id`) REFERENCES `tbl_post_type` (`post_type_id`),
  ADD CONSTRAINT `fk_tbl_post_user_id` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`);

--
-- Constraints for table `tbl_post_details`
--
ALTER TABLE `tbl_post_details`
  ADD CONSTRAINT `fk_tbl_post_details_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `tbl_pet` (`pet_id`),
  ADD CONSTRAINT `fk_tbl_post_details_post_id` FOREIGN KEY (`post_id`) REFERENCES `tbl_post` (`post_id`),
  ADD CONSTRAINT `fk_tbl_post_details_report_type_id` FOREIGN KEY (`report_type_id`) REFERENCES `tbl_report_type` (`report_type_id`);

--
-- Constraints for table `tbl_shelter_details`
--
ALTER TABLE `tbl_shelter_details`
  ADD CONSTRAINT `fk_shelter_details_shelter_id` FOREIGN KEY (`shelter_id`) REFERENCES `tbl_shelter` (`shelter_id`);

--
-- Constraints for table `tbl_shelter_photos`
--
ALTER TABLE `tbl_shelter_photos`
  ADD CONSTRAINT `fk_shelter_photos` FOREIGN KEY (`shelter_id`) REFERENCES `tbl_shelter` (`shelter_id`);

--
-- Constraints for table `tbl_shelter_socials`
--
ALTER TABLE `tbl_shelter_socials`
  ADD CONSTRAINT `fk_shelter_socials_shelter_id` FOREIGN KEY (`shelter_id`) REFERENCES `tbl_shelter` (`shelter_id`),
  ADD CONSTRAINT `fk_shelter_socials_socials_type_id` FOREIGN KEY (`socials_type_id`) REFERENCES `tbl_socials_type` (`social_type_id`);

--
-- Constraints for table `tbl_user_badges`
--
ALTER TABLE `tbl_user_badges`
  ADD CONSTRAINT `fk_user_badge_badge_id` FOREIGN KEY (`user_badge_id`) REFERENCES `tbl_badges` (`badge_id`),
  ADD CONSTRAINT `fk_user_badges_user_id` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`);

--
-- Constraints for table `tbl_user_details`
--
ALTER TABLE `tbl_user_details`
  ADD CONSTRAINT `fk_user_details_user_id` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
