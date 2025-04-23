package hu.plantplanet.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.config.JwtConfigProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

@Component
public class JWTTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JWTTokenProvider.class);

    public static final String AUTHORITIES_CLAIM = "authorities";
    public static final String EMAIL_CLAIM = "email";
    private static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";

    private final Algorithm algorithm;
    private final JwtConfigProperties config;

    public JWTTokenProvider(JwtConfigProperties config) {
        this.config = Objects.requireNonNull(config, "JWT config cannot be null");
        this.algorithm = Algorithm.HMAC512(config.secret());
        validateConfig();
    }

    private void validateConfig() {
        if (config.secret() == null || config.secret().length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long");
        }
    }

    public String generateJwtToken(PermissionCollector permissionCollector) {
        Objects.requireNonNull(permissionCollector, "PermissionCollector cannot be null");

        return JWT.create()
                .withIssuer(config.issuer())
                .withAudience(config.audience())
                .withIssuedAt(new Date())
                .withSubject(permissionCollector.getUsername())
                .withClaim(EMAIL_CLAIM, permissionCollector.getEmail())
                .withArrayClaim(AUTHORITIES_CLAIM, getClaimsFromUser(permissionCollector))
                .withExpiresAt(new Date(System.currentTimeMillis() + config.expirationMs()))
                .sign(algorithm);
    }

    public List<GrantedAuthority> getAuthorities(String token) {
        try {
            String[] claims = getClaimsFromToken(token);
            return claims == null ? emptyList() :
                    List.of(claims).stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(toList());
        } catch (JWTVerificationException e) {
            logger.warn("Failed to get authorities from token: {}", e.getMessage());
            return emptyList();
        }
    }

    public boolean isTokenValid(String username, String token) {
        try {
            DecodedJWT decodedJWT = verifyToken(token);
            return username != null &&
                    !username.isBlank() &&
                    !isTokenExpired(decodedJWT);
        } catch (JWTVerificationException e) {
            logger.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public String getSubject(String token) throws JWTVerificationException {
        return verifyToken(token).getSubject();
    }

    public String getEmailFromToken(String token) throws JWTVerificationException {
        return verifyToken(token).getClaim(EMAIL_CLAIM).asString();
    }

    private String[] getClaimsFromToken(String token) throws JWTVerificationException {
        return verifyToken(token).getClaim(AUTHORITIES_CLAIM).asArray(String.class);
    }

    private String[] getClaimsFromUser(PermissionCollector permissionCollector) {
        return permissionCollector.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toArray(String[]::new);
    }

    private DecodedJWT verifyToken(String token) throws JWTVerificationException {
        try {
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(config.issuer())
                    .build();
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            logger.error("Token verification failed", e);
            throw e;
        }
    }

    private boolean isTokenExpired(DecodedJWT decodedJWT) {
        return decodedJWT.getExpiresAt().before(new Date());
    }
}