package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name = "subscription_plans")
public class SubscriptionPlan {
    public enum SubscriptionType { RANDOM_PLANT, CARE_TIPS }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "JSON")
    private String images;

    private String description;

    @Enumerated(EnumType.STRING)
    private SubscriptionType type;  // RANDOM_PLANT or CARE_TIPS

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}