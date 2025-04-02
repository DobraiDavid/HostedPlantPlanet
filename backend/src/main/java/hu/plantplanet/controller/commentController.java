package hu.plantplanet.controller;

import hu.plantplanet.dto.comment.CommentRequest;
import hu.plantplanet.dto.comment.CommentResponse;
import hu.plantplanet.model.Comments;
import hu.plantplanet.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/comments")
@Tag(name="Comments")
public class commentController {

    @Autowired
    private CommentService commentService;


    @GetMapping("/{plantId}")
    @Operation(summary = "Get comments for a specific plant")
    public List<CommentResponse> getComments(@PathVariable Integer plantId) {
        return commentService.getCommentsByPlant(plantId);
    }

    @PostMapping("/post")
    @Operation(summary = "Post a new comment")
    public Comments postComment(@RequestBody CommentRequest request) {
        return commentService.addComment(request.getUserId(), request.getPlantId(), request.getTitle(),request.getCommentText(), request.getRating(), request.getProfilePicture());
    }
}

