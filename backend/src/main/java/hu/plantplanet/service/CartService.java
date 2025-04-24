package hu.plantplanet.service;

import hu.plantplanet.model.*;
import hu.plantplanet.repository.*;
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

    @Autowired
    private PotRepository potRepository;

    // Add or update cart item
    public void addOrUpdateCartItem(Integer userId, Integer itemId, int amount,
                                    Integer cartItemId, boolean isSubscription, Integer potId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cartItem;
        Pots pot = potId != null ?
                potRepository.findById(potId)
                        .orElseThrow(() -> new RuntimeException("Pot not found")) :
                potRepository.findById(1)
                        .orElseThrow(() -> new RuntimeException("Default pot with id 1 not found"));

        if (isSubscription) {
            SubscriptionPlan plan = subscriptionPlanRepository.findById(Long.valueOf(itemId))
                    .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

            if (cartItemId != null) {
                cartItem = cartRepository.findById(Long.valueOf(cartItemId))
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

                if (!cartItem.getUser().getId().equals(userId)) {
                    throw new RuntimeException("Cart item does not belong to the specified user");
                }
                cartItem.setAmount(amount);
                cartItem.setPot(null);
            } else {
                Optional<Cart> existingCartItem = cartRepository.findByUserIdAndSubscriptionPlanId(userId, Long.valueOf(itemId));

                if (existingCartItem.isPresent()) {
                    cartItem = existingCartItem.get();
                    cartItem.setAmount(cartItem.getAmount() + amount);
                } else {
                    cartItem = new Cart();
                    cartItem.setUser(user);
                    cartItem.setSubscriptionPlan(plan);
                    cartItem.setPlant(null);
                    cartItem.setPot(null);
                    cartItem.setPrice(plan.getPrice());
                    cartItem.setAmount(amount);
                    cartItem.setSubscription(true);
                }
            }
        } else {
            Plants plant = plantRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Plant not found"));

            if (cartItemId != null) {
                cartItem = cartRepository.findById(Long.valueOf(cartItemId))
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

                if (!cartItem.getUser().getId().equals(userId) || !cartItem.getPlant().getId().equals(itemId)) {
                    throw new RuntimeException("Cart item does not belong to the specified user and plant");
                }
                cartItem.setAmount(amount);
                cartItem.setPot(pot);
            } else {
                // Find existing cart items for this user and plant
                List<Cart> existingCartItems = cartRepository.findByUserIdAndPlantId(userId, itemId);

                // Try to find an exact match (same plant and pot)
                Optional<Cart> exactMatch = existingCartItems.stream()
                        .filter(item -> {
                            if (pot == null) return item.getPot() == null;
                            return item.getPot() != null && item.getPot().getId().equals(pot.getId());
                        })
                        .findFirst();

                if (exactMatch.isPresent()) {
                    // Update existing item with same plant and pot
                    cartItem = exactMatch.get();
                    cartItem.setAmount(cartItem.getAmount() + amount);
                } else {
                    // Create new entry
                    cartItem = new Cart();
                    cartItem.setUser(user);
                    cartItem.setPlant(plant);
                    cartItem.setSubscriptionPlan(null);
                    cartItem.setPot(pot);
                    BigDecimal totalPrice = plant.getPrice();
                    if (pot != null) {
                        totalPrice = totalPrice.add(pot.getPrice());
                    }
                    cartItem.setPrice(totalPrice);
                    cartItem.setAmount(amount);
                    cartItem.setSubscription(false);
                }
            }
        }

        cartRepository.save(cartItem);
    }

    // Remove a cart item
    public void removeCartItem(Integer cartItemId) {
        Cart cartItem = cartRepository.findById(Long.valueOf(cartItemId))
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartRepository.delete(cartItem);
    }

    // View all cart items for a user
    public List<Cart> getCartItems(Integer userId) {
        return cartRepository.findByUserIdWithDetails(userId);
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
        cartRepository.save(existingCartItem);
    }
}