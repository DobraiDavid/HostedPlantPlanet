CREATE TABLE user_subscriptions (
                                    id SERIAL PRIMARY KEY,
                                    user_id INT NOT NULL,
                                    plan_id INT NOT NULL,
                                    interval_days INT,
                                    start_date TIMESTAMP NOT NULL,
                                    next_trigger_date TIMESTAMP,
                                    status TEXT CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED')) DEFAULT 'PAUSED',
                                    FOREIGN KEY (user_id) REFERENCES users(id),
                                    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);
