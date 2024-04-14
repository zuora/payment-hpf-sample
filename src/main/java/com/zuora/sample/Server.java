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
import com.google.gson.JsonArray;

import java.nio.file.Paths;
import java.util.HashMap;
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

        post("/get-billing-account", (request, response) -> {
            response.type("application/json");
            Map map = gson.fromJson(request.body(), Map.class);
            String accountName = (String) map.get("name");
            if (accountName != null) {
                ObjectQueriesApi objectQueriesApi = zuoraClient.objectQueriesApi();
                ExpandedAccount account = objectQueriesApi.queryAccountByKeyApi(accountName).execute();
                if (account != null) {
                    return gson.toJson(account.getId());
                }
            }

            String firstName = (String) map.get("firstName");
            String lastName = (String) map.get("lastName");
            String country = (String) map.get("country");
            String currency = (String) map.get("currency");
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
            return gson.toJson(createAccountResponse.getAccountId());

        });
    }
}