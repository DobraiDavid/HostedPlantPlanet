package hu.plantplanet.dto.plant;

import hu.plantplanet.model.Plants;
import lombok.Data;

@Data
public class PlantDTO {
    private Integer id;
    private String name;

    public static PlantDTO fromPlant(Plants plant) {
        PlantDTO dto = new PlantDTO();
        dto.setId(plant.getId());
        dto.setName(plant.getName());
        return dto;
    }
}
