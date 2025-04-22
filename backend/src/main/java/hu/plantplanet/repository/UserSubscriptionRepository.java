package hu.plantplanet.repository;

import hu.plantplanet.model.SubscriptionPlan;
import hu.plantplanet.model.UserSubscription;
import hu.plantplanet.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    List<UserSubscription> findByNextTriggerDateBeforeAndStatus(
            LocalDateTime date,
            UserSubscription.SubscriptionStatus status
    );
    Optional<UserSubscription> findByIdAndUser(Long id, Users user);
    List<UserSubscription> findByUser(Users user);
}