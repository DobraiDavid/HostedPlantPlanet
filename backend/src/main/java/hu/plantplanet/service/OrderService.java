package hu.plantplanet.service;

import hu.plantplanet.dto.order.OrderDTO;
import hu.plantplanet.model.Order;
import hu.plantplanet.model.OrderItem;
import hu.plantplanet.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // Convert OrderDto to Order
        Order order = new Order();
        order.setName(orderDto.getName());
        order.setEmail(orderDto.getEmail());
        order.setAddress(orderDto.getAddress());
        order.setCity(orderDto.getCity());
        order.setZipcode(orderDto.getZipcode());
        order.setPhoneNumber(orderDto.getPhoneNumber());
        order.setPaymentMethod(orderDto.getPaymentMethod());
        order.setTotalPrice(orderDto.getTotalPrice());
        order.setOrderDate(orderDto.getOrderDate() != null ? orderDto.getOrderDate() : java.time.LocalDateTime.now());

        // Convert OrderItemDto to OrderItem
        List<OrderItem> orderItems = orderDto.getOrderItems().stream()
                .map(itemDto -> {
                    OrderItem item = new OrderItem();
                    item.setPlantName(itemDto.getPlantName());
                    item.setAmount(itemDto.getAmount());
                    item.setPrice(itemDto.getPrice());
                    item.setOrder(order);
                    return item;
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);

        // Save the order first
        Order savedOrder = orderRepository.save(order);

        // Prepare and send confirmation email
        sendOrderConfirmationEmail(savedOrder);

        return savedOrder;
    }

    private void sendOrderConfirmationEmail(Order order) {
        // Format order date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDate = order.getOrderDate().format(formatter);

        // Build order details
        StringBuilder orderDetails = new StringBuilder();
        orderDetails.append("Order Date: ").append(formattedDate).append("\n");
        orderDetails.append("Total Amount: $").append(String.format("%.2f", order.getTotalPrice())).append("\n\n");
        orderDetails.append("Shipping Address:\n");
        orderDetails.append(order.getName()).append("\n");
        orderDetails.append(order.getAddress()).append("\n");
        orderDetails.append(order.getZipcode()).append(" ").append(order.getCity()).append("\n");
        orderDetails.append("Phone: ").append(order.getPhoneNumber()).append("\n\n");
        orderDetails.append("Payment Method: ").append(order.getPaymentMethod()).append("\n\n");
        orderDetails.append("Items Ordered:\n");

        order.getOrderItems().forEach(item -> {
            orderDetails.append("- ")
                    .append(item.getPlantName())
                    .append(" (Quantity: ").append(item.getAmount())
                    .append(", Price: $").append(String.format("%.2f", item.getPrice()))
                    .append(" each)\n");
        });

        // Send the email
        emailService.sendOrderConfirmation(
                order.getEmail(),
                order.getName(),
                orderDetails.toString()
        );
    }
}