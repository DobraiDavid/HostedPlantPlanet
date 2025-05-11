CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(30) NOT NULL,
                       email VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       profile_image TEXT
);
