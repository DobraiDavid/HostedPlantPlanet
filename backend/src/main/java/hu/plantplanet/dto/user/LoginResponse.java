package hu.plantplanet.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private ReadUser user;
    private String token;

    public LoginResponse(ReadUser user, String token) {
        this.user = user;
        this.token = token;
    }
}
