-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Oct 26, 2026 at 08:18 AM
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
-- Database: `stark_jobs`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_listing_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('applied','under_review','shortlisted','interview','rejected','withdrawn') NOT NULL DEFAULT 'applied',
  `cover_note` text DEFAULT NULL,
  `resume_snapshot_path` varchar(255) DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `job_listing_id`, `user_id`, `company_id`, `status`, `cover_note`, `resume_snapshot_path`, `applied_at`, `created_at`, `updated_at`) VALUES
(2, 5, 6, 3, 'interview', 'I am very interested in this role and have hands-on experience in the required technical skills.', 'resumes/to8TKwwcOgELCn79nC5Cp0jqJDHH1XoLMA8hKZV8.pdf', '2026-10-24 01:52:15', '2026-10-24 01:52:15', '2026-10-24 01:52:56'),
(3, 3, 6, 3, 'shortlisted', 'I am very interested in this role and have hands-on experience in the required technical skills.', 'resumes/to8TKwwcOgELCn79nC5Cp0jqJDHH1XoLMA8hKZV8.pdf', '2026-10-24 07:31:36', '2026-10-24 07:31:36', '2026-10-24 07:34:18'),
(4, 4, 6, 3, 'interview', 'urgentb', 'resumes/to8TKwwcOgELCn79nC5Cp0jqJDHH1XoLMA8hKZV8.pdf', '2026-10-24 07:35:53', '2026-10-24 07:35:53', '2026-10-24 07:36:28');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Electrical & Electronics', 'electrical-electronics', 'Zap', 'Industrial electricians, wiring, transformers, control panel technicians.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(2, 'Mechanical & Machinery', 'mechanical-machinery', 'Wrench', 'CNC operators, lathe machinists, pump technicians, hydraulic maintenance.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(3, 'Fabrication & Welding', 'fabrication-welding', 'Flame', 'TIG/MIG welders, structural fitters, pipe fabricators.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(4, 'Automotive & Garage', 'automotive-garage', 'Car', 'Two-wheeler and heavy vehicle technicians, diesel mechanics.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(5, 'Construction & Civil Trades', 'construction-civil-trades', 'Hammer', 'Masonry, plumbing, painting, bar bending, tile laying.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(6, 'Teaching & Education', 'teaching-education', 'GraduationCap', 'Trade instructors, vocational trainers, school and academy faculty.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(7, 'Logistics & Warehousing', 'logistics-warehousing', 'Truck', 'Forklift operators, inventory supervisors, dispatch coordinators.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(8, 'Textile & Garment Operations', 'textile-garment-operations', 'Scissors', 'Spinning technicians, loom operators, industrial tailoring.', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `district_id` bigint(20) UNSIGNED DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  `company_size` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `company_name`, `slug`, `logo`, `industry`, `district_id`, `location`, `website`, `phone`, `email`, `about`, `verification_status`, `company_size`, `created_at`, `updated_at`) VALUES
(2, 3, 'Stark Industries', 'testcompany-6ad849248be3a', 'company_logos/XF97RM7gsijHs90rCFn2qFZ51XtJUcHLBzTUNcn5.jpg', 'Industrial & Technical', NULL, NULL, NULL, '+91 98765 43210', 'hr@starkindustries.com', NULL, 'pending', NULL, '2026-10-20 23:39:56', '2026-10-21 03:27:15'),
(3, 5, 'stark', 'stark-6ad871f3b1888', 'company_logos/lbEQIb3OyP1QOY9blJKvR3sYx6hG0YGuVpWBIQO7.png', 'Industrial & Technical', NULL, 'sls nagar 3rd street02, Thoothukudi', 'https://www.starksoftech.in/', '08870389520', 'info@starksoftech.com', 'software company', 'pending', '10 - 50 employees', '2026-10-21 02:34:03', '2026-10-21 06:14:04');

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL DEFAULT 'Tamil Nadu',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `state`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Thoothukudi', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(2, 'Chennai', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(3, 'Coimbatore', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(4, 'Madurai', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(5, 'Tirunelveli', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(6, 'Tiruchirappalli', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(7, 'Salem', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(8, 'Erode', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(9, 'Vellore', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(10, 'Thanjavur', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(11, 'Dindigul', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47'),
(12, 'Kanyakumari', 'Tamil Nadu', 1, '2026-10-17 02:14:47', '2026-10-17 02:14:47');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interviews`
--

CREATE TABLE `interviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `interview_date` datetime NOT NULL,
  `round_name` varchar(255) NOT NULL DEFAULT 'Technical Interview',
  `interview_type` enum('online','in_person') NOT NULL DEFAULT 'online',
  `meeting_link` varchar(255) DEFAULT NULL,
  `location_address` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('scheduled','completed','rescheduled','cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `interviews`
--

INSERT INTO `interviews` (`id`, `application_id`, `company_id`, `user_id`, `interview_date`, `round_name`, `interview_type`, `meeting_link`, `location_address`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 6, '2026-10-25 10:00:00', 'Technical Interview', 'online', 'https://meet.google.com/stark-tech-eval', 'Stark Tech Park, Thoothukudi', 'Candidate has applied for electrician. Review electrical maintenance experience and industrial certifications.', 'scheduled', '2026-10-24 02:32:23', '2026-10-24 02:32:40'),
(2, 2, 3, 6, '2026-10-24 14:30:00', 'HR Screening Round', 'in_person', NULL, 'Floor 2, HR Department, Stark Office, Tuticorin', 'Initial screening round to discuss salary expectations and joining timeline.', 'scheduled', '2026-10-24 02:32:23', '2026-10-24 02:32:40');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_listings`
--

CREATE TABLE `job_listings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `district_id` bigint(20) UNSIGNED DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `job_type` enum('Full-time','Part-time','Contract','Internship') NOT NULL DEFAULT 'Full-time',
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `salary_currency` varchar(255) NOT NULL DEFAULT 'INR',
  `experience` varchar(255) DEFAULT NULL,
  `openings` int(11) NOT NULL DEFAULT 1,
  `description` text NOT NULL,
  `responsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`responsibilities`)),
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `status` enum('active','paused','closed') NOT NULL DEFAULT 'active',
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_listings`
--

INSERT INTO `job_listings` (`id`, `company_id`, `title`, `category_id`, `district_id`, `location`, `job_type`, `min_salary`, `max_salary`, `salary_currency`, `experience`, `openings`, `description`, `responsibilities`, `requirements`, `status`, `expires_at`, `created_at`, `updated_at`) VALUES
(3, 3, 'mechanic', 1, 1, 'Thoothukudi, TN', 'Full-time', 18000.00, 25000.00, 'INR', '1-3 Years', 1, 'Job opportunity for mechanic at Demo Industries.', '[\"Perform assigned operational duties according to specifications.\",\"Adhere to factory safety protocols and maintenance standards.\"]', '[\"Relevant trade qualification or experience.\",\"Good technical understanding and problem solving ability.\"]', 'active', '2026-11-20', '2026-10-21 06:10:55', '2026-10-21 08:13:36'),
(4, 3, 'electrician', 1, 1, 'Thoothukudi, TN', 'Full-time', 18000.00, 25000.00, 'INR', '1-3 Years', 1, 'Job opportunity for electrician at Demo Industries.', '[\"Perform assigned operational duties according to specifications.\",\"Adhere to factory safety protocols and maintenance standards.\"]', '[\"Relevant trade qualification or experience.\",\"Good technical understanding and problem solving ability.\"]', 'active', '2026-11-20', '2026-10-21 06:11:50', '2026-10-21 08:13:36'),
(5, 3, 'electrician', 1, 1, 'Thoothukudi, TN', 'Full-time', 18000.00, 25000.00, 'INR', '1-3 Years', 1, 'Job opportunity for electrician at Demo Industries.', '[\"Perform assigned operational duties according to specifications.\",\"Adhere to factory safety protocols and maintenance standards.\"]', '[\"Relevant trade qualification or experience.\",\"Good technical understanding and problem solving ability.\"]', 'active', '2026-11-20', '2026-10-21 06:16:28', '2026-10-21 08:13:36');

-- --------------------------------------------------------

--
-- Table structure for table `job_seeker_profiles`
--

CREATE TABLE `job_seeker_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `headline` varchar(255) DEFAULT NULL,
  `district_id` bigint(20) UNSIGNED DEFAULT NULL,
  `current_location` varchar(255) DEFAULT NULL,
  `experience_level` varchar(255) DEFAULT NULL,
  `expected_salary` decimal(10,2) DEFAULT NULL,
  `resume_path` varchar(255) DEFAULT NULL,
  `resume_filename` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `professional_summary` text DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `education` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`education`)),
  `work_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`work_history`)),
  `preferred_locations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferred_locations`)),
  `profile_completion` int(11) NOT NULL DEFAULT 80,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_seeker_profiles`
--

INSERT INTO `job_seeker_profiles` (`id`, `user_id`, `headline`, `district_id`, `current_location`, `experience_level`, `expected_salary`, `resume_path`, `resume_filename`, `linkedin_url`, `github_url`, `portfolio_url`, `professional_summary`, `skills`, `education`, `work_history`, `preferred_locations`, `profile_completion`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, NULL, 'Chennai, Tamil Nadu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Senior Full Stack & AI Systems Engineer with proven industry track record.', '[\"React\",\"Laravel\",\"Python\",\"MySQL\"]', '[{\"degree\":\"B.Tech IT\",\"institution\":\"Anna University\",\"year\":\"2019-2023\",\"grade\":\"86%\"}]', NULL, NULL, 30, '2026-10-20 23:39:54', '2026-10-21 01:20:43'),
(2, 4, NULL, NULL, NULL, NULL, NULL, 'resumes/ghOlWRn6KJM76vuRkSDvUOmWrekpeQgDuiQZJtJk.pdf', 'Srikanth_M.pdf', 'https://www.linkedin.com/in/srikanth1523', NULL, NULL, 'Software Engineer Intern candidate with strong hands-on experience in Python-based backend systems, web application development, and database-driven applications. Proven ability to design, implement, and maintain scalable software solutions through real-world projects. Passionate about building reliable systems, writing clean code, and contributing to production-level software in fast-paced environments.', '[\"Python\",\"JavaScript\",\"Java\",\"React\",\"React.js\",\"Next.js\",\"HTML\",\"CSS\",\"Tailwind CSS\",\"FastAPI\",\"Django\",\"Flask\",\"Odoo\",\"Frappe\",\"MySQL\"]', '[{\"degree\":\"M.Sc. Data Science\",\"institution\":\"Nehru Arts and Science College, Bharathiar University\",\"year\":\"2024 \\u2013 2026\",\"grade\":\"CGPA: 7.5\"},{\"degree\":\"B.Sc. Computer Science\",\"institution\":\"Kpr college of arts and science,Bharathiar University\",\"year\":\"2020 \\u2013 2023\",\"grade\":\"CGPA: 7.8\"}]', '[{\"title\":\"Flutter Developer Intern\",\"company\":\"Doozy Info Software Solutions\",\"period\":\"May 2025 \\u2013 june 2025\",\"location\":\"Tamil Nadu\",\"description\":\"Worked as Flutter Developer Intern at Doozy Info Software Solutions contributing to software development and client systems.\"},{\"title\":\"Junior Software Developer Intern\",\"company\":\"Metetroncube Software Solutions\",\"period\":\"Jan 2026 \\u2013 may 2026\",\"location\":\"Tamil Nadu\",\"description\":\"Worked as Junior Software Developer Intern at Metetroncube Software Solutions contributing to software development and client systems.\"}]', NULL, 30, '2026-10-20 23:52:07', '2026-10-21 03:29:06'),
(3, 6, NULL, NULL, 'tuticorin', NULL, NULL, 'resumes/to8TKwwcOgELCn79nC5Cp0jqJDHH1XoLMA8hKZV8.pdf', 'resume.pdf', NULL, NULL, NULL, 'To make contribution in the organization with best of my ability and also to Develop new skills during the interaction to achieve new heights. ACADEMIC QUALIFICATION S.No. Qualification University / Board Year Per % 1 B.COM MAMONMANIAMSUNDARANAR 2025 68% 2 12 S.SHUNMUGA SUNDARANADAR HSS 2022 65.5% 3 10 S.SHUNMUGA SUNDARANADAR HSS 2020 54% OTHER QUALIFICATION', '[\"html css js pythin mysql\"]', '[]', '[{\"title\":\"app developer\",\"company\":\"stark softech\",\"period\":\"aug 1\",\"location\":\"tuticorin\",\"description\":\"developer\"}]', '[]', 30, '2026-10-24 01:47:15', '2026-10-24 01:52:02'),
(7, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 80, '2026-10-24 05:35:31', '2026-10-24 05:35:31');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_10_17_062236_create_personal_access_tokens_table', 1),
(5, '2026_10_17_063601_add_role_and_profile_fields_to_users_table', 1),
(6, '2026_10_17_063602_create_districts_table', 1),
(7, '2026_10_17_063603_create_categories_table', 1),
(8, '2026_10_17_063604_create_companies_table', 1),
(9, '2026_10_17_063605_create_job_listings_table', 1),
(10, '2026_10_17_063606_create_job_seeker_profiles_table', 1),
(11, '2026_10_17_063607_create_applications_table', 1),
(12, '2026_10_17_063608_create_saved_jobs_table', 1),
(13, '2026_10_17_063609_create_interviews_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'stark_auth_token', '524b922c50d57fecf21522467ac6b7b51a9cfeaa38095267ab97857e9f8e493e', '[\"*\"]', NULL, NULL, '2026-10-20 23:39:55', '2026-10-20 23:39:55'),
(2, 'App\\Models\\User', 2, 'stark_auth_token', 'b429a478a7267d1ba7695081dff3c0fec82eefcdb5541d71a8c8ca9ae1b2d47f', '[\"*\"]', NULL, NULL, '2026-10-20 23:39:55', '2026-10-20 23:39:55'),
(3, 'App\\Models\\User', 3, 'stark_auth_token', 'c3536c7b58ab4889096fcd869b0937999efdc1d4c3c009494d41f8a8a1a6ca33', '[\"*\"]', NULL, NULL, '2026-10-20 23:39:56', '2026-10-20 23:39:56'),
(4, 'App\\Models\\User', 1, 'stark_auth_token', 'ff1c5d626a1e692c22a4334da044ceba593d2015ecd3d142ba79008e342646c7', '[\"*\"]', NULL, NULL, '2026-10-20 23:39:57', '2026-10-20 23:39:57'),
(5, 'App\\Models\\User', 4, 'stark_auth_token', '108a86f1aeca50a51e380a0a30648a1debcbe8c2a2143f3eb85beed47d6fea51', '[\"*\"]', NULL, NULL, '2026-10-20 23:52:07', '2026-10-20 23:52:07'),
(6, 'App\\Models\\User', 4, 'stark_auth_token', '88d3380d804228ad4864834763d1f2b68c392de94d3e287bcc7665977625f6fe', '[\"*\"]', '2026-10-21 00:54:42', NULL, '2026-10-20 23:54:39', '2026-10-21 00:54:42'),
(7, 'App\\Models\\User', 4, 'test', 'e0f884e25e7a362cb9a86d622f32f5ac28ae42ca45cc01f9755e349d6c2aa23e', '[\"*\"]', NULL, NULL, '2026-10-21 00:44:40', '2026-10-21 00:44:40'),
(8, 'App\\Models\\User', 4, 'test', 'c413da4f7c95d1ea6e34aeaa6dc8fb17de8f4d8463a0470220faad65b931adf5', '[\"*\"]', '2026-10-21 00:45:06', NULL, '2026-10-21 00:45:06', '2026-10-21 00:45:06'),
(9, 'App\\Models\\User', 4, 'stark_auth_token', '6129b5680385be2a4f9dd1431f78e2455ffd955c80935f683da16854f1026da2', '[\"*\"]', '2026-10-21 02:33:39', NULL, '2026-10-21 02:30:12', '2026-10-21 02:33:39'),
(10, 'App\\Models\\User', 5, 'stark_auth_token', '799035c8d40eed768c48d6a2dd3e4417aabcdf91524410b4219965933f9cc1b2', '[\"*\"]', '2026-10-21 03:28:50', NULL, '2026-10-21 02:34:03', '2026-10-21 03:28:50'),
(11, 'App\\Models\\User', 5, 'stark_auth_token', 'bb899eece68b0b4decb92a5e764415aae44b892a9f1ae01e07aacc4be522951d', '[\"*\"]', '2026-10-21 06:14:51', NULL, '2026-10-21 05:03:29', '2026-10-21 06:14:51'),
(12, 'App\\Models\\User', 5, 'stark_auth_token', '124e31940b8586d8820142106ee0628584860ebf63ca978d3ba7589e388d8b74', '[\"*\"]', '2026-10-21 08:10:00', NULL, '2026-10-21 06:15:42', '2026-10-21 08:10:00'),
(13, 'App\\Models\\User', 5, 'test_stark', '669a113ac16799c8aad06f5873e6cecf3c9a9a09966b3caee8d13ad013597469', '[\"*\"]', '2026-10-21 08:17:00', NULL, '2026-10-21 08:17:00', '2026-10-21 08:17:00'),
(14, 'App\\Models\\User', 5, 'stark_auth_token', '31cebdeeaaab40c1c36b060d2a8ce158e7f4ff01bf2ef62e28cb95de2d01ba86', '[\"*\"]', '2026-10-24 06:59:50', NULL, '2026-10-24 01:43:22', '2026-10-24 06:59:50'),
(15, 'App\\Models\\User', 6, 'stark_auth_token', '5706133211d5b8685812eee13f959ba58e7548e5586edffba15b25f1e6ec22e7', '[\"*\"]', '2026-10-24 07:35:53', NULL, '2026-10-24 01:47:15', '2026-10-24 07:35:53'),
(16, 'App\\Models\\User', 7, 'stark_auth_token', '825be7b7dc1728f48ee1eda691a45eac431cdb605a48e406058b39acb92d34a9', '[\"*\"]', '2026-10-24 02:03:07', NULL, '2026-10-24 02:02:57', '2026-10-24 02:03:07'),
(17, 'App\\Models\\User', 8, 'stark_auth_token', '5d8947443aa65b6352a8e2b4351e5cd5c41a8bca769c7e4fca724bb47cde7c46', '[\"*\"]', '2026-10-24 02:06:50', NULL, '2026-10-24 02:06:42', '2026-10-24 02:06:50'),
(18, 'App\\Models\\User', 9, 'stark_auth_token', 'f647cb526ad601d556844b266b58aac5ab777d420c676a130335c54fab9cba17', '[\"*\"]', '2026-10-24 02:08:11', NULL, '2026-10-24 02:08:03', '2026-10-24 02:08:11'),
(19, 'App\\Models\\User', 10, 'stark_auth_token', 'e1c17fa98e2b04607ad3775c0d60202c08ffb69e522f221665c28c1f5607df59', '[\"*\"]', NULL, NULL, '2026-10-24 02:19:57', '2026-10-24 02:19:57'),
(20, 'App\\Models\\User', 10, 'stark_auth_token', '213908be6c709fa406488d584651464736452035e890ec31f51d588b3f32f00c', '[\"*\"]', '2026-10-24 05:42:02', NULL, '2026-10-24 05:00:05', '2026-10-24 05:42:02'),
(21, 'App\\Models\\User', 10, 'stark_auth_token', 'dd5f5469d176919719a34a94a59965a4a496de8b12fcbcbf07c254950be3c95c', '[\"*\"]', '2026-10-24 05:43:07', NULL, '2026-10-24 05:42:49', '2026-10-24 05:43:07'),
(22, 'App\\Models\\User', 10, 'stark_auth_token', '0c50b37eab085caccb0fe9579c9a143166ee468b2a70bd9ab98d3afdd43f47c5', '[\"*\"]', NULL, NULL, '2026-10-24 06:03:39', '2026-10-24 06:03:39'),
(23, 'App\\Models\\User', 6, 'test_cli', 'c9335d421472b4eabd0d66921fc832fc81c140e3be428cd634cd0c892ce3a52d', '[\"*\"]', '2026-10-24 06:12:06', NULL, '2026-10-24 06:12:06', '2026-10-24 06:12:06'),
(24, 'App\\Models\\User', 6, 'test_upload', '0609aa79a8f001ac664298a4d28747d40522f0b02c7a8ffa7aa5c6579b70e394', '[\"*\"]', NULL, NULL, '2026-10-24 06:13:27', '2026-10-24 06:13:27'),
(25, 'App\\Models\\User', 6, 'test_upload', '578cef267b984e920379c0e9c6e16cfbb02ca005d1dcc7ed690c12cdf613ff87', '[\"*\"]', '2026-10-24 06:14:16', NULL, '2026-10-24 06:14:16', '2026-10-24 06:14:16'),
(26, 'App\\Models\\User', 5, 'stark_auth_token', 'cfec4f71963c15bf5889240c2e76f359ef414a8478d2c3542f718f876c6826f4', '[\"*\"]', '2026-10-24 07:28:12', NULL, '2026-10-24 07:27:54', '2026-10-24 07:28:12'),
(27, 'App\\Models\\User', 5, 'stark_auth_token', 'fa0612ecfd590ee0faa642d24f3ef58c4d09f20bd9bdbf2a04c8b70e9e547994', '[\"*\"]', '2026-10-24 07:37:15', NULL, '2026-10-24 07:29:14', '2026-10-24 07:37:15');

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `job_listing_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'seeker',
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `phone`, `avatar`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Srikanth Developer', 'testseeker@starkjobs.com', NULL, '$2y$12$wzG4WqNH3dkMLCrlXW6Ire0WnAI7HWidvBPfusJVNiJZ0ygSeBcs2', 'seeker', '+91 98765 11223', 'avatars/6pEqAgQBXaRpVvUnJRZtK6LANtuIjKrlwUhS8aYU.jpg', 1, NULL, '2026-10-20 23:39:54', '2026-10-21 01:20:44'),
(3, 'Stark Industries HR', 'hr@starkindustries.com', NULL, '$2y$12$IhJVbA1fRPoMubxJjPOuWOf0YfrDjMGxR3irRiqU.ACfflw99gOeO', 'company', '+91 98765 43210', NULL, 1, NULL, '2026-10-20 23:39:56', '2026-10-21 03:27:15'),
(4, 'M. Srikanth', 'srikanthm1523@gmail.com', NULL, '$2y$12$DGaVx7uC5k.j7lTneQoy1upxOIFlWT8dt9KrRy0YbEUVTFa0NUX3G', 'seeker', '+91 88388 85379', NULL, 1, NULL, '2026-10-20 23:52:07', '2026-10-21 03:29:06'),
(5, 'stark', 'info@starksoftech.com', NULL, '$2y$12$Fl5di85gA/7nv7RQXvL72.g6n1.bOdhgqEddI7rKrrs9Jm4m2cbJS', 'company', '08870389520', 'company_logos/lbEQIb3OyP1QOY9blJKvR3sYx6hG0YGuVpWBIQO7.png', 1, NULL, '2026-10-21 02:34:03', '2026-10-21 06:13:57'),
(6, 'M.Hariprasanth', 'hariprasanth1589@gmail.com', NULL, '$2y$12$ATl.vM5LM67RWafBgyog7OmE54nOGyPVqc7XLcf4b0uZcXWugIq52', 'seeker', '9361425439', 'avatars/oxItMr4oACV6uqeBqoPh6fFVefq9jF4b1m4cGHaf.png', 1, NULL, '2026-10-24 01:47:15', '2026-10-24 06:14:16'),
(10, 'Super Administrator', 'superadmin@starkjobs.com', NULL, '$2y$12$A1S1v318cOzN3WROoAukte1umQn.wqDVEgxLAHGZg2lVCsT.iPKta', 'admin', NULL, NULL, 1, NULL, '2026-10-24 02:19:00', '2026-10-24 02:19:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `applications_job_listing_id_user_id_unique` (`job_listing_id`,`user_id`),
  ADD KEY `applications_user_id_foreign` (`user_id`),
  ADD KEY `applications_company_id_foreign` (`company_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `companies_slug_unique` (`slug`),
  ADD KEY `companies_user_id_foreign` (`user_id`),
  ADD KEY `companies_district_id_foreign` (`district_id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `districts_name_unique` (`name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `interviews`
--
ALTER TABLE `interviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `interviews_application_id_foreign` (`application_id`),
  ADD KEY `interviews_company_id_foreign` (`company_id`),
  ADD KEY `interviews_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_listings`
--
ALTER TABLE `job_listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_listings_company_id_foreign` (`company_id`),
  ADD KEY `job_listings_category_id_foreign` (`category_id`),
  ADD KEY `job_listings_district_id_foreign` (`district_id`);

--
-- Indexes for table `job_seeker_profiles`
--
ALTER TABLE `job_seeker_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_seeker_profiles_user_id_foreign` (`user_id`),
  ADD KEY `job_seeker_profiles_district_id_foreign` (`district_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_jobs_user_id_job_listing_id_unique` (`user_id`,`job_listing_id`),
  ADD KEY `saved_jobs_job_listing_id_foreign` (`job_listing_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interviews`
--
ALTER TABLE `interviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_listings`
--
ALTER TABLE `job_listings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `job_seeker_profiles`
--
ALTER TABLE `job_seeker_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_job_listing_id_foreign` FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `companies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `interviews`
--
ALTER TABLE `interviews`
  ADD CONSTRAINT `interviews_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interviews_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_listings`
--
ALTER TABLE `job_listings`
  ADD CONSTRAINT `job_listings_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_listings_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_listings_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `job_seeker_profiles`
--
ALTER TABLE `job_seeker_profiles`
  ADD CONSTRAINT `job_seeker_profiles_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_seeker_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `saved_jobs_job_listing_id_foreign` FOREIGN KEY (`job_listing_id`) REFERENCES `job_listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_jobs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
