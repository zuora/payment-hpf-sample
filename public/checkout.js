initialize();

async function initialize() {
  // Step 1 - Populate Zuora Object
  const zuora = Zuora("pk_rO0ABXeoAF6s7QAFd1gCAAVMT0NBTAACMTgAIDQwMjg4M2JlNzhlZWI2MzkwMTc4ZWY1MmFmMWQwMWE1ACA0MDI4MDY2ZDhmY2RmNDIxMDE4ZmQ2ZjAwYTlkMDBhOAAAAY_W8AqeAEYwRAIgd08O_W8q7wMk8x1l9UlkenpNcDr86FK-YlwTgfWCepUCIAtPPbUl1KncpQzTn2hJKXQNFdnQKft0rCZX9H9JknN0");

  // Step 2 - Get billing account
  const configuration = {
    locale: "en",
    region: "US",
    currency: "USD",
    createPaymentSession: () => {
      // generate payment session when end-customer click on the Pay button.
      return new Promise((resolve, reject) => {
        fetch("/create-payment-session", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: "Leo",
            lastName: "Demo",
            country: "US",
            currency: "USD",
            amount: 1599,
          })
        }).then((response) => {
          if (response.ok) {
            response.json()
                .then((paymentSessionToken) => {
                  resolve(paymentSessionToken);
                })
          }
        }).catch((error) => {
          console.error("Error occurred while creating payment session.")
          console.error(error);
        })
      });
    },
    onComplete: (result) => {
      console.log("==========");
      console.log("Payment Result");
      console.log("==========");
      console.log(`transaction result: ${JSON.stringify(result)}`);
      if (result.success) {
        window.location.replace('return.html?pid=' + result.paymentId);
      } else {
        window.alert("Payment fail: " + result.error?.message);
      }
    }
  };

  // Step 3 - Create and mount payment form
  zuora.createPaymentForm(configuration).then(function(form) {
    form.mount("#zuora-payment-form")
  }).catch(function(error) {
    console.error("Error occurred while creating payment form.")
    console.error(error);
  });

}