const params = new URLSearchParams(window.location.search);
const orderId = params.get("order_id");

document.getElementById("orderId").innerText = orderId;

// Load order details
fetch(`http://localhost:8000/api/v1/public/orders/${orderId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("amount").innerText = data.amount / 100;
  })
  .catch(err => {
    console.error("Order fetch error:", err);
  });

function showUPI() {
  document.getElementById("upiForm").classList.remove("hidden");
  document.getElementById("cardForm").classList.add("hidden");
}

function showCard() {
  document.getElementById("cardForm").classList.remove("hidden");
  document.getElementById("upiForm").classList.add("hidden");
}

function payUPI() {
  const vpa = document.getElementById("vpa").value;

  processPayment({
    order_id: orderId,
    method: "upi",
    vpa
  });
}

function payCard() {
  processPayment({
    order_id: orderId,
    method: "card",
    card: {
      number: document.getElementById("cardNumber").value,
      expiry_month: document.getElementById("expMonth").value,
      expiry_year: document.getElementById("expYear").value,
      cvv: document.getElementById("cvv").value,
      holder_name: document.getElementById("name").value
    }
  });
}

function processPayment(body) {
  const statusEl = document.getElementById("status");
  statusEl.innerText = "Processing...";

  fetch("http://localhost:8000/api/v1/public/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("API failed with status " + res.status);
      }
      return res.json();
    })
    .then(data => {
      console.log("Payment response:", data);

      if (data.status === "success") {
        statusEl.innerText = "✅ Payment Successful";
      } else {
        statusEl.innerText = "❌ Payment Failed";
      }
    })
    .catch(err => {
      console.error("Payment error:", err);
      statusEl.innerText = "❌ Payment Failed (Error)";
    });
}