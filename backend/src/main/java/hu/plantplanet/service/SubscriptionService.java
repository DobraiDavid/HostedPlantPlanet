package hu.plantplanet.service;

import hu.plantplanet.dto.subsciption.SubscribeRequest;
import hu.plantplanet.model.Plants;
import hu.plantplanet.model.SubscriptionPlan;
import hu.plantplanet.model.UserSubscription;
import hu.plantplanet.model.Users;
import hu.plantplanet.repository.PlantsRepository;
import hu.plantplanet.repository.SubscriptionPlanRepository;
import hu.plantplanet.repository.UserSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final UserSubscriptionRepository userSubRepo;
    private final PlantsRepository plantRepo;
    private final EmailService emailService;
    private final SubscriptionPlanRepository subscriptionPlanRepo;

    // Runs daily at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void processSubscriptions() {
        List<UserSubscription> activeSubs = userSubRepo
                .findByNextTriggerDateBeforeAndStatus(
                        LocalDateTime.now(),
                        UserSubscription.SubscriptionStatus.ACTIVE
                );

        activeSubs.forEach(sub -> {
            if (sub.getPlan().getType() == SubscriptionPlan.SubscriptionType.RANDOM_PLANT) {
                Plants randomPlant = deliverRandomPlant(sub.getUser());
                emailService.sendPlantDeliveryEmail(
                        sub.getUser().getEmail(),
                        sub.getUser().getName(),
                        randomPlant
                );
            } else {
                emailService.sendCareTipsEmail(
                        sub.getUser().getEmail(),
                        sub.getUser().getName()
                );
            }

            sub.setNextTriggerDate(
                    LocalDateTime.now().plusDays(sub.getIntervalDays())
            );
            userSubRepo.save(sub);
        });
    }

    private Plants deliverRandomPlant(Users user) {
        List<Plants> allPlants = plantRepo.findAll();
        if (allPlants.isEmpty()) {
            throw new IllegalStateException("No plants available in database");
        }
        return allPlants.get(new Random().nextInt(allPlants.size()));
    }

    public List<SubscriptionPlan> getAllPlans() {
        return subscriptionPlanRepo.findAll();
    }
    public List<UserSubscription> getUserSubscriptions(Users user) {
        return userSubRepo.findByUser(user);
    }

    public void createSubscription(Users user, SubscribeRequest request) {
        SubscriptionPlan plan = subscriptionPlanRepo.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        // Validate interval for RANDOM_PLANT plans
        if (plan.getType() == SubscriptionPlan.SubscriptionType.RANDOM_PLANT && request.getIntervalDays() == null) {
            throw new IllegalArgumentException("Interval days is required for RANDOM_PLANT subscription");
        }

        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setStatus(UserSubscription.SubscriptionStatus.ACTIVE);

        if (plan.getType() == SubscriptionPlan.SubscriptionType.RANDOM_PLANT) {
            subscription.setIntervalDays(request.getIntervalDays());
            subscription.setNextTriggerDate(
                    LocalDateTime.now().plusDays(request.getIntervalDays())
            );
        }

        userSubRepo.save(subscription);
    }

    public void cancelSubscription(Users user, Long subscriptionId) {
        UserSubscription subscription = userSubRepo.findByIdAndUser(subscriptionId, user)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        subscription.setStatus(UserSubscription.SubscriptionStatus.CANCELLED);
        userSubRepo.save(subscription);
    }

    public SubscriptionPlan getPlanById(Long id) {
        return subscriptionPlanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));
    }
}