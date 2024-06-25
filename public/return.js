initialize();

async function initialize() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paymentId = urlParams.get('pid');

  if (paymentId) {
    document.getElementById('success').classList.remove('hidden');
    document.getElementById('payment-id').textContent = paymentId;
  }
}