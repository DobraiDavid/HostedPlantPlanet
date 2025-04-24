package hu.plantplanet.service;

import hu.plantplanet.model.Order;
import hu.plantplanet.model.OrderItem;
import hu.plantplanet.model.Plants;
import hu.plantplanet.model.Repot;
import hu.plantplanet.repository.RepotRepository;
import hu.plantplanet.repository.OrderItemRepository;
import hu.plantplanet.repository.PlantsRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RepotService {

    @Autowired
    private RepotRepository RepotRepository;

    @Autowired
    private OrderItemRepository orderItemsRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Run every hour to check for reminders
    @Scheduled(cron = "0 0 * * * ?")
    public void checkAndSendRepots() {
        LocalDateTime now = LocalDateTime.now();
        List<Repot> reminders = RepotRepository.findBySentFalseAndRemindAtBefore(now);

        for (Repot reminder : reminders) {
            sendReminderEmail(reminder);
            reminder.setSent(true);
            RepotRepository.save(reminder);
        }
    }

    public void createRemindersForOrder(Order order) {
        List<OrderItem> items = orderItemsRepository.findByOrder_OrderId(order.getOrderId());

        for (OrderItem item : items) {
            Plants plant = item.getPlant(); // Use the Plant object from OrderItem
            if (plant != null && plant.getRePotting() != null) {
                LocalDateTime remindAt = calculateRemindDate(
                        order.getOrderDate(),
                        plant.getRePotting()
                );

                Repot reminder = new Repot();
                reminder.setOrderItemId(item.getId()); // Updated field name
                reminder.setEmail(order.getEmail());
                reminder.setPlantName(plant.getName()); // Get name from Plant object
                reminder.setRemindAt(remindAt);
                reminder.setSent(false);

                RepotRepository.save(reminder);
            }
        }
    }


    private LocalDateTime calculateRemindDate(LocalDateTime orderDate, String repotPeriod) {
        if (repotPeriod.contains("Year")) {
            int years = Integer.parseInt(repotPeriod.split(" ")[0]);
            return orderDate.plus(years, ChronoUnit.YEARS);
        } else if (repotPeriod.contains("Month")) {
            int months = Integer.parseInt(repotPeriod.split(" ")[0]);
            return orderDate.plus(months, ChronoUnit.MONTHS);
        }
        // Default to 1 year if format is unrecognized
        return orderDate.plusYears(1);
    }

    private void sendReminderEmail(Repot reminder) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(reminder.getEmail());
        message.setSubject("Time to repot your " + reminder.getPlantName());
        message.setText(String.format(
                "Hello,\n\n" +
                        "It's time to repot your %s that you purchased from us.\n\n" +
                        "Happy gardening!\n" +
                        "Your Plant Store Team",
                reminder.getPlantName()
        ));

        mailSender.send(message);
    }
}
