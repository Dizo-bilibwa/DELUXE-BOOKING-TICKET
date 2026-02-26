import React, { useEffect, useState } from "react";
import Payment from "./Payment";

function Booking() {
  const [travelDates, setTravelDates] = useState([]);
  const [ticketClasses, setTicketClasses] = useState([]);
  const [travelDate, setTravelDate] = useState("");
  const [ticketClass, setTicketClass] = useState("");
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch travel dates
  useEffect(() => {
    fetch("/api/travel-dates/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch travel dates");
        return res.json();
      })
      .then(data => setTravelDates(data))
      .catch(error => {
        console.error("Error fetching travel dates:", error);
        setMessage("Error loading travel dates. Please refresh the page.");
        setMessageType("error");
      });
  }, []);

  // Fetch ticket classes
  useEffect(() => {
    fetch("/api/ticket-classes/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch ticket classes");
        return res.json();
      })
      .then(data => setTicketClasses(data))
      .catch(error => {
        console.error("Error fetching ticket classes:", error);
        setMessage("Error loading ticket classes. Please refresh the page.");
        setMessageType("error");
      });
  }, []);

  // Submit booking
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!travelDate || !ticketClass) {
      setMessage("Please select both travel date and ticket class");
      setMessageType("error");
      setLoading(false);
      return;
    }

    fetch("/api/book/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        travel_date: travelDate,
        ticket_class: ticketClass,
        seats: parseInt(seats)
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Booking response:", data);
        
        if (data.ticket_number) {
          setBookingData({
            ticketNumber: data.ticket_number,
            bookingId: data.booking_id,
            totalAmount: data.total_amount
          });
          setMessage(`Booking Created! Ticket No: ${data.ticket_number}. Please proceed to payment.`);
          setMessageType("success");
        } else {
          // Handle error messages from backend
          let errorMsg = "Booking failed. Please check your inputs.";
          if (data.detail) {
            errorMsg = data.detail;
          } else if (data.travel_date) {
            errorMsg = Array.isArray(data.travel_date) ? data.travel_date[0] : data.travel_date;
          } else if (data.ticket_class) {
            errorMsg = Array.isArray(data.ticket_class) ? data.ticket_class[0] : data.ticket_class;
          }
          setMessage(errorMsg);
          setMessageType("error");
        }
      })
      .catch(error => {
        console.error("Booking error:", error);
        setMessage("Network error. Please make sure the backend is running.");
        setMessageType("error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Protect page
  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h3>Please login to book a ticket</h3>
        <a href="/login" style={{ color: "#3498db" }}>Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50" }}>Book Your Ticket</h2>

      {/* Show error/success message */}
      {message && (
        <div style={{
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "5px",
          backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
          color: messageType === "success" ? "#155724" : "#721c24",
          border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Travel Date</label>
          <select 
            onChange={e => setTravelDate(e.target.value)} 
            required
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="">Select Travel Date</option>
            {travelDates.map(td => (
              <option key={td.id} value={td.id}>
                {td.train} - {td.travel_date}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Ticket Class</label>
          <select 
            onChange={e => setTicketClass(e.target.value)} 
            required
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="">Select Class</option>
            {ticketClasses.map(tc => (
              <option key={tc.id} value={tc.id}>
                {tc.name} - {tc.price} TZS
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Number of Seats</label>
          <input
            type="number"
            min="1"
            max="10"
            value={seats}
            onChange={e => setSeats(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "15px", 
            fontSize: "18px", 
            backgroundColor: loading ? "#95a5a6" : "#3498db", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </form>

      {/* Payment Section - Shows after successful booking */}
      {bookingData && (
        <div style={{ marginTop: "30px" }}>
          <Payment 
            bookingId={bookingData.bookingId} 
            amount={bookingData.totalAmount}
            ticketNumber={bookingData.ticketNumber} 
          />
        </div>
      )}
    </div>
  );
}

export default Booking;
