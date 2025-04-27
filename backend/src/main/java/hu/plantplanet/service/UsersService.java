package hu.plantplanet.service;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.dto.user.ChangeUserRequest;
import hu.plantplanet.dto.user.RegisterRequest;
import hu.plantplanet.exception.EmailAlreadyExistsException;
import hu.plantplanet.exception.UserAlreadyExistsException;
import hu.plantplanet.exception.UserNotFoundException;
import hu.plantplanet.model.Allocation;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.AllocationRepository;
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

@Service
@Transactional
@Qualifier("userDetailsService")
public class UsersService implements UserDetailsService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AllocationRepository allocationRepository;

    public static final String NO_USER_FOUND_BY_EMAIL = "No user found by email: ";

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        }
        return new PermissionCollector(user, this);
    }

    public Users findUserByEmail(String email) {
        return userRepository.findByEmail(email);  // Adjusted to search by email
    }

    public List<String> findPermissionsByUser(Integer userId) {
        return userRepository.findPermissionsByUser(userId);
    }

    public Users registerUser(RegisterRequest registerRequest) {
        // Existing validation
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        // Create and save user
        Users newUser = new Users(
                registerRequest.getName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getProfileImage()
        );
        Users savedUser = userRepository.save(newUser);

        // Assign ROLE_USER explicitly
        Allocation roleAssignment = new Allocation();
        roleAssignment.setUserId(savedUser.getId());
        roleAssignment.setPermissionId("ROLE_USER");
        allocationRepository.save(roleAssignment);

        return savedUser;
    }

    @Transactional
    public Users updateUser(String email, ChangeUserRequest changeRequest) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        }

        // Handle email change
        if (changeRequest.getEmail() != null && !changeRequest.getEmail().equals(user.getEmail())) {
            // Validate new email isn't already taken
            if (userRepository.existsByEmail(changeRequest.getEmail())) {
                throw new EmailAlreadyExistsException("Email already in use");
            }
            user.setEmail(changeRequest.getEmail());
        }

        // Update other fields
        if (changeRequest.getName() != null) {
            user.setName(changeRequest.getName());
        }
        if (changeRequest.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(changeRequest.getPassword()));
        }
        if (changeRequest.getProfileImage() != null) {
            user.setProfileImage(changeRequest.getProfileImage());
        }
        return userRepository.save(user);
    }
}
