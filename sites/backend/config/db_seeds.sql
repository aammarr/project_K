/*----------
 | DB Seeds |
 ----------*/

INSERT INTO
    `project_k`.`roles` (`role_id`, `role_name`)
VALUES ('1', 'superadmin');

INSERT INTO
    `project_k`.`roles` (`role_id`, `role_name`)
VALUES ('2', 'user');

INSERT INTO
    `project_k`.`users` (
        `user_id`,
        `email`,
        `password`,
        `role_id`,
        `first_name`,
        `last_name`
    )
VALUES (
        '1',
        'super@admin.com',
        '$2b$10$u2KxIPZX37HVd6RiU83kbOVWvaSsSKunCxzGc58EPTTflm80dc6uW',
        '1',
        'Super',
        'Admin'
    );