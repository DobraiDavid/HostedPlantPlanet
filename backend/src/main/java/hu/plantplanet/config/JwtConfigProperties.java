package hu.plantplanet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtConfigProperties(
        String secret,
        long expirationMs,
        String issuer,
        String audience
) {}