package hu.plantplanet.repository;

import hu.plantplanet.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Integer userId);
    Optional<Cart> findByUserIdAndPlantId(Integer userId, Integer plantId);
}
