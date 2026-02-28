import React, { useState } from "react";
const API_BASE = process.env.REACT_APP_API_URL || "https://deluxe-booking-ticket-4-dmst.onrender.com";

function Payment({ bookingId, amount, ticketNumber }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type") || "Bearer";

  const handlePay = () => {
    if (!phone) {
      setMessage("Please enter your phone number");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    fetch(`${API_BASE}/api/pay/${bookingId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      },
      body: JSON.stringify({
        phone_number: phone
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Payment response:", data);
        if (data.status === "SUCCESS") {
          setMessage("Payment Successful! You can now download your ticket.");
          setMessageType("success");
          setPaymentStatus("SUCCESS");
        } else {
          setMessage(data.message || "Payment Failed. Please try again.");
          setMessageType("error");
          setPaymentStatus("FAILED");
        }
      })
      .catch(error => {
        console.error("Payment error:", error);
        setMessage("Network error. Please make sure the backend is running.");
        setMessageType("error");
        setPaymentStatus("FAILED");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownloadPDF = () => {
    // Open PDF in new tab
    window.open(`${API_BASE}/api/ticket/pdf/${ticketNumber}/`, '_blank');
  };

  // Success view - shows after successful payment
  if (paymentStatus === "SUCCESS") {
    return (
      <div style={{ 
        border: "2px solid #4CAF50", 
        borderRadius: "10px", 
        padding: "30px", 
        marginTop: "20px", 
        backgroundColor: "#e8f5e9", 
        textAlign: "center" 
      }}>
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
        <h3 style={{ color: "#2e7d32", marginBottom: "15px" }}>Payment Successful!</h3>
        
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ margin: "5px 0" }}><strong>Ticket Number:</strong></p>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1565C0", margin: "10px 0" }}>
            {ticketNumber}
          </div>
          <p style={{ margin: "5px 0" }}><strong>Amount Paid:</strong> {amount} TZS</p>
          <p style={{ margin: "5px 0" }}><strong>Booking ID:</strong> {bookingId}</p>
        </div>

        <button 
          onClick={handleDownloadPDF}
          style={{ 
            padding: "15px 30px", 
            fontSize: "18px", 
            backgroundColor: "#2196F3", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          📥 Download Ticket as PDF
        </button>
        
        <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
          Please present this ticket when boarding the train.
        </p>
        
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            padding: "10px 20px", 
            fontSize: "14px", 
            backgroundColor: "#757575", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Book Another Ticket
        </button>
      </div>
    );
  }

  // Payment form
  return (
    <div style={{ 
      border: "2px solid #FF9800", 
      borderRadius: "10px", 
      padding: "30px", 
      marginTop: "20px", 
      backgroundColor: "#fff3e0" 
    }}>
      <h3 style={{ color: "#e65100", marginTop: "0" }}>💳 Complete Payment</h3>
      
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <p style={{ margin: "5px 0" }}><strong>Amount to Pay:</strong> <span style={{ fontSize: "24px", color: "#2e7d32" }}>{amount} TZS</span></p>
        <p style={{ margin: "5px 0" }}><strong>Ticket Number:</strong> {ticketNumber}</p>
      </div>

      {message && (
        <div style={{
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "5px",
          backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
          color: messageType === "success" ? "#155724" : "#721c24",
          border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Enter your phone number for payment:
        </label>
        <input
          type="text"
          placeholder="e.g., 255712345678"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "12px", 
            fontSize: "16px", 
            borderRadius: "5px", 
            border: "1px solid #ccc",
            boxSizing: "border-box"
          }}
        />
      </div>

      <button 
        onClick={handlePay}
        disabled={loading}
        style={{ 
          width: "100%",
          padding: "15px", 
          fontSize: "18px", 
          backgroundColor: loading ? "#95a5a6" : "#4CAF50", 
          color: "white", 
          border: "none", 
          borderRadius: "8px", 
          cursor: loading ? "not-allowed" : "pointer" 
        }}
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "15px", textAlign: "center" }}>
        Payment is simulated. Click "Pay Now" to complete the booking.
      </p>
    </div>
  );
}

export default Payment;
