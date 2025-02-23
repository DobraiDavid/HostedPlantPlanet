package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = false)
    private Plants plants;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private int amount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    public Cart(Users users, Plants plants, BigDecimal price, int amount, BigDecimal totalPrice) {
        this.users = users;
        this.plants = plants;
        this.price = price;
        this.amount = amount;
        this.totalPrice = totalPrice;
    }
}
