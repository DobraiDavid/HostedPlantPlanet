package hu.plantplanet.converter;

import hu.plantplanet.dto.user.ReadUser;
import hu.plantplanet.model.Users;

public class UserConverter {
    public static ReadUser convertModelToRead(Users user) {
        ReadUser readUser = new ReadUser();
        readUser.setId( user.getId() );
        readUser.setName( user.getName() );
        readUser.setEmail(user.getEmail());
        readUser.setProfileImage(user.getProfileImage());
        return readUser;
    }
}
