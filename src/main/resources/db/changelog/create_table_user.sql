CREATE TABLE user (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(30) NOT NULL,
    email     VARCHAR(50) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL
);
