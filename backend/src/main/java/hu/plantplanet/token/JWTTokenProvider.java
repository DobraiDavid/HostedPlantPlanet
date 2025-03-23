package hu.plantplanet.token;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import hu.plantplanet.auth.PermissionCollector;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
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

    @Value("${d115ee8593ada12505e08aa2b388be1edc83a624208d363b3d385110bdbdf6f9}")
    private String secret;

    public static final String TOKEN_CANNOT_BE_VERIFIED = "Token cannot be verified";
    private static final String ISSUER = "Issuer";
    private static final String AUDIENCE = "Submarine management webservice";
    public static final String AUTHORITIES = "authorities";
    public static final long EXPIRATION_TIME = 1000*60*60*24*5; // 5 days expressed in milliseconds 432 000 000
    public String generateJwtToken(PermissionCollector permissionCollector) {
        String[] claims = getClaimsFromUser(permissionCollector);
        return JWT.create().withIssuer(ISSUER)
                .withAudience(AUDIENCE)
                .withIssuedAt(new Date()).withSubject(permissionCollector.getUsername())
                .withArrayClaim(AUTHORITIES, claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(secret.getBytes()));
    }

    public List<GrantedAuthority> getAuthorities(String token) {
        String[] claims = getClaimsFromToken(token);
        Object SimpleGrantedAuthority;
        return stream(claims).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    public Authentication getAuthentication(String username, List<GrantedAuthority> authorities, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken userPasswordAuthToken = new
                UsernamePasswordAuthenticationToken(username, null, authorities);
        userPasswordAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return userPasswordAuthToken;
    }

    public boolean isTokenValid(String username, String token) {
        JWTVerifier verifier = getJWTVerifier();
        return StringUtils.isNotEmpty(username) && !isTokenExpired(verifier, token);
    }

    public String getSubject(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token).getSubject();
    }

    private boolean isTokenExpired(JWTVerifier verifier, String token) {
        Date expirationDate = verifier.verify(token).getExpiresAt();
        return expirationDate.before(new Date());
    }

    private String[] getClaimsFromToken(String token) {
        JWTVerifier verifier = getJWTVerifier();
        return verifier.verify(token).getClaim(AUTHORITIES).asArray(String.class);
    }

    private JWTVerifier getJWTVerifier() {
        JWTVerifier verifier;
        try {
            Algorithm algorithm = HMAC512(secret);
            verifier = JWT.require(algorithm).withIssuer(ISSUER).build();
        }catch (JWTVerificationException exception) {
            throw new JWTVerificationException(TOKEN_CANNOT_BE_VERIFIED);
        }
        return verifier;
    }

    private String[] getClaimsFromUser(PermissionCollector permissionCollector) {
        List<String> authorities = new ArrayList<>();
        for (GrantedAuthority grantedAuthority : permissionCollector.getAuthorities()){
            authorities.add(grantedAuthority.getAuthority());
        }
        return authorities.toArray(new String[0]);
    }
}
