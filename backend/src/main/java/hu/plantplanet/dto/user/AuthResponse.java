package hu.plantplanet.dto.user;

import hu.plantplanet.converter.UserConverter;
import hu.plantplanet.model.Users;

public record AuthResponse(ReadUser user, String token) {
    public static AuthResponse from(Users user, String token) {
        return new AuthResponse(UserConverter.convertModelToRead(user), token);
    }
}