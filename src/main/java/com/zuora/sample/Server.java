package com.zuora.sample;

import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import com.zuora.ZuoraClient;
import com.zuora.api.ObjectQueriesApi;
import com.zuora.model.CreateAccountContact;
import com.zuora.model.CreateAccountRequest;
import com.zuora.model.CreateAccountResponse;
import com.zuora.model.ExpandedAccount;

import com.google.gson.Gson;

import java.nio.file.Paths;


public class Server {

    private static Gson gson = new Gson();
    private final static ZuoraClient zuoraClient = new ZuoraClient("952d3704-c3f0-4b35-b493-52a55d15195e", "BnaQsgugQRer46MriIncMfY6uN5X5aXs7S7RPvG/Z",
            ZuoraClient.ZuoraEnv.SBX);


    public static void main(String[] args) {
        port(8888);
        staticFiles.externalLocation(Paths.get("public").toAbsolutePath().toString());
        zuoraClient.initialize();
        zuoraClient.setDebugging(true);

        post("/get-billing-account", (request, response) -> {
            response.type("application/json");
            String accountName = request.attribute("name");
            ObjectQueriesApi objectQueriesApi = new ObjectQueriesApi();
            ExpandedAccount account = objectQueriesApi.queryAccountByKeyApi(accountName).execute();
            if (account != null) {
                return account.getId();
            } else {
                String firstName = request.attribute("firstName");
                String lastName = request.attribute("lastName");
                String country = request.attribute("country");
                String currency = request.attribute("currency");
                final CreateAccountContact contact = new CreateAccountContact().firstName(firstName)
                        .lastName(lastName)
                        .country(country);

                final CreateAccountRequest createAccountRequest = new CreateAccountRequest()
                        .name(String.join(" ", firstName, lastName))
                        .billToContact(contact)
//                    .paymentMethod(paymentMethod)
                        .billCycleDay(1)
                        .soldToSameAsBillTo(true) // alternatively, use .soldToContact(contact)
                        .autoPay(false)
                        .currency(currency);

                final CreateAccountResponse createAccountResponse = zuoraClient.accountsApi().createAccountApi(createAccountRequest).execute();
                return gson.toJson(createAccountResponse.getAccountId());
            }
        });
    }
}