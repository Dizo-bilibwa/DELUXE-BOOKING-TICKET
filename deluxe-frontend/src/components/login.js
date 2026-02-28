const API_BASE = process.env.REACT_APP_API_URL || "https://deluxe-booking-ticket-4-dmst.onrender.com";

fetch(`${API_BASE}/api/token/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username,
    password
  })
})
.then(res => res.json())
.then(data => localStorage.setItem("token", data.access));
