package hu.plantplanet.dto.email;

import hu.plantplanet.model.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderEmailDTO {
    private String orderId;
    private String orderDate;
    private BigDecimal totalPrice;
    private String name;
    private String email;
    private String address;
    private String city;
    private String zipcode;
    private String phoneNumber;
    private String paymentMethod;

    private List<OrderItemEmailDTO> items;

    @Data
    public static class OrderItemEmailDTO {
        private String productName;
        private int quantity;
        private double price;
        private boolean isSubscription;
        private Long subscriptionPlanId; // Add this field
    }

    public static OrderEmailDTO fromOrder(Order order) {
        OrderEmailDTO dto = new OrderEmailDTO();
        dto.setOrderId(order.getOrderId().toString());
        dto.setOrderDate(order.getOrderDate().toString());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setName(order.getName());
        dto.setEmail(order.getEmail());
        dto.setAddress(order.getAddress());
        dto.setCity(order.getCity());
        dto.setZipcode(order.getZipcode());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setPaymentMethod(order.getPaymentMethod());

        dto.setItems(order.getOrderItems().stream()
                .map(item -> {
                    OrderItemEmailDTO itemDto = new OrderItemEmailDTO();
                    itemDto.setQuantity(item.getAmount());
                    itemDto.setPrice(item.getPrice());
                    itemDto.setSubscription(item.isSubscription());
                    itemDto.setSubscriptionPlanId(item.getSubscriptionPlan() != null ?
                            item.getSubscriptionPlan().getId() : null);

                    // Handle product name
                    if (item.isSubscription()) {
                        itemDto.setProductName("Subscription Plan #" + item.getSubscriptionPlan().getId());
                    } else {
                        StringBuilder productName = new StringBuilder();
                        if (item.getPlant() != null) {
                            productName.append(item.getPlant().getName());
                        }
                        if (item.getPot() != null) {
                            if (productName.length() > 0) {
                                productName.append(" with ");
                            }
                            productName.append(item.getPot().getName()).append(" Pot");
                        }
                        itemDto.setProductName(productName.length() > 0 ?
                                productName.toString() : "Custom Item");
                    }
                    return itemDto;
                })
                .collect(Collectors.toList()));

        return dto;
    }
}