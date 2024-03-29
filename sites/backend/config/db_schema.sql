/*----------
| DB Schema |
----------*/

-- Users Table Schema

CREATE TABLE `project_k`.`users` (
    `user_id` INT NOT NULL AUTO_INCREMENT, `email` VARCHAR(255) NULL, `password` VARCHAR(255) NOT NULL, `role_id` INT NULL, `first_name` VARCHAR(255) NULL, `last_name` VARCHAR(255) NULL, `phone` VARCHAR(255) NULL, `avatar` VARCHAR(255) NULL, `address` VARCHAR(255) NULL, `city` VARCHAR(255) NULL, `state` VARCHAR(255) NULL, `country` VARCHAR(255) NULL, `zipcode` VARCHAR(255) NULL, `lat` INT NULL, `long` INT NULL, `otp` VARCHAR(255) NULL, `subscribed` INT NULL, `subscription_expire` VARCHAR(255) NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`user_id`)
);

-- Roles Table Schema

CREATE TABLE `project_k`.`roles` (
    `role_id` INT NOT NULL AUTO_INCREMENT, `role_name` VARCHAR(255) NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`role_id`)
);

-- Category Table Schema

CREATE TABLE `project_k`.`categories` (
    `category_id` INT NOT NULL AUTO_INCREMENT, `user_id` INT, `category_code` VARCHAR(255) NULL, `category_name` VARCHAR(255) NULL, `category_description` VARCHAR(255) NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`category_id`)
);

-- Templates Table Schema

CREATE TABLE `project_k`.`templates` (
    `template_id` INT NOT NULL AUTO_INCREMENT, `user_id` VARCHAR(255) NULL, `category_id` VARCHAR(255) NULL, `template_code` VARCHAR(255) NULL, `template_name` VARCHAR(255) NULL, `template_description` LONGTEXT NULL, `template_type` VARCHAR(255) NULL, `template_size` VARCHAR(255) NULL, `template_key` VARCHAR(255) NULL, `template_url` LONGTEXT NULL, `template_thumbnail` VARCHAR(255) NULL, `template_view_count` INT NULL, `template_download_count` INT NULL, `template_flag` VARCHAR(255) NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`template_id`)
);

-- Pictures Table Schema
CREATE TABLE `project_k`.`pictures` (
    `picture_id` INT NOT NULL AUTO_INCREMENT, `template_id` INT, `picture_url` VARCHAR(255) NULL, `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`picture_id`)
);