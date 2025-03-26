package hu.plantplanet.repository;

import hu.plantplanet.model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comments, Integer> {
    List<Comments> findByPlantId(Integer plantId);
}

