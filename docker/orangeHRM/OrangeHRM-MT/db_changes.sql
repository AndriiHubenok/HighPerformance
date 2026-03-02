'Benötigte Tabellen erzeugen und Anpassen'

CREATE TABLE `hs_hr_emp_bonussalary` (
	`id` INT NOT NULL AUTO_INCREMENT ,
	`emp_id` INT NOT NULL ,
	`tenant_id` INT NULL ,
	`year` INT NOT NULL ,
	`value` INT NOT NULL ,
PRIMARY KEY (`id`));

CREATE TABLE `ohrm_tenant` (
   `id` INT NOT NULL AUTO_INCREMENT ,
   `tenant_name` VARCHAR(100) NOT NULL ,
   `tenant_attribute` VARCHAR(100) NULL ,
PRIMARY KEY (`id`));

ALTER TABLE `ohrm_user` ADD `tenant_id` INT NULL AFTER `created_by`;

ALTER TABLE `hs_hr_emp_bonussalary` ADD CONSTRAINT `bonussalary_emp_fk` 
FOREIGN KEY (`emp_id`) REFERENCES `hs_hr_employee`(`emp_number`) 
ON DELETE CASCADE;

ALTER TABLE `hs_hr_emp_bonussalary` ADD CONSTRAINT `bonussalary_tenant_fk` 
FOREIGN KEY (`tenant_id`) REFERENCES `ohrm_tenant`(`id`) 
ON DELETE CASCADE;

ALTER TABLE `ohrm_user` ADD CONSTRAINT `user_tenant_fk`
FOREIGN KEY (`tenant_id`) REFERENCES `ohrm_tenant`(`id`) 
ON DELETE CASCADE;

'Rolle des Tenantadmin einfügen'
INSERT INTO `ohrm_user_role` (`id`, `name`, `display_name`, `is_assignable`, `is_predefined`) VALUES (NULL, 'Tenantadmin', 'Admin', '0', '1');

'Screens in Datenbank eintragen'
INSERT INTO `ohrm_screen` (`id`, `name`, `module_id`, `action_url`) VALUES (NULL, 'Tenants', '2', 'viewTenants');
INSERT INTO `ohrm_screen` (`id`, `name`, `module_id`, `action_url`) VALUES (NULL, 'Tenant Dashboard', '2', 'viewTenantDashboard');
INSERT INTO `ohrm_screen` (`id`, `name`, `module_id`, `action_url`) VALUES (NULL, 'Edit Tenant', '2', 'editTenant');
INSERT INTO `ohrm_screen` (`id`, `name`, `module_id`, `action_url`) VALUES (NULL, 'Delete Tenant', '2', 'deleteTenant');

'Zuweisung von Rolle zu Screen vornehmen ACHTUNG: IDs könnten variieren (siehe IDs vorheriger Schritt)'
INSERT INTO `ohrm_user_role_screen` (`id`, `user_role_id`, `screen_id`, `can_read`, `can_create`, `can_update`, `can_delete`) VALUES (NULL, '8', '123', '1', '1', '1', '1');
INSERT INTO `ohrm_user_role_screen` (`id`, `user_role_id`, `screen_id`, `can_read`, `can_create`, `can_update`, `can_delete`) VALUES (NULL, '8', '124', '1', '1', '1', '1');
INSERT INTO `ohrm_user_role_screen` (`id`, `user_role_id`, `screen_id`, `can_read`, `can_create`, `can_update`, `can_delete`) VALUES (NULL, '8', '125', '1', '1', '1', '1');
INSERT INTO `ohrm_user_role_screen` (`id`, `user_role_id`, `screen_id`, `can_read`, `can_create`, `can_update`, `can_delete`) VALUES (NULL, '8', '126', '1', '1', '1', '1');

'Festlegen der Startseite für Tenantadmin (optional)'
INSERT INTO `ohrm_module_default_page` (`id`, `module_id`, `user_role_id`, `action`, `enable_class`, `priority`) VALUES (NULL, '2', '8', 'admin/viewSystemUsers', NULL, '15');
INSERT INTO `ohrm_home_page` (`id`, `user_role_id`, `action`, `enable_class`, `priority`) VALUES (NULL, '8', 'admin/viewSystemUsers', NULL, '25');

