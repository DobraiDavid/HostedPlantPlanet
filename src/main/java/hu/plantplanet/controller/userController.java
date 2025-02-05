package hu.plantplanet.controller;

import hu.plantplanet.service.UsersService;
import hu.plantplanet.model.Users;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@Tag(name="User functions", description = "Manage users")
public class userController {

    private final UsersService usersService;

    @Autowired
    public userController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping("/register")
    public Users registerUser(@RequestParam String name, @RequestParam String email, @RequestParam String password) {
        return usersService.registerUser(name, email, password);
    }

    @PostMapping("/login")
    public boolean loginUser(@RequestParam String email, @RequestParam String password) {
        return usersService.loginUser(email, password);
    }

}
