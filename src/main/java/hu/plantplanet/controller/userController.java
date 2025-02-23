package hu.plantplanet.controller;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.converter.UserConverter;
import hu.plantplanet.dto.user.LoginRequest;
import hu.plantplanet.dto.user.ReadUser;
import hu.plantplanet.dto.user.RegisterRequest;
import hu.plantplanet.model.Users;
import hu.plantplanet.service.UsersService;
import hu.plantplanet.token.JWTTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Tag(name="Users")
public class userController {

    private AuthenticationManager authenticationManager;
    private JWTTokenProvider jwtTokenProvider;
    private UsersService userService;

    @Autowired
    public userController(AuthenticationManager authenticationManager, JWTTokenProvider jwtTokenProvider, UsersService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    @Operation(summary = "Log in User")
    public ResponseEntity<ReadUser> login(@RequestBody LoginRequest loginRequest) {
        authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        Users user = userService.findUserByUsername(loginRequest.getUsername());
        PermissionCollector collector = new PermissionCollector(user);
        HttpHeaders jwtHeader = getJWTHeader(collector);
        ReadUser readUser = UserConverter.convertModelToRead(user);
        return new ResponseEntity<>(readUser, jwtHeader, HttpStatus.OK);
    }

    @PostMapping("/register")
    @Operation(summary = "Register User")
    public ResponseEntity<ReadUser> register(@RequestBody RegisterRequest registerRequest) {
        Users user = userService.registerUser(registerRequest);
        ReadUser readUser = UserConverter.convertModelToRead(user);
        return new ResponseEntity<>(readUser, HttpStatus.CREATED);
    }

    private HttpHeaders getJWTHeader(PermissionCollector collector) {
        HttpHeaders jwtHeader = new HttpHeaders();
        jwtHeader.add(HttpHeaders.AUTHORIZATION, "Bearer " + jwtTokenProvider.generateJwtToken(collector));
        return jwtHeader;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
}
