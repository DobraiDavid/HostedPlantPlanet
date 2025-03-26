package hu.plantplanet.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Plants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    // Store the images as a String that will represent a JSON array
    @Column(columnDefinition = "JSON")
    private String images; // Use String directly for JSON formatted data

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 50)
    private String light;

    @Column(length = 50)
    private String water;

    @Column(length = 50)
    private String humidity;

    @Column(length = 50)
    private String temperature;

    @Column(length = 50)
    private String fertilizing;

    @Column(length = 50)
    private String rePotting;

    @Column(length = 50)
    private String cleaning;

    @Column(length = 50)
    private String propagation;
}

