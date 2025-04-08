package hu.plantplanet.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import hu.plantplanet.auth.PermissionCollector;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static java.util.Arrays.stream;

@Component
public class JWTTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JWTTokenProvider.class);

    @Value("${jwt.secret}")
    private String secret;

    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
    private static final String ISSUER = "Issuer";
    private static final String AUDIENCE = "Plant subscription service";
    public static final String AUTHORITIES = "authorities";
    public static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 5; // 5 days in milliseconds

    public String generateJwtToken(PermissionCollector permissionCollector) {
        String[] claims = getClaimsFromUser(permissionCollector);
        return JWT.create()
                .withIssuer(ISSUER)
                .withAudience(AUDIENCE)
                .withIssuedAt(new Date())
                .withSubject(permissionCollector.getUsername())
                .withClaim("email", permissionCollector.getEmail())
                .withArrayClaim(AUTHORITIES, claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(secret.getBytes()));
    }

    public List<GrantedAuthority> getAuthorities(String token) {
        String[] claims = getClaimsFromToken(token);
        return stream(claims).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    public Authentication getAuthentication(String username, List<GrantedAuthority> authorities, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return authenticationToken;
    }

    public boolean isTokenValid(String username, String token) {
        try {
            DecodedJWT decodedJWT = verifyToken(token);
            return StringUtils.isNotEmpty(username) && !isTokenExpired(decodedJWT);
        } catch (TokenExpiredException e) {
            logger.debug("Token is expired: {}", e.getMessage());
            throw e; // Re-throw to be caught by filter
        } catch (JWTVerificationException e) {
            logger.debug("Token verification failed: {}", e.getMessage());
            return false;
        }
    }

    public String getSubject(String token) {
        try {
            return verifyToken(token).getSubject();
        } catch (TokenExpiredException e) {
            logger.debug("Token is expired while getting subject: {}", e.getMessage());
            throw e; // Re-throw to be caught by filter
        }
    }

    public String getEmailFromToken(String token) {
        try {
            return verifyToken(token).getClaim("email").asString();
        } catch (TokenExpiredException e) {
            logger.debug("Token is expired while getting email: {}", e.getMessage());
            throw e; // Re-throw to be caught by filter
        }
    }

    private String[] getClaimsFromToken(String token) {
        try {
            return verifyToken(token).getClaim(AUTHORITIES).asArray(String.class);
        } catch (TokenExpiredException e) {
            logger.debug("Token is expired while getting claims: {}", e.getMessage());
            throw e; // Re-throw to be caught by filter
        }
    }

    private DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token);
    }

    private boolean isTokenExpired(DecodedJWT decodedJWT) {
        Date expirationDate = decodedJWT.getExpiresAt();
        return expirationDate.before(new Date());
    }

    private JWTVerifier getJWTVerifier() {
        try {
            Algorithm algorithm = HMAC512(secret);
            return JWT.require(algorithm).withIssuer(ISSUER).build();
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException(TOKEN_CANNOT_BE_VERIFIED);
        }
    }

    private String[] getClaimsFromUser(PermissionCollector permissionCollector) {
        List<String> authorities = new ArrayList<>();
        for (GrantedAuthority grantedAuthority : permissionCollector.getAuthorities()) {
            authorities.add(grantedAuthority.getAuthority());
        }
        return authorities.toArray(new String[0]);
    }
}