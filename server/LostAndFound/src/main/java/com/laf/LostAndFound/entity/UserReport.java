package com.laf.LostAndFound.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "userReports")
public class UserReport {
    @Id
    private ObjectId id;
    private String itemType;
    private String itemName;
    private String itemCategory;
    private String itemLocation;
    private String itemDate;
    private String itemDescription;
    private String itemPhoto; // This stores the base64 string
    private String email;
    private String phone;

    @CreatedDate
    private Date createdAt;

    @JsonProperty("_id")
    public String getId() {
        return id != null ? id.toHexString() : null;
    }
}