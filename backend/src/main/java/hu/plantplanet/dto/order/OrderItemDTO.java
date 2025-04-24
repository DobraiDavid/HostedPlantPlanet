package hu.plantplanet.dto.order;

import hu.plantplanet.dto.plant.PlantDTO;
import hu.plantplanet.dto.pot.PotDTO;
import hu.plantplanet.dto.subsciption.SubscriptionPlanDTO;
import hu.plantplanet.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long userId;
    private Long plantId;
    private String plantName;
    private Long potId;
    private String potName;
    private Long subscriptionPlanId;
    private String subscriptionPlanName;
    private boolean subscription;
    private int amount;
    private double price;

    public static OrderItemDTO fromOrderItem(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setUserId(Long.valueOf(item.getUser() != null ? item.getUser().getId() : null));
        dto.setSubscription(item.isSubscription());
        dto.setAmount(item.getAmount());
        dto.setPrice(item.getPrice());

        if (item.getPlant() != null) {
            dto.setPlantId(Long.valueOf(item.getPlant().getId()));
            dto.setPlantName(item.getPlant().getName());
        }

        if (item.getPot() != null) {
            dto.setPotId(Long.valueOf(item.getPot().getId()));
            dto.setPotName(item.getPot().getName());
        }

        if (item.getSubscriptionPlan() != null) {
            dto.setSubscriptionPlanId(item.getSubscriptionPlan().getId());
            dto.setSubscriptionPlanName(item.getSubscriptionPlan().getName());
        }

        return dto;
    }
}