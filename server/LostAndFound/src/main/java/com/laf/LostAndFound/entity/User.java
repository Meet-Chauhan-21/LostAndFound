package com.laf.LostAndFound.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private ObjectId id;
    private String username;

    @Indexed(unique = true)
    private String email;
    private String password;
    private String phone;

    @CreatedDate
    private LocalDateTime createdAt;

    @DBRef
    @JsonIgnore
    private List<UserReport> userReports = new ArrayList<>();

    public String getId() {
        return id != null ? id.toHexString() : null;
    }
}
