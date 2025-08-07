package com.laf.LostAndFound.controller;

import com.laf.LostAndFound.dto.AuthResponse;
import com.laf.LostAndFound.dto.LoginRequest;
import com.laf.LostAndFound.entity.User;
import com.laf.LostAndFound.entity.UserReport;
import com.laf.LostAndFound.repository.UserReportRepository;
import com.laf.LostAndFound.repository.UserRepository;
import com.laf.LostAndFound.security.JwtUtil;
import com.laf.LostAndFound.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/lostAndFound")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserReportRepository userReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


//    User Register
    @PostMapping("/user-register")
    public String userRegister(@RequestBody User user){
        boolean b = userServices.userRegister(user);
        if (b){
            return "Registration successfully";
        } else {
            return "Registration failed: Email already exists";
        }
    }

//    User Login
    @PostMapping("/user-login")
    public ResponseEntity<?> userLogin(@RequestBody LoginRequest loginRequest) {
        try {
            // First check if user exists and password matches
            boolean isValidLogin = userServices.userLogin(loginRequest.getEmail(), loginRequest.getPassword());
            
            if (isValidLogin) {
                // Get user data
                User user = userServices.getUser(loginRequest.getEmail());
                
                // Generate JWT token
                final String jwt = jwtUtil.generateToken(loginRequest.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successfully");
                response.put("token", jwt);
                response.put("email", loginRequest.getEmail());
                response.put("username", user.getUsername());
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Login failed: Email and Password Wrong");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login failed: Email and Password Wrong");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user-get/{email}")
    public User getUser(@PathVariable String email){
        return userServices.getUser(email);
    }

    @GetMapping("/search")
    public List<UserReport> searchByItemName(@RequestParam String itemName) {
        return userReportRepository.findByItemNameContainingIgnoreCase(itemName);
    }

    @GetMapping("/user-history/{email}")
    public List<UserReport> getUserHistory(@PathVariable String email) {
        System.out.println("Fetching history for: " + email);
        List<UserReport> reports = userReportRepository.findByEmail(email);
        System.out.println("Found " + reports.size() + " reports.");
        for (UserReport report : reports) {
            System.out.println("Report: " + report.getItemName() + " - Email: " + report.getEmail());
        }
        return reports;
    }


    @GetMapping("/getUser/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User foundUser = user.get();
            System.out.println("Found user: " + foundUser.getEmail() + ", Phone: " + foundUser.getPhone() + ", Username: " + foundUser.getUsername());
            return ResponseEntity.ok(foundUser);
        } else {
            System.out.println("User not found for email: " + email);
            // For admin user, create it if it doesn't exist
            if ("laf@admin.com".equals(email)) {
                System.out.println("Creating admin user as it doesn't exist");
                User adminUser = new User();
                adminUser.setUsername("Admin");
                adminUser.setEmail("laf@admin.com");
                adminUser.setPassword(passwordEncoder.encode("admin@123"));
                adminUser.setPhone("9265379915");
                User savedAdmin = userRepository.save(adminUser);
                System.out.println("Admin user created: " + savedAdmin.getEmail() + ", Phone: " + savedAdmin.getPhone());
                return ResponseEntity.ok(savedAdmin);
            }
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        try {
            // Check if it's the admin user
            if ("laf@admin.com".equals(loginRequest.getEmail()) && "admin@123".equals(loginRequest.getPassword())) {
                Optional<User> adminUser = userRepository.findByEmail("laf@admin.com");
                if (adminUser.isPresent()) {
                    User admin = adminUser.get();
                    String token = jwtUtil.generateToken(admin.getEmail());
                    
                    AuthResponse response = new AuthResponse();
                    response.setToken(token);
                    response.setMessage("Admin login successful");
                    response.setEmail(admin.getEmail());
                    response.setUsername(admin.getUsername());
                    response.setIsAdmin(true);
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }





}
