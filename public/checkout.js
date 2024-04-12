// This is your test publishable API key.
const stripe = Stripe("pk_test_51IBQb4GT0RtLbTJ2kgpQKWjEfza6HcI03siPN4x28vGPKrGTvQtRvwJRtVlROBUzT2h8KwJtf0SfOHrCe4q2RR5200m43B3Mgq");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}