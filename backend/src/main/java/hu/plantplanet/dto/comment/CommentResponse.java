package hu.plantplanet.dto.comment;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {
    // Getters and setters
    private Integer id;
    private String username;
    private Integer plantId;
    private String title;
    private String commentText;
    private int rating;
    private LocalDateTime createdAt;

    public CommentResponse(Integer id, String username, Integer plantId, String title, String commentText, int rating, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.plantId = plantId;
        this.title = title;
        this.commentText = commentText;
        this.rating = rating;
        this.createdAt = createdAt;
    }


}

