package hu.plantplanet.dto.user;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChangeUserRequest {
    private String name;
    private String email;
    private String password;
    private String profileImage;

}

