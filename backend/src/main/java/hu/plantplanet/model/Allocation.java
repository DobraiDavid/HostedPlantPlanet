package hu.plantplanet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "allocate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Allocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "permission_id", nullable = false, length = 30)
    private String permissionId;

    // Convenience constructor (optional)
    public Allocation(Integer userId, String permissionId) {
        this.userId = userId;
        this.permissionId = permissionId;
    }
}