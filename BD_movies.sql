CREATE DATABASE movies_db;

USE movies_db;

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    score DECIMAL(3,1),
    rating VARCHAR(20),
    year INT
);

ALTER TABLE movies ADD COLUMN poster VARCHAR(500);

SELECT * FROM movies;