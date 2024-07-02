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
    /**
     * Please configure your OAuth client id here.
     */
    private static final String CLIENT_ID = "a113*****************************6e5e";
    /**
     * Please configure your OAuth client secret here.
     */
    private static final String CLIENT_SECRET = "=kSm9jIc****************************wvwJ";
    private final static ZuoraClient zuoraClient = new ZuoraClient(CLIENT_ID, CLIENT_SECRET, ZuoraClient.ZuoraEnv.SBX);


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
            String currency = (String) map.get("currency");
            String amount = (String) map.get("amount");

            final CreateAccountContact contact = new CreateAccountContact().firstName(firstName)
                    .lastName(lastName)
                    .country("US")
                    .state("CA");
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