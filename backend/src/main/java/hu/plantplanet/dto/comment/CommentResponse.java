package hu.plantplanet.dto.comment;

import java.time.LocalDateTime;

public class CommentResponse {
    private Integer id;
    private String username;
    private Integer plantId;
    private String commentText;
    private int rating;
    private LocalDateTime createdAt;

    public CommentResponse(Integer id, String username, Integer plantId, String commentText, int rating, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.plantId = plantId;
        this.commentText = commentText;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Integer getId() { return id; }
    public String getUsername() { return username; }
    public Integer getPlantId() { return plantId; }
    public String getCommentText() { return commentText; }
    public int getRating() { return rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

