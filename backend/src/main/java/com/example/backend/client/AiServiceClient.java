package com.example.backend.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class AiServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String BASE_URL = "http://127.0.0.1:5000";

    // ---------- DESCRIBE ----------
    public String describe(String text) {
        try {
            String url = BASE_URL + "/describe";

            Map<String, String> request = new HashMap<>();
            request.put("text", text);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            return (String) response.getBody().get("response");

        } catch (Exception e) {
            return "Error calling AI service";
        }
    }

    // ---------- RECOMMEND ----------
    public String recommend(String text) {
        try {
            String url = BASE_URL + "/recommend";

            Map<String, String> request = new HashMap<>();
            request.put("text", text);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            return (String) response.getBody().get("response");

        } catch (Exception e) {
            return "Error calling AI service";
        }
    }
}