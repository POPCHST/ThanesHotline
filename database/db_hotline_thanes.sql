/*
 Navicat Premium Data Transfer

 Source Server         : PROJECT_EMC
 Source Server Type    : MySQL
 Source Server Version : 101110 (10.11.10-MariaDB)
 Source Host           : 103.99.11.97:3306
 Source Schema         : db_hotline_thanes

 Target Server Type    : MySQL
 Target Server Version : 101110 (10.11.10-MariaDB)
 File Encoding         : 65001

 Date: 30/12/2025 12:06:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for m_customers
-- ----------------------------
DROP TABLE IF EXISTS `m_customers`;
CREATE TABLE `m_customers`  (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_ward` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `contact_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `contact_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `lastmodify` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`customer_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_departments
-- ----------------------------
DROP TABLE IF EXISTS `m_departments`;
CREATE TABLE `m_departments`  (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`department_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_devices
-- ----------------------------
DROP TABLE IF EXISTS `m_devices`;
CREATE TABLE `m_devices`  (
  `device_id` int NOT NULL AUTO_INCREMENT,
  `device_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `device_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `serial_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `lastmodify` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`device_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_issue_categories
-- ----------------------------
DROP TABLE IF EXISTS `m_issue_categories`;
CREATE TABLE `m_issue_categories`  (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_order` int NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` datetime NULL DEFAULT current_timestamp,
  `updated_at` datetime NULL DEFAULT current_timestamp,
  PRIMARY KEY (`category_id`) USING BTREE,
  UNIQUE INDEX `category_code`(`category_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_issue_types
-- ----------------------------
DROP TABLE IF EXISTS `m_issue_types`;
CREATE TABLE `m_issue_types`  (
  `issue_type_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NULL DEFAULT NULL,
  `issue_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`issue_type_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_roles
-- ----------------------------
DROP TABLE IF EXISTS `m_roles`;
CREATE TABLE `m_roles`  (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role_order` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`role_id`) USING BTREE,
  UNIQUE INDEX `role_code`(`role_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_sla
-- ----------------------------
DROP TABLE IF EXISTS `m_sla`;
CREATE TABLE `m_sla`  (
  `sla_id` int NOT NULL AUTO_INCREMENT,
  `issue_type_id` int NULL DEFAULT NULL,
  `response_time_min` int NULL DEFAULT NULL,
  `resolve_time_min` int NULL DEFAULT NULL,
  PRIMARY KEY (`sla_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_tags
-- ----------------------------
DROP TABLE IF EXISTS `m_tags`;
CREATE TABLE `m_tags`  (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`tag_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_ticket_status
-- ----------------------------
DROP TABLE IF EXISTS `m_ticket_status`;
CREATE TABLE `m_ticket_status`  (
  `status_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status_order` int NULL DEFAULT NULL,
  PRIMARY KEY (`status_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_ticket_status_service
-- ----------------------------
DROP TABLE IF EXISTS `m_ticket_status_service`;
CREATE TABLE `m_ticket_status_service`  (
  `status_sv_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_sv_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status_sv_order` int NULL DEFAULT NULL,
  PRIMARY KEY (`status_sv_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for m_users
-- ----------------------------
DROP TABLE IF EXISTS `m_users`;
CREATE TABLE `m_users`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role_id` int NULL DEFAULT NULL,
  `department_id` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_attachments
-- ----------------------------
DROP TABLE IF EXISTS `ticket_attachments`;
CREATE TABLE `ticket_attachments`  (
  `attachment_id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NULL DEFAULT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `uploaded_by` int NULL DEFAULT NULL,
  `uploaded_at` datetime NULL DEFAULT current_timestamp,
  PRIMARY KEY (`attachment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_forward_history
-- ----------------------------
DROP TABLE IF EXISTS `ticket_forward_history`;
CREATE TABLE `ticket_forward_history`  (
  `forward_id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NULL DEFAULT NULL,
  `from_department_id` int NULL DEFAULT NULL,
  `to_department_id` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `forward_by` int NULL DEFAULT NULL,
  `forward_at` datetime NULL DEFAULT current_timestamp,
  PRIMARY KEY (`forward_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_logs
-- ----------------------------
DROP TABLE IF EXISTS `ticket_logs`;
CREATE TABLE `ticket_logs`  (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NULL DEFAULT NULL,
  `action_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `old_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `new_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `action_by` int NULL DEFAULT NULL,
  `action_at` datetime NULL DEFAULT current_timestamp,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_resolution
-- ----------------------------
DROP TABLE IF EXISTS `ticket_resolution`;
CREATE TABLE `ticket_resolution`  (
  `resolution_id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NULL DEFAULT NULL,
  `resolution_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `resolution_by` int NULL DEFAULT NULL,
  `resolution_at` datetime NULL DEFAULT current_timestamp,
  PRIMARY KEY (`resolution_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_satisfaction
-- ----------------------------
DROP TABLE IF EXISTS `ticket_satisfaction`;
CREATE TABLE `ticket_satisfaction`  (
  `satisfaction_id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL COMMENT 'อ้างอิง ticket',
  `satisfaction_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'token ใช้ครั้งเดียว (เหมือน OTP)',
  `score` tinyint NULL DEFAULT NULL COMMENT 'คะแนนความพึงพอใจ 1-5',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'ความคิดเห็นเพิ่มเติม',
  `is_used` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = ยังไม่ตอบ, 1 = ตอบแล้ว',
  `expired_at` datetime NULL DEFAULT NULL COMMENT 'วันหมดอายุ token',
  `rated_at` datetime NULL DEFAULT NULL COMMENT 'เวลาที่ตอบแบบประเมิน',
  `created_at` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`satisfaction_id`) USING BTREE,
  UNIQUE INDEX `uk_token`(`satisfaction_token` ASC) USING BTREE,
  INDEX `idx_ticket_id`(`ticket_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'คะแนนความพึงพอใจหลังปิดงาน' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_service
-- ----------------------------
DROP TABLE IF EXISTS `ticket_service`;
CREATE TABLE `ticket_service`  (
  `service_id` int NOT NULL AUTO_INCREMENT COMMENT 'PK ของ service',
  `ticket_id` int NOT NULL COMMENT 'อ้างอิง tickets.ticket_id',
  `service_types` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ประเภทงาน service (เช่น repair,replace,pm)',
  `work_order_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'เลขใบงาน / Work Order',
  `cost_estimate` decimal(10, 2) NULL DEFAULT NULL COMMENT 'ค่าใช้จ่ายประมาณการ',
  `serial_before` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Serial number ก่อนซ่อม/เปลี่ยน',
  `serial_after` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Serial number หลังซ่อม/เปลี่ยน',
  `replaced_parts` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'อะไหล่ที่เปลี่ยน / รายการงาน',
  `service_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'บันทึกเพิ่มเติมเกี่ยวกับงาน service',
  `created_at` datetime NOT NULL DEFAULT current_timestamp COMMENT 'เวลาสร้างข้อมูล service',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP COMMENT 'เวลาปรับปรุงข้อมูลล่าสุด',
  PRIMARY KEY (`service_id`) USING BTREE,
  INDEX `idx_ticket_id`(`ticket_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'ข้อมูลเฉพาะของ Ticket Service' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_sla_tracking
-- ----------------------------
DROP TABLE IF EXISTS `ticket_sla_tracking`;
CREATE TABLE `ticket_sla_tracking`  (
  `ticket_id` int NOT NULL,
  `start_time` datetime NULL DEFAULT NULL,
  `first_response_time` datetime NULL DEFAULT NULL,
  `resolve_time` datetime NULL DEFAULT NULL,
  `is_breach` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`ticket_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ticket_tags
-- ----------------------------
DROP TABLE IF EXISTS `ticket_tags`;
CREATE TABLE `ticket_tags`  (
  `ticket_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`ticket_id`, `tag_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tickets
-- ----------------------------
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets`  (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `ticket_no` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `customer_id` int NULL DEFAULT NULL,
  `device_id` int NULL DEFAULT NULL,
  `issue_type_id` int NULL DEFAULT NULL,
  `issue_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `issue_detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `priority_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `impact_level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ผลกระทบ',
  `urgency_level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ความรีบ',
  `department_id` int NULL DEFAULT NULL,
  `assigned_user_id` int NULL DEFAULT NULL COMMENT 'id',
  `assigned_user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ชื่อ',
  `tag_id` int NULL DEFAULT NULL,
  `status_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_service_case` tinyint(1) NULL DEFAULT 0 COMMENT '0 ไม่ใช่ 1 ใช่',
  `is_reopen` tinyint(1) NULL DEFAULT 0 COMMENT '0 ไม่เคย 1 เคย reopen\r\n',
  `reopen_count` int NULL DEFAULT 0 COMMENT 'จำนวนครั้งที่ reopen',
  `opened_at` datetime NULL DEFAULT current_timestamp,
  `first_response_at` datetime NULL DEFAULT NULL COMMENT 'เวลาที่เจ้าหน้าที่ตอบครั้งแรก',
  `resolved_at` datetime NULL DEFAULT NULL COMMENT 'เวลาที่แก้ปัญหาเสร็จ (ยังไม่ปิด)',
  `closed_at` datetime NULL DEFAULT NULL COMMENT 'เวลาปิด ticket จริง',
  `created_by` int NULL DEFAULT NULL COMMENT 'ใครเป็นคนสร้าง ticket',
  `created_at` datetime NULL DEFAULT current_timestamp COMMENT 'เวลาสร้าง record',
  `updated_by` int NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT current_timestamp COMMENT 'เวลาที่มีการแก้ไขล่าสุด',
  `is_deleted` tinyint(1) NULL DEFAULT NULL COMMENT '0 ปกติ 1 ลบ',
  `deleted_at` datetime NULL DEFAULT NULL,
  `deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`ticket_id`) USING BTREE,
  UNIQUE INDEX `ticket_no`(`ticket_no` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
