CREATE TABLE subscription_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    images JSON,
    description TEXT,
    type ENUM('RANDOM_PLANT', 'CARE_TIPS') NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);