package hu.plantplanet.service;

import hu.plantplanet.model.Cart;
import hu.plantplanet.model.Plants;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.CartRepository;
import hu.plantplanet.repository.PlantsRepository;
import hu.plantplanet.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PlantsRepository plantRepository;

    @Autowired
    private UsersRepository userRepository;

    // Add or update cart item
    public Cart addOrUpdateCartItem(Integer userId, Integer plantId, int amount, Integer cartItemId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Plants plant = plantRepository.findById(plantId).orElseThrow(() -> new RuntimeException("Plant not found"));

        Cart cartItem;

        if (cartItemId != null) {
            // If cartItemId is provided, update the existing item
            cartItem = cartRepository.findById(Long.valueOf(cartItemId)).orElseThrow(() -> new RuntimeException("Cart item not found"));
            // Check if the user and plant match the existing cart item
            if (!cartItem.getUser().getId().equals(userId) || !cartItem.getPlant().getId().equals(plantId)) {
                throw new RuntimeException("Cart item does not belong to the specified user and plant");
            }
            cartItem.setAmount(amount);
        } else {
            // If no cartItemId is provided, create a new cart item
            Optional<Cart> existingCartItem = cartRepository.findByUserIdAndPlantId(userId, plantId);
            if (existingCartItem.isPresent()) {
                // Update existing cart item if found
                cartItem = existingCartItem.get();
                cartItem.setAmount(cartItem.getAmount() + amount);
            } else {
                // Create a new cart item if it doesn't exist
                cartItem = new Cart();
                cartItem.setUser(user);
                cartItem.setPlant(plant);
                cartItem.setPrice(plant.getPrice());
                cartItem.setAmount(amount);
            }
        }

        return cartRepository.save(cartItem);
    }



    // Remove a cart item
    public void removeCartItem(Integer cartItemId) {
        Cart cartItem = cartRepository.findById(Long.valueOf(cartItemId))
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartRepository.delete(cartItem);
    }


    // View all cart items for a user
    public List<Cart> getCartItems(Integer userId) {
        return cartRepository.findByUserId(userId);
    }

    // Calculate the total price of the cart
    public BigDecimal calculateTotalPrice(Integer userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (Cart item : cartItems) {
            totalPrice = totalPrice.add(item.getPrice().multiply(BigDecimal.valueOf(item.getAmount())));
        }
        return totalPrice;
    }

    public void updateCartItem(Integer userId, Integer plantId, int amount) {
        Cart existingCartItem = cartRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        existingCartItem.setAmount(amount);
        cartRepository.save(existingCartItem);  // Save updated cart item
    }


}

