const params = new URLSearchParams(window.location.search);
const orderId = params.get("order_id");

document.getElementById("orderId").innerText = orderId;

fetch(`http://localhost:8000/api/v1/public/orders/${orderId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("amount").innerText = data.amount / 100;
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
  document.getElementById("status").innerText = "Processing...";

  fetch("http://localhost:8000/api/v1/public/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("status").innerText =
        data.status === "success"
          ? "✅ Payment Successful"
          : "❌ Payment Failed";
    });
}
