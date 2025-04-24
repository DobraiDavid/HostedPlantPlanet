package hu.plantplanet.dto.subsciption;

import hu.plantplanet.model.SubscriptionPlan;
import lombok.Data;

@Data
public class SubscriptionPlanDTO {
    private Long id;
    private String name;

    public static SubscriptionPlanDTO fromSubscriptionPlan(SubscriptionPlan plan) {
        SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        return dto;
    }
}
