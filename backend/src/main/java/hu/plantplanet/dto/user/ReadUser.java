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

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}
