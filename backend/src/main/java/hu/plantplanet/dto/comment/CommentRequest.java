package hu.plantplanet.dto.comment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    private Integer userId;
    private Integer plantId;
    private String commentText;
    private int rating;
}

