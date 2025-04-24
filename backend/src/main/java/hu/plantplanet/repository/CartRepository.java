package hu.plantplanet.repository;

import hu.plantplanet.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Integer userId);
    List<Cart> findByUserIdAndPlantId(Integer userId, Integer plantId);
    Optional<Cart> findByIdAndUserId(Integer id, Integer userId);
    Optional<Cart> findByUserIdAndSubscriptionPlanId(Integer userId, Long subscriptionPlanId);

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.plant LEFT JOIN FETCH c.subscriptionPlan LEFT JOIN FETCH c.pot WHERE c.user.id = :userId")
    List<Cart> findByUserIdWithDetails(@Param("userId") Integer userId);
}
