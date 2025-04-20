package hu.plantplanet;

import hu.plantplanet.controller.plantController;
import hu.plantplanet.model.Plants;
import hu.plantplanet.service.PlantsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PlantControllerTest {

    @Mock
    private PlantsService plantsService;

    @InjectMocks
    private plantController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllPlants_ShouldReturnAllPlants() {
        // Arrange
        Plants plant1 = new Plants();
        plant1.setId(1);
        plant1.setName("Monstera");

        Plants plant2 = new Plants();
        plant2.setId(2);
        plant2.setName("Aloe Vera");

        List<Plants> expectedPlants = Arrays.asList(plant1, plant2);
        when(plantsService.getAllPlants()).thenReturn(expectedPlants);

        // Act
        List<Plants> actualPlants = controller.getAllPlants();

        // Assert
        assertEquals(expectedPlants.size(), actualPlants.size());
        assertEquals(expectedPlants, actualPlants);
        verify(plantsService, times(1)).getAllPlants();
    }

    @Test
    void getPlantById_WhenPlantExists_ShouldReturnPlant() {
        // Arrange
        int plantId = 1;
        Plants expectedPlant = new Plants();
        expectedPlant.setId(plantId);
        expectedPlant.setName("Monstera");

        when(plantsService.getPlantById(plantId)).thenReturn(Optional.of(expectedPlant));

        // Act
        ResponseEntity<Plants> response = controller.getPlantById(plantId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedPlant, response.getBody());
        verify(plantsService, times(1)).getPlantById(plantId);
    }

    @Test
    void getPlantById_WhenPlantDoesNotExist_ShouldReturnNotFound() {
        // Arrange
        int plantId = 999;
        when(plantsService.getPlantById(plantId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Plants> response = controller.getPlantById(plantId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(plantsService, times(1)).getPlantById(plantId);
    }
}