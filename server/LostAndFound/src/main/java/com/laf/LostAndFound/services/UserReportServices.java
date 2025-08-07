package com.laf.LostAndFound.services;

import com.laf.LostAndFound.entity.User;
import com.laf.LostAndFound.entity.UserReport;
import com.laf.LostAndFound.repository.UserReportRepository;
import com.laf.LostAndFound.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserReportServices {

    @Autowired
    private UserReportRepository userReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServices userServices;


    public boolean addEntry(UserReport newReport, String email) {
        if (email == null || newReport == null) return false;

        // Ensure the email is set in the report
        newReport.setEmail(email.toLowerCase());

        // Check if this is an admin post
        if ("laf@admin.com".equals(email.toLowerCase())) {
            // For admin posts, save directly without user validation
            try {
                System.out.println("Saving admin post: " + newReport.getItemName());
                UserReport savedReport = userReportRepository.save(newReport);
                System.out.println("Admin post saved successfully with ID: " + savedReport.getId());
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }

        // For regular user posts, check if user exists
        Optional<User> userOpt = userRepository.findByEmail(email.toLowerCase());
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();

        List<UserReport> existingReports = user.getUserReports();
        if (existingReports != null) {
            boolean isDuplicate = existingReports.stream().anyMatch(existing ->
                    equalsIgnoreCase(existing.getItemName(), newReport.getItemName()) &&
                            equalsIgnoreCase(existing.getItemCategory(), newReport.getItemCategory()) &&
                            equalsIgnoreCase(existing.getItemLocation(), newReport.getItemLocation()) &&
                            Objects.equals(existing.getItemDate(), newReport.getItemDate())
            );
            if (isDuplicate) return false;
        }

        // Save new report
        UserReport savedReport = userReportRepository.save(newReport);

        // Attach to user
        if (existingReports == null) {
            existingReports = new ArrayList<>();
            user.setUserReports(existingReports);
        }
        existingReports.add(savedReport);
        userRepository.save(user);

        return true;
    }

    private boolean equalsIgnoreCase(String a, String b) {
        return a != null && b != null && a.equalsIgnoreCase(b);
    }


    public UserReport updateUser(ObjectId id, UserReport userReport){
        Optional<UserReport> byId = userReportRepository.findById(id);
        if (byId.isPresent()){
            UserReport userReport1 = byId.get();
            userReport1.setItemName(userReport.getItemName());
            userReport1.setItemCategory(userReport.getItemCategory());
            userReport1.setItemDescription(userReport.getItemDescription());
            userReport1.setItemPhoto(userReport.getItemPhoto());
            userReport1.setItemDate(userReport.getItemDate());
            userReport1.setItemLocation(userReport.getItemLocation());
            userReport1.setEmail(userReport.getEmail());
            userReport1.setPhone(userReport.getPhone());
            userReportRepository.save(userReport1);
            return userReport1;
        }
        return userReport;
    }



    public boolean deleteItemById(String id) {
        ObjectId objectId;
        try {
            objectId = new ObjectId(id);
        } catch (IllegalArgumentException e) {
            return false; // Invalid ObjectId format
        }

        Optional<UserReport> reportOpt = userReportRepository.findById(objectId);
        if (reportOpt.isEmpty()) {
            return false;
        }

        UserReport reportToDelete = reportOpt.get();

        // Get user by email
        Optional<User> userOpt = userRepository.findByEmail(reportToDelete.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getUserReports() != null) {
                // Safely remove report reference by comparing string IDs
                boolean removed = user.getUserReports().removeIf(r ->
                        r.getId() != null && r.getId().toString().equals(id)
                );

                if (removed) {
                    userRepository.save(user);
                }
            }
        }

        // Delete the report itself
        userReportRepository.deleteById(objectId);
        return true;
    }







}
