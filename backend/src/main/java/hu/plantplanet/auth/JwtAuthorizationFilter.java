package hu.plantplanet.auth;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import hu.plantplanet.token.JWTTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthorizationFilter.class);

    private final JWTTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String TOKEN_PREFIX = "Bearer ";

    public JwtAuthorizationFilter(JWTTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip filter for OPTIONS requests
        if (request.getMethod().equalsIgnoreCase(OPTIONS_HTTP_METHOD)) {
            response.setStatus(OK.value());
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Check if Authorization header exists and has the right format
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            if (authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_PREFIX)) {
                logger.debug("No valid Authorization header found");
                filterChain.doFilter(request, response);
                return;
            }

            // Extract the token
            String token = authorizationHeader.substring(TOKEN_PREFIX.length());

            // Only process if no authentication is already set
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                String username = jwtTokenProvider.getSubject(token);

                if (jwtTokenProvider.isTokenValid(username, token)) {
                    // Load the full UserDetails (which contains your Users entity)
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Get authorities from token
                    List<GrantedAuthority> authorities = jwtTokenProvider.getAuthorities(token);

                    // Create authentication with UserDetails as principal
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,  // This will be your PermissionCollector containing Users
                            null,
                            authorities
                    );

                    // Set the request details
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Authentication successful for user: {}", username);
                } else {
                    logger.debug("Token validation failed");
                    SecurityContextHolder.clearContext();
                }
            }

        } catch (TokenExpiredException e) {
            logger.debug("Token has expired: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.setStatus(UNAUTHORIZED.value());
            response.getWriter().write("Token has expired");
            response.getWriter().flush();
            return;

        } catch (JWTVerificationException e) {
            logger.debug("JWT verification failed: {}", e.getMessage());
            SecurityContextHolder.clearContext();

        } catch (Exception e) {
            logger.error("Error processing JWT token: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}