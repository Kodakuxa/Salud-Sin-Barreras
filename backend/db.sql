CREATE DATABASE IF NOT EXISTS salud_sin_barreras;
USE salud_sin_barreras;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'doctor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    age INT,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    heart_rate VARCHAR(50),
    temperature VARCHAR(50),
    prescription TEXT,
    appointment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password, role) VALUES ('Luis', 'luis@gmail.com', MD5('12345'), 'admin');
INSERT INTO users (username, email, password, role) VALUES ('Dra. Elena Torres', 'elena.torres@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dr. Javier Morales', 'javier.morales@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dra. Camila Rojas', 'camila.rojas@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dr. Andres Pineda', 'andres.pineda@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dra. Sofia Herrera', 'sofia.herrera@saludsinbarreras.com', MD5('12345'), 'doctor');

INSERT INTO patients (full_name, age, phone, address) VALUES ('Fabiola', 25, '+52 667 455 345', 'Villa Bonita');
INSERT INTO patients (full_name, age, phone, address) VALUES ('Katarina', 43, '8473', 'Alemania');
INSERT INTO patients (full_name, age, phone, address) VALUES ('Karla Gomez', 29, '55-555-55-55', 'México');
INSERT INTO users (username, email, password, role) VALUES ('Dra. Elena Torres', 'elena.torres@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dr. Javier Morales', 'javier.morales@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dra. Camila Rojas', 'camila.rojas@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dr. Andres Pineda', 'andres.pineda@saludsinbarreras.com', MD5('12345'), 'doctor');
INSERT INTO users (username, email, password, role) VALUES ('Dra. Sofia Herrera', 'sofia.herrera@saludsinbarreras.com', MD5('12345'), 'doctor');