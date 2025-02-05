CREATE TABLE cart (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    plant_id    INT NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    amount      INT NOT NULL CHECK (amount > 0),
    total_price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants (id) ON DELETE CASCADE
);
