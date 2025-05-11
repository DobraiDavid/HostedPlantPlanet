CREATE TABLE comments (
                          id SERIAL PRIMARY KEY,
                          user_id INT NOT NULL,
                          plant_id INT NOT NULL,
                          title VARCHAR(255) NOT NULL,
                          comment_text TEXT NOT NULL,
                          rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
                          profile_picture TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);
