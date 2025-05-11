package hu.plantplanet.controller;

import hu.plantplanet.model.Cart;
import hu.plantplanet.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cart")
@Tag(name="Cart")
public class cartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addOrUpdateCartItem(
            @RequestParam Integer userId,
            @RequestParam Integer itemId,
            @RequestParam int amount,
            @RequestParam(required = false) Integer cartItemId,
            @RequestParam(required = false, defaultValue = "false") boolean isSubscription,
            @RequestParam(required = false) Integer potId) {

        cartService.addOrUpdateCartItem(userId, itemId, amount, cartItemId, isSubscription, potId);
        return ResponseEntity.ok("Item added/updated in the cart");
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeCartItem(@PathVariable Integer cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok("Item removed from the cart");
    }

    @GetMapping("/view")
    public ResponseEntity<List<Cart>> getCartItems(@RequestParam Integer userId) {
        List<Cart> cartItems = cartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalPrice(@RequestParam Integer userId) {
        BigDecimal totalPrice = cartService.calculateTotalPrice(userId);
        return ResponseEntity.ok(totalPrice);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCartItem(
            @RequestParam Integer userId,
            @RequestParam Integer plantId,
            @RequestParam int amount) {
        try {
            cartService.updateCartItem(userId, plantId, amount);
            return ResponseEntity.ok("Cart item updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error updating cart item: " + e.getMessage());
        }
    }
}