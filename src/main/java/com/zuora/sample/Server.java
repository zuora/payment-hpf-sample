package com.zuora.sample;

import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import com.zuora.ZuoraClient;
import com.zuora.api.ObjectQueriesApi;
import com.zuora.model.*;

import com.google.gson.Gson;

import java.math.BigDecimal;
import java.nio.file.Paths;
import java.util.Map;


public class Server {

    private static Gson gson = new Gson();
    private final static ZuoraClient zuoraClient = new ZuoraClient("a113e78c-949b-4351-af45-6eed84da6e5e", "=kSm9jIclJNQ/+oXCeebxO3BHGQL1K1KkeoqwvwJ",
            ZuoraClient.ZuoraEnv.SBX);


    public static void main(String[] args) {
        port(8888);
        staticFiles.externalLocation(Paths.get("public").toAbsolutePath().toString());
        zuoraClient.initialize();
        zuoraClient.setDebugging(true);

        post("create-payment-session", (request, response) -> {
            response.type("application/json");
            Map map = gson.fromJson(request.body(), Map.class);
            String firstName = (String) map.get("firstName");
            String lastName = (String) map.get("lastName");
            String country = (String) map.get("country");
            String currency = (String) map.get("currency");
            Integer amount = (Integer) map.get("amount");

            final CreateAccountContact contact = new CreateAccountContact().firstName(firstName)
                    .lastName(lastName)
                    .country(country);
            final CreateAccountRequest createAccountRequest = new CreateAccountRequest()
                    .name(String.join(" ", firstName, lastName))
                    .billToContact(contact)
                    .billCycleDay(1)
                    .soldToSameAsBillTo(true) // alternatively, use .soldToContact(contact)
                    .autoPay(false)
                    .currency(currency);
            final CreateAccountResponse createAccountResponse = zuoraClient.accountsApi().createAccountApi(createAccountRequest).execute();

            final CreatePaymentSessionRequest createPaymentSessionRequest = new CreatePaymentSessionRequest()
                    .currency(currency)
                    .amount(new BigDecimal(amount))
                    .processPayment(true)
                    .accountId(createAccountResponse.getAccountId());
            final CreatePaymentSessionResponse createPaymentSessionResponse = zuoraClient.paymentMethodsApi().createPaymentSessionApi(createPaymentSessionRequest).execute();

            return gson.toJson(createPaymentSessionResponse.getToken());
        });
    }
}