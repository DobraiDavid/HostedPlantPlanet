CREATE TABLE cart (
    id                     INT AUTO_INCREMENT PRIMARY KEY,
    user_id                INT NOT NULL,
    plant_id               INT NULL,
    pot_id                 INT NULL,
    price                  DECIMAL(10,2) NOT NULL,
    amount                 INT NOT NULL CHECK (amount > 0),
    subscription_plan_id   INT NULL,
    is_subscription        BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants (id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans (id) ON DELETE CASCADE,
    FOREIGN KEY (pot_id) REFERENCES pots (id) ON DELETE SET NULL
);
