CREATE TABLE plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    images JSON,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    light VARCHAR(50),
    water VARCHAR(50),
    humidity VARCHAR(50),
    temperature VARCHAR(50),
    fertilizing VARCHAR(50),
    re_potting VARCHAR(50),
    cleaning VARCHAR(50),
    propagation VARCHAR(50)
);
