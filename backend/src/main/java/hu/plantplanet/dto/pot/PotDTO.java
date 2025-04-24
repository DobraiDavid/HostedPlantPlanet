package hu.plantplanet.dto.pot;

import hu.plantplanet.model.Pots;
import lombok.Data;

@Data
public class PotDTO {
    private Integer id;
    private String name;

    public static PotDTO fromPot(Pots pot) {
        PotDTO dto = new PotDTO();
        dto.setId(pot.getId());
        dto.setName(pot.getName());
        return dto;
    }
}
