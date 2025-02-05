package hu.plantplanet.service;

import hu.plantplanet.model.Users;
import hu.plantplanet.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsersService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new user
    @Transactional
    public Users registerUser(String name, String email, String password) {
        // Check if the email is already in use
        if (usersRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(password);

        Users user = new Users(name, email, encodedPassword);
        return usersRepository.save(user);
    }

    // Login - check if credentials are valid (email and password match)
    public boolean loginUser(String email, String password) {
        Optional<Users> userOpt = usersRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Users user = userOpt.get();

        // Verify the password with the encoded one
        return passwordEncoder.matches(password, user.getPassword());
    }

    // Get user by ID
    public Optional<Users> getUserById(Integer id) {
        return usersRepository.findById(id);
    }

    // Update user details
    @Transactional
    public Users updateUser(Integer id, String name, String email, String password) {
        Optional<Users> userOpt = usersRepository.findById(id);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Users user = userOpt.get();
        user.setName(name);
        user.setEmail(email);

        // If the password is not empty, encode and update it
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        return usersRepository.save(user);
    }

    // Delete user by ID
    @Transactional
    public void deleteUser(Integer id) {
        if (!usersRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        usersRepository.deleteById(id);
    }
}
