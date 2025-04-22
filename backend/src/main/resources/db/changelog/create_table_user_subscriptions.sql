CREATE TABLE user_subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id BIGINT NOT NULL,
    interval_days INT,
    start_date DATETIME NOT NULL,
    next_trigger_date DATETIME,
    status ENUM('ACTIVE', 'PAUSED', 'CANCELLED') DEFAULT 'PAUSED',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);