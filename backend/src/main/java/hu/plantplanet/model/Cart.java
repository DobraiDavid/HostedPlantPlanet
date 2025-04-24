package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = true)
    private Plants plant;

    @ManyToOne
    @JoinColumn(name = "pot_id", nullable = true)
    private Pots pot;

    private BigDecimal price;
    private int amount;
    private boolean isSubscription;

    @ManyToOne
    @JoinColumn(name = "subscription_plan_id", nullable = true)
    private SubscriptionPlan subscriptionPlan;
}