'Erweiterung: Rechte des Tenantadmin = Admin'
INSERT INTO ohrm_user_role_screen (user_role_id, screen_id, can_read, can_create, can_update, can_delete) VALUES
(8, 1, 1, 1, 1, 1),
(8, 2, 1, 1, 1, 1),
(8, 3, 1, 1, 1, 1),
(8, 4, 1, 1, 1, 1),
(8, 5, 1, 1, 1, 1),
(8, 6, 1, 0, 0, 1),
(8, 7, 1, 1, 1, 1),
(8, 8, 1, 1, 1, 1),
(8, 9, 1, 1, 1, 1),
(8, 10, 1, 1, 1, 1),
(8, 11, 1, 1, 1, 1),
(8, 12, 1, 1, 1, 1),
(8, 13, 1, 1, 1, 1),
(8, 14, 1, 1, 1, 1),
(8, 16, 1, 1, 1, 0),
(8, 17, 1, 1, 1, 0),
(8, 18, 1, 1, 1, 0),
(8, 19, 1, 1, 1, 1),
(8, 20, 1, 1, 1, 1),
(8, 21, 1, 1, 1, 1),
(8, 22, 1, 1, 1, 1),
(8, 23, 1, 1, 1, 1),
(8, 24, 1, 1, 1, 1),
(8, 25, 1, 1, 1, 1),
(8, 26, 1, 1, 1, 1),
(8, 27, 1, 1, 1, 1),
(8, 28, 1, 1, 1, 1),
(8, 29, 1, 1, 1, 1),
(8, 30, 1, 1, 1, 1),
(8, 31, 1, 1, 1, 1),
(8, 32, 1, 1, 1, 1),
(8, 33, 1, 1, 1, 1),
(8, 34, 1, 1, 1, 1),
(8, 35, 1, 1, 1, 1),
(8, 36, 1, 1, 1, 1),
(8, 37, 1, 1, 1, 1),
(8, 38, 1, 1, 1, 1),
(8, 39, 1, 1, 1, 1),
(8, 40, 1, 1, 1, 1),
(8, 41, 1, 1, 1, 1),
(8, 42, 1, 1, 1, 1),
(8, 43, 1, 1, 1, 1),
(8, 44, 1, 1, 1, 1),
(8, 45, 1, 1, 1, 1),
(8, 47, 1, 1, 1, 1),
(8, 50, 1, 1, 1, 1),
(8, 52, 1, 1, 1, 1),
(8, 55, 1, 1, 0, 1),
(8, 56, 1, 1, 1, 1),
(8, 57, 1, 1, 1, 1),
(8, 58, 1, 1, 1, 1),
(8, 59, 1, 1, 1, 1),
(8, 60, 1, 1, 1, 1),
(8, 61, 1, 1, 1, 1),
(8, 67, 1, 1, 1, 1),
(8, 68, 1, 1, 1, 1),
(8, 69, 1, 1, 1, 1),
(8, 71, 1, 0, 0, 1),
(8, 72, 1, 1, 1, 0),
(8, 73, 1, 0, 1, 0),
(8, 74, 1, 1, 1, 1),
(8, 75, 1, 1, 1, 1),
(8, 76, 1, 1, 1, 1),
(8, 78, 1, 0, 0, 0),
(8, 80, 1, 1, 1, 1),
(8, 81, 1, 1, 1, 1),
(8, 82, 1, 1, 1, 1),
(8, 83, 1, 1, 1, 1),
(8, 84, 1, 1, 1, 1),
(8, 85, 1, 1, 1, 1),
(8, 86, 1, 1, 1, 1),
(8, 87, 1, 1, 1, 1),
(8, 88, 1, 1, 1, 1),
(8, 89, 1, 1, 1, 1),
(8, 90, 1, 1, 1, 1),
(8, 91, 1, 1, 1, 1),
(8, 92, 1, 1, 1, 1),
(8, 93, 1, 1, 1, 1),
(8, 94, 1, 1, 1, 1),
(8, 95, 1, 1, 1, 1),
(8, 96, 1, 1, 1, 1),
(8, 97, 1, 1, 1, 1),
(8, 98, 1, 1, 1, 1),
(8, 99, 1, 0, 1, 0),
(8, 100, 1, 0, 0, 0),
(8, 101, 1, 1, 1, 1),
(8, 102, 1, 1, 1, 1),
(8, 118, 1, 1, 1, 1);

