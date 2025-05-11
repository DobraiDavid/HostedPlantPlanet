package hu.plantplanet.controller;

import hu.plantplanet.dto.order.OrderDTO;
import hu.plantplanet.model.Order;
import hu.plantplanet.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@Tag(name="Orders")
public class orderController {
    private final OrderService orderService;

    public orderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderDTO orderDto) {
        Order savedOrder = orderService.placeOrder(orderDto);
        return ResponseEntity.ok(savedOrder);
    }
}