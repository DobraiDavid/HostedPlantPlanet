package hu.plantplanet.service;

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
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

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
}