INSERT INTO `ohrm_user_role_data_group` (`user_role_id`, `data_group_id`, `can_read`, `can_create`, `can_update`, `can_delete`, `self`) VALUES
(8, 1, 1, NULL, 1, NULL, 0),
(8, 2, 1, 1, 1, 1, 0),
(8, 3, 1, NULL, 1, NULL, 0),
(8, 4, 1, NULL, 1, NULL, 0),
(8, 5, 1, 1, 1, 1, 0),
(8, 6, 1, NULL, 1, NULL, 0),
(8, 7, 1, 1, 1, 1, 0),
(8, 8, 1, 1, 1, 1, 0),
(8, 9, 1, NULL, 1, NULL, 0),
(8, 10, 1, 1, 1, 1, 0),
(8, 11, 1, 1, 1, 1, 0),
(8, 12, 1, NULL, 1, NULL, 0),
(8, 13, 1, 1, 1, 1, 0),
(8, 14, 1, 1, 1, 1, 0),
(8, 15, 1, NULL, 1, NULL, 0),
(8, 16, 1, NULL, 1, NULL, 0),
(8, 17, 1, 1, 1, 1, 0),
(8, 18, 1, NULL, 1, NULL, 0),
(8, 19, 1, 1, 1, 1, 0),
(8, 20, 1, 1, 1, 1, 0),
(8, 21, 1, NULL, 1, NULL, 0),
(8, 22, 1, NULL, 1, NULL, 0),
(8, 23, 1, 1, 1, 1, 0),
(8, 24, 1, NULL, 1, NULL, 0),
(8, 25, 1, 1, 1, 1, 0),
(8, 26, 1, 1, 1, 1, 0),
(8, 27, 1, 1, 1, 1, 0),
(8, 28, 1, NULL, 1, NULL, 0),
(8, 29, 1, 1, 1, 1, 0),
(8, 30, 1, 1, 1, 1, 0),
(8, 31, 1, 1, 1, 1, 0),
(8, 32, 1, 1, 1, 1, 0),
(8, 33, 1, 1, 1, 1, 0),
(8, 34, 1, 1, 1, 1, 0),
(8, 35, 1, NULL, 1, NULL, 0),
(8, 36, 1, 1, 1, 1, 0),
(8, 37, 1, 1, 1, 1, 0),
(8, 38, 1, NULL, 1, NULL, 0),
(8, 39, 1, NULL, 1, 1, 0),
(8, 40, 1, 1, 1, 1, 0),
(8, 41, 1, NULL, NULL, NULL, 0),
(8, 40, 1, 1, 1, 1, 1),
(8, 42, 1, 1, 1, 1, 0),
(8, 43, 1, 1, 1, 1, 0),
(8, 44, 1, 1, 1, 1, 0),
(8, 45, 1, 1, 1, 1, 0),
(8, 45, 0, 0, 0, 0, 0),
(8, 46, 1, 1, 1, 1, 0),
(8, 47, 1, NULL, 1, NULL, 0),
(8, 48, 1, 0, 0, 0, 0),
(8, 49, 1, 0, 0, 0, 0),
(8, 50, 1, 0, 0, 0, 0),
(8, 51, 1, 0, 0, 0, 0),
(8, 52, 1, NULL, 1, NULL, 0),
(8, 53, 1, 1, 1, 1, 0),
(8, 54, 1, 0, 1, 0, 0),
(8, 55, 1, 1, 1, 1, 0),
(8, 56, 1, 1, 1, 1, 0),
(8, 57, 1, 1, 1, 1, 0),
(8, 58, 1, 0, 0, 0, 0),
(8, 59, 1, 0, 0, 0, 0),
(8, 60, 0, 1, 0, 0, 0);

'Menü Anpassen ACHTUNG: IDs könnten abweichen'
INSERT INTO `ohrm_menu_item` (`id`, `menu_title`, `screen_id`, `parent_id`, `level`, `order_hint`, `url_extras`, `status`) VALUES (NULL, 'Tenant Management', NULL, '1', '2', '100', NULL, '1');
INSERT INTO `ohrm_menu_item` (`id`, `menu_title`, `screen_id`, `parent_id`, `level`, `order_hint`, `url_extras`, `status`) VALUES (NULL, 'Tenants', '129', '101', '3', '200', NULL, '1');
INSERT INTO `ohrm_menu_item` (`id`, `menu_title`, `screen_id`, `parent_id`, `level`, `order_hint`, `url_extras`, `status`) VALUES (NULL, 'Dashboard', '130', '101', '3', '100', NULL, '1');
