package com.laf.LostAndFound.repository;

import com.laf.LostAndFound.entity.UserReport;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserReportRepository extends MongoRepository<UserReport, ObjectId> {
    List<UserReport> findByItemNameContainingIgnoreCase(String itemName);
    List<UserReport> findByEmail(String email);
    Optional<UserReport> findById(ObjectId id);
}
