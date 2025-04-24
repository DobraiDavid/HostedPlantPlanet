package hu.plantplanet.controller;

import hu.plantplanet.model.Pots;
import hu.plantplanet.repository.PotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pots")
public class potController {

    @Autowired
    private PotRepository potRepository;

    @GetMapping
    public List<Pots> getPots() {
        return potRepository.findAll();
    }
}

