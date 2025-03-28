package hu.plantplanet.dto.user;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class ReadUser {
    private Integer id;
    private String name;
    private String email;
    private String profileImage;

}
