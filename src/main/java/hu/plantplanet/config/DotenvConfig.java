package hu.plantplanet.config;

import io.github.cdimascio.dotenv.Dotenv;

import javax.annotation.PostConstruct;

public class DotenvConfig {

    private Dotenv dotenv;

    @PostConstruct
    public void init() {
        dotenv = Dotenv.load();
    }

    public String getJwtSecret() {
        return dotenv.get("JWT_SECRET");
    }
}
