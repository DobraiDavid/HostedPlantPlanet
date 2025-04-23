package hu.plantplanet.controller;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.converter.UserConverter;
import hu.plantplanet.dto.user.*;
import hu.plantplanet.exception.EmailAlreadyExistsException;
import hu.plantplanet.model.Users;
import hu.plantplanet.service.UsersService;
import hu.plantplanet.token.JWTTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/user")
@Tag(name="Users")
public class userController {

    private final AuthenticationManager authenticationManager;
    private final JWTTokenProvider jwtTokenProvider;
    private final UsersService userService;

    @Autowired
    public userController(AuthenticationManager authenticationManager, JWTTokenProvider jwtTokenProvider, UsersService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping(value = "/login", produces = "application/json")
    @Operation(summary = "Log in User")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        Users user = userService.findUserByEmail(loginRequest.getEmail());
        PermissionCollector collector = new PermissionCollector(user, userService);
        String token = jwtTokenProvider.generateJwtToken(collector);
        ReadUser readUser = UserConverter.convertModelToRead(user);
        return ResponseEntity.ok().body(new LoginResponse(readUser, token));
    }

    @PostMapping("/register")
    @Operation(summary = "Register User")
    public ResponseEntity<ReadUser> register(@RequestBody RegisterRequest registerRequest) {
        Users user = userService.registerUser(registerRequest);
        ReadUser readUser = UserConverter.convertModelToRead(user);
        return new ResponseEntity<>(readUser, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out User")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("User logged out successfully.");
    }


    @PutMapping("/change")
    @Operation(summary = "Update user details")
    public ResponseEntity<AuthResponse> changeUserDetails(
            @RequestBody ChangeUserRequest changeRequest,
            Authentication authentication,
            HttpServletResponse response
    ) {
        try {
            String currentEmail = authentication.getName();

            Users updatedUser = userService.updateUser(currentEmail, changeRequest);

            PermissionCollector newPrincipal = new PermissionCollector(updatedUser, userService);
            String newToken = jwtTokenProvider.generateJwtToken(newPrincipal);

            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + newToken);

            return ResponseEntity.ok(AuthResponse.from(updatedUser, newToken));
        } catch (EmailAlreadyExistsException e) {
            throw e; // This will automatically return 409 status
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update user", e);
        }
    }

    private void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}
