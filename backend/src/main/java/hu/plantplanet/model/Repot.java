package hu.plantplanet.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "repot_reminders")
@Getter
@Setter
public class Repot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_item_id")
    private Long orderItemId;

    private String email;
    private String plantName;
    private LocalDateTime remindAt;
    private boolean sent;

}