import React, { useEffect, useState } from "react";
import Payment from "./Payment";


function Booking() {
  const [travelDates, setTravelDates] = useState([]);
  const [ticketClasses, setTicketClasses] = useState([]);
  const [travelDate, setTravelDate] = useState("");
  const [ticketClass, setTicketClass] = useState("");
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");


  const token = localStorage.getItem("token");

  // 🔹 Fetch travel dates
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/travel-dates/")
      .then(res => res.json())
      .then(data => setTravelDates(data));
  }, []);

  // 🔹 Fetch ticket classes
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/ticket-classes/")
      .then(res => res.json())
      .then(data => setTicketClasses(data));
  }, []);

  // 🔹 Submit booking
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/book/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({
        travel_date: travelDate,
        ticket_class: ticketClass,
        seats: seats
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ticket_number) {
          setMessage(
            `🎫 Booking Successful! Ticket No: ${data.ticket_number}`
          );
        } else {
          setMessage("❌ Booking failed");
        }
      });
  };

  // 🔒 Protect page
  if (!token) {
    return <h3>Please login to book a ticket</h3>;
  }

  return (
    <div>
      <h2>Book Your Ticket</h2>

      <form onSubmit={handleSubmit}>
        <label>Travel Date</label><br />
        <select onChange={e => setTravelDate(e.target.value)} required>
          <option value="">Select</option>
          {travelDates.map(td => (
            <option key={td.id} value={td.id}>
              {td.train} - {td.travel_date}
            </option>
          ))}
        </select>

        <br /><br />

        <label>Ticket Class</label><br />
        <select onChange={e => setTicketClass(e.target.value)} required>
          <option value="">Select</option>
          {ticketClasses.map(tc => (
            <option key={tc.id} value={tc.id}>
              {tc.name} - {tc.price} TZS
            </option>
          ))}
        </select>

        <br /><br />

        <label>Seats</label><br />
        <input
          type="number"
          min="1"
          value={seats}
          onChange={e => setSeats(e.target.value)}
        />

        <br /><br />

        <button type="submit">BOOK</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Booking;






if (data.ticket_number) {
  setMessage(
    <>
      🎫 Booking Successful! <br />
      Ticket No: {data.ticket_number} <br /><br />
      <a
        href={`http://127.0.0.1:8000/api/ticket/pdf/${data.ticket_number}/`}
        target="_blank"
        rel="noreferrer"
      >
        Download Ticket PDF
      </a>
    </>
  );
}





setMessage(
  <>
    🎫 Booking Successful <br />
    Ticket: {data.ticket_number} <br />
    Amount: {data.total_amount} <br />
    <Payment bookingId={data.booking_id} amount={data.total_amount} />
  </>
);
