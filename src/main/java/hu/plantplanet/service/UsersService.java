package hu.plantplanet.service;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.exception.UserNotFoundException;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@Qualifier("userDetailsService")
public class UsersService implements UserDetailsService {

    @Autowired
    private UsersRepository userRepository;

    public static final String NO_USER_FOUND_BY_USERNAME = "No user found by username: ";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findUserByName(username);
        if (user == null) {
            throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + username);
        } else {
            PermissionCollector permissionCollector = new PermissionCollector(user);
            return permissionCollector;
        }
    }

    public Users findUserByUsername(String username) {
        return userRepository.findUserByName(username);
    }


    public List<String> findPermissionsByUser(Integer userId) {
        return userRepository.findPermissionsByUser(userId);
    }
}
