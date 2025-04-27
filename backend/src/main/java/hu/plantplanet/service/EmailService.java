package hu.plantplanet.service;

import hu.plantplanet.model.Plants;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReminder(String to, String plantName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Time to repot your plant!");
        message.setText("Hey! It's time to repot your " + plantName + ".");
        mailSender.send(message);
    }

    public void sendOrderConfirmation(String to, String customerName, String orderDetails) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Thank you for your order!");

            String htmlContent = "<html><body>" +
                    "<h2>Dear " + customerName + ",</h2>" +
                    "<p>Thank you for your order at PlantPlanet!</p>" +
                    "<h3>Order Details:</h3>" +
                    "<pre>" + orderDetails + "</pre>" +
                    "<p>We'll process your order shortly.</p>" +
                    "<p>Best regards,<br/>The PlantPlanet Team</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            // Handle exception or log it
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendPlantDeliveryEmail(String to, String username, Plants plant) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Your Mystery Plant Delivery!");

            String htmlContent = "<html><body>" +
                    "<h2>Hello " + username + ",</h2>" +
                    "<p>Your mystery plant has been selected!</p>" +
                    "<div style='border: 1px solid #ddd; padding: 15px; margin: 10px 0;'>" +
                    "<h3>" + plant.getName() + "</h3>" +
                    "<p><strong>Care Instructions are included in your package</strong> " + "</p>" +
                    "</div>" +
                    "<p>We hope you enjoy your new green friend!</p>" +
                    "<p>Best regards,<br/>The PlantPlanet Team</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send plant delivery email", e);
        }
    }

    public void sendCareTipsEmail(String to, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Your Monthly Plant Care Tips");

            String htmlContent = "<html><body>" +
                    "<h2>Hello " + username + ",</h2>" +
                    "<p>Here are your monthly plant care tips:</p>" +
                    "<ul>" +
                    "<li>Check soil moisture regularly</li>" +
                    "<li>Rotate plants for even growth</li>" +
                    "<li>Wipe leaves to remove dust</li>" +
                    "<li>Check for pests</li>" +
                    "</ul>" +
                    "<p>Happy planting!</p>" +
                    "<p>Best regards,<br/>The PlantPlanet Team</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send care tips email", e);
        }
    }
}
