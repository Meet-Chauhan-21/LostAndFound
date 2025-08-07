package com.laf.LostAndFound.services;

import com.laf.LostAndFound.entity.User;
import com.laf.LostAndFound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean userRegister(User user) {
        String userEmail = user.getEmail().toLowerCase();
        Optional<User> existingUser = userRepository.findByEmail(userEmail);
        // If user already exists, don't register again
        if (existingUser.isPresent()) {
            return false;
        }
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Save only if email not already in use
        userRepository.save(user);
        return true;
    }


    public boolean userLogin(String email, String password) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isPresent() && passwordEncoder.matches(password, byEmail.get().getPassword())) {
            return true;
        } else {
            return false;
        }
    }


    public User getUser(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new org.springframework.security.core.userdetails.User(
                user.get().getEmail(),
                user.get().getPassword(),
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("USER"))
        );
    }
}
