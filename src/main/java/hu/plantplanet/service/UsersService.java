package hu.plantplanet.service;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.dto.user.RegisterRequest;
import hu.plantplanet.exception.UserNotFoundException;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Qualifier("userDetailsService")
public class UsersService implements UserDetailsService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    public Users registerUser(RegisterRequest registerRequest) {
        Optional<Users> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        Users newUser = new Users(registerRequest.getName(), registerRequest.getEmail(), hashedPassword);
        return userRepository.save(newUser);
    }

}
