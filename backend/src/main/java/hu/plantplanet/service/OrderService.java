package hu.plantplanet.service;

import hu.plantplanet.dto.email.OrderEmailDTO;
import hu.plantplanet.dto.order.*;
import hu.plantplanet.model.*;
import hu.plantplanet.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Order placeOrder(OrderDTO orderDto) {
        Order order = new Order();
        order.setName(orderDto.getName());
        order.setEmail(orderDto.getEmail());
        order.setAddress(orderDto.getAddress());
        order.setCity(orderDto.getCity());
        order.setZipcode(orderDto.getZipcode());
        order.setPhoneNumber(orderDto.getPhoneNumber());
        order.setPaymentMethod(orderDto.getPaymentMethod());
        order.setTotalPrice(orderDto.getTotalPrice());
        order.setOrderDate(orderDto.getOrderDate() != null ?
                orderDto.getOrderDate() : LocalDateTime.now());

        List<OrderItem> orderItems = orderDto.getOrderItems().stream().map(itemDto -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setAmount(itemDto.getAmount());
            item.setPrice(itemDto.getPrice());
            item.setSubscription(itemDto.isSubscription());

            if (itemDto.getUserId() != null) {
                Users user = new Users();
                user.setId(Math.toIntExact(itemDto.getUserId()));
                item.setUser(user);
            }

            if (itemDto.isSubscription()) {
                SubscriptionPlan plan = new SubscriptionPlan();
                plan.setId(itemDto.getSubscriptionPlanId());
                plan.setName(itemDto.getSubscriptionPlanName());
                item.setSubscriptionPlan(plan);
            } else {
                Plants plant = new Plants();
                plant.setId(Math.toIntExact(itemDto.getPlantId()));
                plant.setName(itemDto.getPlantName());
                item.setPlant(plant);

                if (itemDto.getPotId() != null) {
                    Pots pot = new Pots();
                    pot.setId(Math.toIntExact(itemDto.getPotId()));
                    pot.setName(itemDto.getPotName());
                    item.setPot(pot);
                }
            }

            return item;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);
        sendOrderConfirmationEmail(savedOrder);
        return savedOrder;
    }

    private void sendOrderConfirmationEmail(Order order) {
        StringBuilder orderDetails = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDate = order.getOrderDate().format(formatter);

        // Header information
        orderDetails.append("Order Date: ").append(formattedDate).append("\n");
        orderDetails.append("Total Amount: $").append(String.format("%.2f", order.getTotalPrice())).append("\n\n");
        orderDetails.append("Shipping Address:\n");
        orderDetails.append(order.getName()).append("\n");
        orderDetails.append(order.getAddress()).append("\n");
        orderDetails.append(order.getZipcode()).append(" ").append(order.getCity()).append("\n");
        orderDetails.append("Phone: ").append(order.getPhoneNumber()).append("\n\n");
        orderDetails.append("Payment Method: ").append(order.getPaymentMethod()).append("\n\n");
        orderDetails.append("Items Ordered:\n");

        for (OrderItem item : order.getOrderItems()) {
            orderDetails.append("- ");

            if (item.isSubscription()) {
                // Subscription item
                String subscriptionName = item.getSubscriptionPlan() != null &&
                        item.getSubscriptionPlan().getName() != null ?
                        item.getSubscriptionPlan().getName() :
                        "Subscription Plan #" + item.getSubscriptionPlan().getId();

                String interval = item.getSubscriptionPlan() != null &&
                        item.getSubscriptionPlan().getId() == 1L ?
                        "Quarter" : "Month";

                orderDetails.append(subscriptionName)
                        .append(": $")
                        .append(String.format("%.2f", item.getPrice()))
                        .append(" per ")
                        .append(interval);
            } else {
                // Plant/pot item
                boolean hasPlant = item.getPlant() != null;
                boolean hasPot = item.getPot() != null;

                if (hasPlant) {
                    orderDetails.append(item.getPlant().getName());
                }
                if (hasPot) {
                    if (hasPlant) orderDetails.append(" with ");
                    orderDetails.append(item.getPot().getName()).append(" Pot");
                }
                if (!hasPlant && !hasPot) {
                    orderDetails.append("Custom Item");
                }

                double totalPrice = item.getPrice() * item.getAmount();
                double unitPrice = item.getPrice();

                orderDetails.append(": $")
                        .append(String.format("%.2f", totalPrice));

                if (item.getAmount() > 1) {
                    orderDetails.append(" (")
                            .append(item.getAmount())
                            .append(" × $")
                            .append(String.format("%.2f", unitPrice))
                            .append(")");
                }
            }
            orderDetails.append("\n");
        }

        emailService.sendOrderConfirmation(
                order.getEmail(),
                order.getName(),
                orderDetails.toString()
        );
    }
}