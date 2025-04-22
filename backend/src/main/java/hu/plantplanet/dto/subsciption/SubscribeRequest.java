package hu.plantplanet.dto.subsciption;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscribeRequest {
    private Long planId;
    private Integer intervalDays;
}
