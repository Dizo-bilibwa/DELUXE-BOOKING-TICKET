import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("token", data.access);
        alert("Login successful");
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;



localStorage.setItem("token", data.token);

if (data.token) {
  localStorage.setItem("token", data.token);
  alert("Login successful");
}



const token = localStorage.getItem("token");

fetch("http://127.0.0.1:8000/api/bookings/", {
  headers: {
    "Authorization": `Token ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));


if (!localStorage.getItem("token")) {
  return <h2>Please login first</h2>;
}





