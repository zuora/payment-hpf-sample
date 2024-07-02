initialize();

async function initialize() {
  // Step 1 - Populate Zuora Object
  const publishableKey = "pk_rO0ABXezAGes7QAFd2ECAAthcGlfc2FuZGJveAAFMTIzNjgAIDExZTY0M2Y0YTNmMjAwYTBiMDYxMDAyNTkwNGM1N2Q2ACA4YWQwOWM5ZjhlODYxMTNmMDE4ZTg4MjhhNGY0N2JlZAAAAZBIx_0iAEgwRgIhAI_sx0PSnD0fYY6dZYgLC3VfL1OpK4sdr6rpWFmIdUaaAiEA1AMcot-oF3n-db9J9XQDONC9bqJ8lEMUp3E_xMSVhZA=";
  const zuora = Zuora(publishableKey);

  // Step 2 - Populate HPF configuration
  const configuration = {
    locale: "en",
    region: "US",
    currency: "USD",
    amount: "1599.00",
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
            currency: "USD",
            amount: "1599.00",
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
        window.location.href = 'return.html?pid=' + result.paymentId
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