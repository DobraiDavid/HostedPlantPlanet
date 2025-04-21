package hu.plantplanet.repository;

import hu.plantplanet.model.Repot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface RepotRepository extends JpaRepository<Repot, Long> {
    List<Repot> findBySentFalseAndRemindAtBefore(LocalDateTime now);
}
