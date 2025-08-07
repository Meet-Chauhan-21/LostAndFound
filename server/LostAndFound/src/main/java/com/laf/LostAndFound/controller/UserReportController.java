package com.laf.LostAndFound.controller;

import com.laf.LostAndFound.entity.UserReport;
import com.laf.LostAndFound.repository.UserReportRepository;
import com.laf.LostAndFound.services.UserReportServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user-reports")
public class UserReportController {

    @Autowired
    private UserReportServices userReportServices;

    @Autowired
    private UserReportRepository userReportRepository;

    @PostMapping("/user-entry/{email}")
    public ResponseEntity<String> addEntry(@RequestBody UserReport userReport, @PathVariable String email) {
        if (userReport == null || email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid input: Email or report is missing");
        }

        boolean added = userReportServices.addEntry(userReport, email);

        if (added) {
            return ResponseEntity.ok("Success : Report added");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("⚠️ Duplicate: Report already exists or user not found");
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<List<UserReport>> getLatestReports() {
        List<UserReport> all = userReportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<UserReport> latest16 = all.stream().limit(16).collect(Collectors.toList());
        System.out.println("Total reports in database: " + all.size());
        System.out.println("Latest 16 reports: " + latest16.size());
        for (UserReport report : latest16) {
            System.out.println("Report: " + report.getItemName() + " by " + report.getEmail() + " at " + report.getCreatedAt());
        }
        return ResponseEntity.ok(latest16);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserReport>> getAllReports() {
        List<UserReport> all = userReportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        System.out.println("All reports: " + all.size());
        for (UserReport report : all) {
            System.out.println("Report ID: " + report.getId() + ", Name: " + report.getItemName());
        }
        return ResponseEntity.ok(all);
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<UserReport> getItemById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            Optional<UserReport> item = userReportRepository.findById(objectId);
            return item.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/report-update/{id}")
    public ResponseEntity<String> updateReport(
            @PathVariable String id,
            @RequestBody UserReport updatedReport
    ) {
        try {
            ObjectId objectId = new ObjectId(id);
            Optional<UserReport> optionalReport = userReportRepository.findById(objectId);
            if (optionalReport.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Report not found");
            }

            UserReport existingReport = optionalReport.get();

            // Update all fields
            existingReport.setItemName(updatedReport.getItemName());
            existingReport.setItemCategory(updatedReport.getItemCategory());
            existingReport.setItemLocation(updatedReport.getItemLocation());
            existingReport.setItemDate(updatedReport.getItemDate());
            existingReport.setItemDescription(updatedReport.getItemDescription());
            existingReport.setItemType(updatedReport.getItemType());
            existingReport.setEmail(updatedReport.getEmail());
            existingReport.setPhone(updatedReport.getPhone());

            // Only update image if a new one was provided
            if (updatedReport.getItemPhoto() != null &&
                    !updatedReport.getItemPhoto().isEmpty() &&
                    !updatedReport.getItemPhoto().equals(existingReport.getItemPhoto())) {
                existingReport.setItemPhoto(updatedReport.getItemPhoto());
            }

            userReportRepository.save(existingReport);
            return ResponseEntity.ok("Report updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid ID format: " + id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
        }
    }

    @GetMapping("/report/{id}")
    public ResponseEntity<?> getReportById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            Optional<UserReport> report = userReportRepository.findById(objectId);
            if (report.isPresent()) {
                return ResponseEntity.ok(report.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid ID format: " + id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving item");
        }
    }

    @DeleteMapping("/items-delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id) {
        try {
            boolean deleted = userReportServices.deleteItemById(id);
            if (deleted) {
                return ResponseEntity.ok("Item deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid ID format: " + id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed");
        }
    }

    @GetMapping("/category-stats")
    public ResponseEntity<Map<String, Long>> getCategoryStatistics() {
        try {
            List<UserReport> allReports = userReportRepository.findAll();
            
            Map<String, Long> categoryStats = allReports.stream()
                .filter(report -> report.getItemCategory() != null && !report.getItemCategory().isEmpty())
                .collect(Collectors.groupingBy(
                    UserReport::getItemCategory,
                    Collectors.counting()
                ));
            
            return ResponseEntity.ok(categoryStats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}