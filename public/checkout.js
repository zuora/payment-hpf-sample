initialize();

async function initialize() {
  // Step 1 - Populate Zuora Object
  const zuora = Zuora("pk_rO0ABXc2AAUxMjM2OAAgOGFkMDljOWY4ZTg2MTEzZjAxOGU4ODI4YTRmNDdiZWQAC1tCQDFhMzY4Njhi");

  // Step 2 - Get billing account
  const accountId = async  () => {
    const response = await fetch("/get-billing-account", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: "A03469583"})
    });
    if (!response.ok) {
      window.alert(`HTTP error! Status: ${response.status} Message: ${response.body}`);
    }
    return await response.json();
  };

  // Step 2 - Populate HPF configuration and create unapplied payment
  const configuration = {
    environment: 'api_sandbox',
    paymentRequest: {
      accountId: null,
      country: "US",
      currency: 'USD',
      totalPriceLabel: "TestShop",
      amount: 100
    },
    onSuccess: function (response) {
      console.info('paymentMethodId: ' + response.paymentMethodId);
      console.info('paymentId: ' + response.paymentId);
      window.location.replace('return.html?pid=' + response.paymentId);
    },
    onError: function (response) {
      console.error('code: ' + response.code);
      console.error('message: ' + response.message);
      if (response.message && !response.message.contains("The device does not support processing payments with Apple Pay")) {
        window.alert("Payment fail: " + response.message);
      }
    }
  };
  accountId().then(result => {
    configuration.paymentRequest.accountId = result;
    // Step 3 - Create HPF Component and mount it
    zuora.create('HostedPaymentForm', configuration).mount("#payment-request-button");
  })
}