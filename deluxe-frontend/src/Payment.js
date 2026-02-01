
import React, { useState } from "react";

function Payment({ bookingId, amount }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handlePay = () => {
    fetch(`http://127.0.0.1:8000/api/pay/${bookingId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({
        phone_number: phone
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "SUCCESS") {
          setMessage("✅ Payment Successful!");
        } else {
          setMessage("❌ Payment Failed");
        }
      });
  };

  return (
    <div>
      <h3>Payment</h3>
      <p>Amount: {amount} TZS</p>

      <input
        type="text"
        placeholder="Enter phone number"
        onChange={e => setPhone(e.target.value)}
      />

      <br /><br />

      <button onClick={handlePay}>Pay Now</button>

      <p>{message}</p>
    </div>
  );
}

export default Payment;
