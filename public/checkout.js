/**
 * MIT License
 *
 * Copyright (c) [2024] Zuora, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

initialize();

async function initialize() {
  // Step 1 - Populate Zuora Object
  const publishableKey = "pk_rO0ABXeoAF6s7QAFd1gCAAVMT0NBTAACMTgAIDQwMjg4M2JlNzhlZWI2MzkwMTc4ZWY1MmFmMWQwMWE1ACA0MDI4MDY2ZDhmY2RmNDIxMDE4ZmQ2ZjAwYTlkMDBhOAAAAY_W8AqeAEYwRAIgd08O_W8q7wMk8x1l9UlkenpNcDr86FK-YlwTgfWCepUCIAtPPbUl1KncpQzTn2hJKXQNFdnQKft0rCZX9H9JknN0";
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