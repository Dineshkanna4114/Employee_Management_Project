-- Employee Management System - Database Setup
-- Run this in MySQL Workbench BEFORE starting the Spring Boot app

CREATE DATABASE IF NOT EXISTS employee_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE employee_management_db;

-- The tables will be auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- But you can pre-create them for reference:

-- Optional: Insert sample departments after the app starts
-- (The app auto-creates admin and user accounts on first run)

-- Sample data to insert AFTER the app has started and created the tables:
/*
INSERT INTO departments (name, description, created_at, updated_at) VALUES
('Engineering',       'Software development and technical operations',   NOW(), NOW()),
('Human Resources',   'Employee relations, recruitment, and wellbeing',  NOW(), NOW()),
('Finance',           'Financial planning, accounting and reporting',    NOW(), NOW()),
('Marketing',         'Brand management, growth and customer outreach',  NOW(), NOW()),
('Operations',        'Day-to-day operations and process management',    NOW(), NOW()),
('Sales',             'Revenue generation and client management',        NOW(), NOW()),
('Design',            'UI/UX design and creative direction',             NOW(), NOW()),
('Legal',             'Legal compliance and contract management',        NOW(), NOW());
*/
