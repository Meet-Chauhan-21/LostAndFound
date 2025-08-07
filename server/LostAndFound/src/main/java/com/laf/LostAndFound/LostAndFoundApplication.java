package com.laf.LostAndFound;

import com.laf.LostAndFound.entity.User;
import com.laf.LostAndFound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@SpringBootApplication
@EnableMongoAuditing
public class LostAndFoundApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(LostAndFoundApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if it doesn't exist
        if (!userRepository.findByEmail("laf@admin.com").isPresent()) {
            User adminUser = new User();
            adminUser.setUsername("Admin");
            adminUser.setEmail("laf@admin.com");
            adminUser.setPassword(passwordEncoder.encode("admin@123"));
            adminUser.setPhone("9265379915");
            User savedAdmin = userRepository.save(adminUser);
            System.out.println("Admin user created successfully!");
            System.out.println("Admin user details - Email: " + savedAdmin.getEmail() + ", Phone: " + savedAdmin.getPhone() + ", Username: " + savedAdmin.getUsername());
        } else {
            Optional<User> existingAdmin = userRepository.findByEmail("laf@admin.com");
            if (existingAdmin.isPresent()) {
                User admin = existingAdmin.get();
                System.out.println("Admin user already exists - Email: " + admin.getEmail() + ", Phone: " + admin.getPhone() + ", Username: " + admin.getUsername());
            }
        }
    }
}
