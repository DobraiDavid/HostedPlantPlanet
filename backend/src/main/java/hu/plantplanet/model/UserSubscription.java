package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class UserSubscription {
    public enum SubscriptionStatus { ACTIVE, PAUSED, CANCELLED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Users user;

    @ManyToOne
    private SubscriptionPlan plan;

    private Integer intervalDays;
    private LocalDateTime startDate;
    private LocalDateTime nextTriggerDate;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status; // ACTIVE, PAUSED, CANCELLED
}
