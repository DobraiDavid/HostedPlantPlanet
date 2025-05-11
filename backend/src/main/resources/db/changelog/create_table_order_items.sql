CREATE TABLE order_item (
                            id SERIAL PRIMARY KEY,
                            order_id INT,
                            user_id INT,
                            plant_id INT,
                            pot_id INT,
                            subscription_plan_id INT,
                            subscription BOOLEAN NOT NULL,
                            amount INT NOT NULL,
                            price NUMERIC NOT NULL,
                            CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
                            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
                            CONSTRAINT fk_plant FOREIGN KEY (plant_id) REFERENCES plants(id),
                            CONSTRAINT fk_pot FOREIGN KEY (pot_id) REFERENCES pots(id),
                            CONSTRAINT fk_subscription_plan FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
);
