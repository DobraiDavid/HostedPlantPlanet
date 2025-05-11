CREATE TABLE repot_reminders (
                                 id SERIAL PRIMARY KEY,
                                 order_item_id INT NOT NULL,
                                 email VARCHAR(255) NOT NULL,
                                 plant_name VARCHAR(255) NOT NULL,
                                 remind_at TIMESTAMP NOT NULL,
                                 sent BOOLEAN DEFAULT FALSE,
                                 FOREIGN KEY (order_item_id) REFERENCES order_item(id)
);
