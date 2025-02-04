package hu.plantplanet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class userController {

    @GetMapping("/products")
    public List<String> getProducts() {
        return List.of("Plant A", "Plant B", "Plant C");
    }
}