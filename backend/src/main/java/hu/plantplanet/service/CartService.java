package hu.plantplanet.service;

import hu.plantplanet.model.Cart;
import hu.plantplanet.model.Plants;
import hu.plantplanet.model.SubscriptionPlan;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.CartRepository;
import hu.plantplanet.repository.PlantsRepository;
import hu.plantplanet.repository.SubscriptionPlanRepository;
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

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    // Add or update cart item
    public Cart addOrUpdateCartItem(Integer userId, Integer itemId, int amount, Integer cartItemId, boolean isSubscription) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Cart cartItem;

        // Handle based on item type (plant or subscription)
        if (isSubscription) {
            // Get subscription plan instead of plant
            SubscriptionPlan plan = subscriptionPlanRepository.findById(Long.valueOf(itemId))
                    .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

            if (cartItemId != null) {
                // Update existing cart item
                cartItem = cartRepository.findById(Long.valueOf(cartItemId))
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

                // Verify ownership
                if (!cartItem.getUser().getId().equals(userId)) {
                    throw new RuntimeException("Cart item does not belong to the specified user");
                }
                cartItem.setAmount(amount);
            } else {
                // Check for existing subscription in cart
                Optional<Cart> existingCartItem = cartRepository.findByUserIdAndSubscriptionPlanId(userId, itemId);

                if (existingCartItem.isPresent()) {
                    cartItem = existingCartItem.get();
                    cartItem.setAmount(cartItem.getAmount() + amount);
                } else {
                    // Create new subscription item in cart
                    cartItem = new Cart();
                    cartItem.setUser(user);
                    cartItem.setSubscriptionPlan(plan);
                    cartItem.setPlant(null); // No plant associated
                    cartItem.setPrice(plan.getPrice());
                    cartItem.setAmount(amount);
                    cartItem.setSubscription(true);
                }
            }
        } else {
            // Original plant-handling logic
            Plants plant = plantRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Plant not found"));

            if (cartItemId != null) {
                cartItem = cartRepository.findById(Long.valueOf(cartItemId))
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

                if (!cartItem.getUser().getId().equals(userId) || !cartItem.getPlant().getId().equals(itemId)) {
                    throw new RuntimeException("Cart item does not belong to the specified user and plant");
                }
                cartItem.setAmount(amount);
            } else {
                Optional<Cart> existingCartItem = cartRepository.findByUserIdAndPlantId(userId, itemId);

                if (existingCartItem.isPresent()) {
                    cartItem = existingCartItem.get();
                    cartItem.setAmount(cartItem.getAmount() + amount);
                } else {
                    cartItem = new Cart();
                    cartItem.setUser(user);
                    cartItem.setPlant(plant);
                    cartItem.setSubscriptionPlan(null); // No subscription associated
                    cartItem.setPrice(plant.getPrice());
                    cartItem.setAmount(amount);
                    cartItem.setSubscription(false);
                }
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

