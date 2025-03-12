package hu.plantplanet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allow all paths
                .allowedOrigins("http://localhost:5173")  // Allow requests from your React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allow the common HTTP methods
                .allowCredentials(true);  // Allow cookies to be included in the request
    }
}
