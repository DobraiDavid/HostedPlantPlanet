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

    // Add or update an item in the cart
    @PostMapping("/add")
    public ResponseEntity<String> addOrUpdateCartItem(@RequestParam Integer userId, @RequestParam Integer plantId, @RequestParam int amount, @RequestParam(required = false) Integer cartItemId) {
        cartService.addOrUpdateCartItem(userId, plantId, amount, cartItemId);
        return ResponseEntity.ok("Item added/updated in the cart");
    }

    // Remove an item from the cart by cart item ID
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeCartItem(@PathVariable Integer cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok("Item removed from the cart");
    }

    // Get all cart items for a user
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/view")
    public ResponseEntity<List<Cart>> getCartItems(@RequestParam Integer userId) {
        List<Cart> cartItems = cartService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }

    // Get the total price of the user's cart
    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalPrice(@RequestParam Integer userId) {
        BigDecimal totalPrice = cartService.calculateTotalPrice(userId);
        return ResponseEntity.ok(totalPrice);
    }
}

