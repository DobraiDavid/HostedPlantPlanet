package hu.plantplanet.controller;

import hu.plantplanet.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class emailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send")
    public String sendTestEmail(@RequestParam String to) {
        emailService.sendReminder(to, "Test Plant");
        return "Test email sent to " + to;
    }

}

