package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Users user; // Reference to the User entity

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = true) // Nullable since plant_id can be null for subscription
    private Plants plant; // Reference to the Plant entity (nullable for subscription items)

    private BigDecimal price; // Price of the plant
    private int amount; // Quantity of the plant in the cart
    private boolean isSubscription; // Whether it's a subscription

    @ManyToOne
    @JoinColumn(name = "subscription_plan_id", nullable = true) // Nullable for regular cart items
    private SubscriptionPlan subscriptionPlan; // Reference to the SubscriptionPlan entity
}
