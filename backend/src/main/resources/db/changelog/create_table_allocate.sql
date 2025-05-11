CREATE TABLE allocate (
                          id              SERIAL PRIMARY KEY,
                          user_id         INT NOT NULL,
                          permission_id   VARCHAR(30) NOT NULL,
                          FOREIGN KEY (user_id) REFERENCES users (id),
                          FOREIGN KEY (permission_id) REFERENCES permission (id)
);