const API_BASE = process.env.REACT_APP_API_URL || "";

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
