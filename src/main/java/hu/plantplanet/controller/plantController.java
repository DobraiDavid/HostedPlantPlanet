package hu.plantplanet.controller;

import hu.plantplanet.model.Plants;
import hu.plantplanet.service.PlantsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@Tag(name="Plants")
public class plantController {

    @Autowired
    private PlantsService plantsService;

    // Endpoint to get all plants
    @GetMapping("/plants")
    @Operation(summary = "List all plants")
    public List<Plants> getAllPlants() {
        return plantsService.getAllPlants();
    }

    // Endpoint to get a specific plant by ID
    @GetMapping("/plants/{id}")
    @Operation(summary = "List the details of the selected plant")
    public ResponseEntity<Plants> getPlantById(@PathVariable int id) {
        Optional<Plants> plant = plantsService.getPlantById(id);
        return plant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
