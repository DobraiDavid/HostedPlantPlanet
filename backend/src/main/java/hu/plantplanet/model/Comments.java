package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;  // User who commented

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = false)
    private Plants plant;  // Plant being commented on

    @Column(nullable = false, length = 255)
    private String title; // New field

    @Column(nullable = false, columnDefinition = "TEXT")
    private String commentText;

    @Column(nullable = false)
    private int rating;  // 1 to 5

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;  // Let the database handle the timestamp generation

}
