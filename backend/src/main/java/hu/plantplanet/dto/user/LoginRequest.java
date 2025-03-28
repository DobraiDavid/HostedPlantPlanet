package hu.plantplanet.dto.user;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class LoginRequest {
    private String email;
    private String password;

}
