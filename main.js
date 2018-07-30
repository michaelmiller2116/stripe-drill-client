const publicStripeKey = "pk_test_3cyEFT9tQLPqRl38kdaNt4HE";
const purchaseData = {
  amount: 0
}

var handler = StripeCheckout.configure({
  key: publicStripeKey,
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function (token) {
    // You can access the token ID with `token.id`. Get the token ID to your
    // server-side code for use
    const paymentObj = {
      stripeToken: token.id,
      amount: purchaseData.amount
    }
    fetch('http://localhost:5000/payment', {
      method: "POST",
      body: JSON.stringify(paymentObj),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.failure_code) {
          displayNewError(new Error("there was a problem processing your payment"))
        } else {
          const message = `Your card was charged $${res.amount / 100}`
          const statusElement = document.querySelector("#payment-status")
          statusElement.innerHTML = message
        }
      })
      .catch(displayNewError)
  }
})

document
  .querySelector('#payment-form')
  .addEventListener('submit', function (e) {
    // Open Checkout with further options:
    e.preventDefault()
    const form = new FormData(e.target)
    const pennies = Number(form.get('amount'))
    const amount = pennies * 100
    purchaseData.amount = amount
    if (amount) {
      handler.open({ name: 'Demo Site', description: '2 widgets', amount: amount })
    }
  })

// Close Checkout on page navigation:
window.addEventListener('popstate', function () {
  handler.close()
})

function displayNewError(err) {
  const message = `error processing your card ${err.message}`
  const statusElement = document.querySelector("#payment-status")
  statusElement.innerHTML = message

}