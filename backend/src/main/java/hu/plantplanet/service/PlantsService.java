package hu.plantplanet.service;

import hu.plantplanet.model.Plants;
import hu.plantplanet.repository.PlantsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlantsService {

    @Autowired
    private PlantsRepository plantsRepository;

    // Get all plants
    public List<Plants> getAllPlants() {
        return plantsRepository.findAll();
    }

    // Get plant by ID
    public Optional<Plants> getPlantById(int id) {
        return plantsRepository.findById(id);
    }
}

