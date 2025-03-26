package hu.plantplanet.service;

import hu.plantplanet.dto.comment.CommentResponse;
import hu.plantplanet.model.Users;
import hu.plantplanet.model.Plants;
import hu.plantplanet.model.Comments;
import hu.plantplanet.repository.UsersRepository;
import hu.plantplanet.repository.PlantsRepository;
import hu.plantplanet.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final UsersRepository usersRepository;
    private final PlantsRepository plantsRepository;
    private final CommentRepository commentRepository;

    public CommentService(UsersRepository usersRepository, PlantsRepository plantsRepository, CommentRepository commentRepository) {
        this.usersRepository = usersRepository;
        this.plantsRepository = plantsRepository;
        this.commentRepository = commentRepository;
    }

    public List<CommentResponse> getCommentsByPlant(Integer plantId) {
        List<Comments> comments = commentRepository.findByPlantId(plantId);
        return comments.stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getUser().getName(), // Only return the username, not the full user object
                        comment.getPlant().getId(), // Only return plant ID, not full plant object
                        comment.getCommentText(),
                        comment.getRating(),
                        comment.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public Comments addComment(Integer userId, Integer plantId, String commentText, int rating) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Plants plant = plantsRepository.findById(plantId).orElseThrow(() -> new RuntimeException("Plant not found"));

        Comments comment = new Comments();
        comment.setUser(user);
        comment.setPlant(plant);
        comment.setCommentText(commentText);
        comment.setRating(rating);

        return commentRepository.save(comment);
    }
}


