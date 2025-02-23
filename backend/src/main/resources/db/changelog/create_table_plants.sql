CREATE TABLE plants (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    image_url   TEXT,
    description TEXT,
    price       DECIMAL(10,2) NOT NULL
);
