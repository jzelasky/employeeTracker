USE employees_db;

INSERT INTO department (name)
VALUES ("Marketing"),
        ("Sales"),
        ("Web Development"),
        ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 100000, 3),
        ("Salesperson", 80000, 2),
        ("Counselor", 75000, 4),
        ("Receptionist", 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 1, null),
        ("Sally", "White", 1, 1),
        ("Jennifer", "Green", 3, null),
        ("Beth", "Brown", 4, 3);