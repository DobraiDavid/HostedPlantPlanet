package hu.plantplanet.service;

import hu.plantplanet.dto.order.OrderDTO;
import hu.plantplanet.dto.order.OrderItemDTO;
import hu.plantplanet.model.Order;
import hu.plantplanet.model.OrderItem;
import hu.plantplanet.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order placeOrder(OrderDTO orderDto) {
        // Convert OrderDto to Order
        Order order = new Order();
        order.setName(orderDto.getName());
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

        return orderRepository.save(order);
    }
}