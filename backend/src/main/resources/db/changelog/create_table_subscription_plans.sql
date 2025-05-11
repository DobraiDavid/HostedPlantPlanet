CREATE TABLE subscription_plans (
                                    id SERIAL PRIMARY KEY,
                                    name VARCHAR(100) NOT NULL,
                                    images JSON,
                                    description TEXT,
                                    type TEXT CHECK (type IN ('RANDOM_PLANT', 'CARE_TIPS')) NOT NULL,
                                    price NUMERIC(10, 2) NOT NULL
);
