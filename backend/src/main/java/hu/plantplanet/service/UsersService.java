package hu.plantplanet.service;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.dto.user.RegisterRequest;
import hu.plantplanet.exception.UserAlreadyExistsException;
import hu.plantplanet.exception.UserNotFoundException;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

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

    public static final String NO_USER_FOUND_BY_EMAIL = "No user found by email: ";

    // Modify the method to load user by email
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email);  // Changed to find by email
        if (user == null) {
            throw new UserNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        } else {
            PermissionCollector permissionCollector = new PermissionCollector(user);
            return permissionCollector;
        }
    }

    // Modify the method for finding user by email
    public Users findUserByEmail(String email) {
        return userRepository.findByEmail(email);  // Adjusted to search by email
    }

    public List<String> findPermissionsByUser(Integer userId) {
        return userRepository.findPermissionsByUser(userId);
    }

    public Users registerUser(RegisterRequest registerRequest) {
        Users existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser != null) {
            throw new UserAlreadyExistsException("Email is already registered");
        }
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        Users newUser = new Users(registerRequest.getName(), registerRequest.getEmail(), hashedPassword);
        return userRepository.save(newUser);
    }
}
