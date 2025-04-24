package hu.plantplanet.repository;

import hu.plantplanet.model.Pots;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PotRepository extends JpaRepository<Pots, Integer> {
}

