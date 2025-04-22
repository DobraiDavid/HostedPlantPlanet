package hu.plantplanet.controller;

import hu.plantplanet.auth.PermissionCollector;
import hu.plantplanet.dto.subsciption.SubscribeRequest;
import hu.plantplanet.model.SubscriptionPlan;
import hu.plantplanet.model.UserSubscription;
import hu.plantplanet.model.Users;
import hu.plantplanet.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name="Subscriptions")
@RequestMapping("/subscriptions")
public class subscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Operation(summary = "Get all subscription plans")
    @GetMapping("/plans")
    public List<SubscriptionPlan> getPlans() {
        return subscriptionService.getAllPlans();
    }

    @Operation(summary = "Subscribe a user")
    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(
            @RequestBody SubscribeRequest request,
            @AuthenticationPrincipal PermissionCollector permissionCollector) {

        Users user = permissionCollector.getUser();
        subscriptionService.createSubscription(user, request);
        return ResponseEntity.ok("Subscribed successfully!");
    }

    @Operation(summary = "Get user's subscriptions")
    @GetMapping("/my-subscriptions")
    public List<UserSubscription> getUserSubscriptions(@AuthenticationPrincipal PermissionCollector permissionCollector) {
        Users user = permissionCollector.getUser();
        return subscriptionService.getUserSubscriptions(user);
    }

    @Operation(summary = "Cancel subscription")
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<String> cancelSubscription(
            @PathVariable Long id,
            @AuthenticationPrincipal PermissionCollector permissionCollector) {
        Users user = permissionCollector.getUser();
        subscriptionService.cancelSubscription(user, id);
        return ResponseEntity.ok("Subscription cancelled");
    }

    @Operation(summary = "Get a subscription plan by ID")
    @GetMapping("/plans/{id}")
    public ResponseEntity<SubscriptionPlan> getPlanById(@PathVariable Long id) {
        SubscriptionPlan plan = subscriptionService.getPlanById(id);
        return ResponseEntity.ok(plan);
    }
}
