package hu.plantplanet.controller;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.*;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/chat")
@Tag(name="Support Bot")
public class dialogFlowController {

    private final SessionsClient sessionsClient;
    private final SessionName session;

    @Value("${dialogflow.project-id}")
    private String projectId;

    @Value("${dialogflow.credentials.path}")
    private Resource credentialsPath;

    public dialogFlowController(@Value("${dialogflow.project-id}") String projectId,
                                @Value("${dialogflow.credentials.path}") Resource credentialsPath) throws IOException {
        this.projectId = projectId;
        this.credentialsPath = credentialsPath;

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(credentialsPath.getInputStream());

        SessionsSettings sessionsSettings = SessionsSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        this.sessionsClient = SessionsClient.create(sessionsSettings);
        this.session = SessionName.of(projectId, UUID.randomUUID().toString());
    }

    @PostMapping
    public String sendMessage(@RequestBody String userMessage) throws Exception {
        TextInput textInput = TextInput.newBuilder()
                .setText(userMessage)
                .setLanguageCode("en")
                .build();

        QueryInput queryInput = QueryInput.newBuilder()
                .setText(textInput)
                .build();

        DetectIntentRequest request = DetectIntentRequest.newBuilder()
                .setSession(session.toString())
                .setQueryInput(queryInput)
                .build();

        DetectIntentResponse response = sessionsClient.detectIntent(request);
        return response.getQueryResult().getFulfillmentText();
    }

    @PreDestroy
    public void cleanUp() {
        if (sessionsClient != null) {
            sessionsClient.close();
        }
    }
}