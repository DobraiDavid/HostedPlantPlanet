package hu.plantplanet.controller;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.converter.UserConverter;
import hu.plantplanet.dto.user.*;
import hu.plantplanet.model.Users;
import hu.plantplanet.service.UsersService;
import hu.plantplanet.token.JWTTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        PermissionCollector collector = new PermissionCollector(user);
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
    public ResponseEntity<ReadUser> changeUserDetails(@RequestBody ChangeUserRequest changeRequest, Authentication authentication) {
        String email;

        if (authentication.getPrincipal() instanceof PermissionCollector permissionCollector) {
            email = permissionCollector.getEmail();
        } else {
            email = authentication.getName();
        }

        Users updatedUser = userService.updateUser(email, changeRequest);
        ReadUser readUser = UserConverter.convertModelToRead(updatedUser);
        return ResponseEntity.ok(readUser);
    }

    private void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }
}
