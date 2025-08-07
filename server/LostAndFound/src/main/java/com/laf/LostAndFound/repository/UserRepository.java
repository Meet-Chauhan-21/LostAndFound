package com.laf.LostAndFound.repository;

import com.laf.LostAndFound.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User , ObjectId> {

    public Optional<User> findByEmail(String email);

}
