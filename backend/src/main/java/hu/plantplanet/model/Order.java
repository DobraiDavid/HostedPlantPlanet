package hu.plantplanet.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private String name;
    private String email;
    private String address;
    private String city;
    private String zipcode;
    private String phoneNumber;
    private String paymentMethod;
    private BigDecimal totalPrice;

    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;


    public Order(String name, String email, String address, String city, String zipcode, String phoneNumber, String paymentMethod, BigDecimal totalPrice, LocalDateTime orderDate, List<OrderItem> orderItems) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.zipcode = zipcode;
        this.phoneNumber = phoneNumber;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.orderDate = orderDate;
        this.orderItems = orderItems;
    }

}

