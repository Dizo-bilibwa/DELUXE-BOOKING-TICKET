import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API_URL || "";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setMessage("Please enter both username and password");
      return;
    }

    setLoading(true);
    setMessage("");

    fetch(`${API_BASE}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then(data => {
        console.log("Login response:", data);
        // JWT returns "access" and "refresh" tokens
        if (data.access) {
          localStorage.setItem("token", data.access);
          localStorage.setItem("refresh", data.refresh);
          localStorage.setItem("username", username);
          alert("Login successful!");
          navigate("/booking");
        } else if (data.detail) {
          setMessage(data.detail);
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      })
      .catch(error => {
        console.error("Login error:", error);
        setMessage("Login failed. Please check your credentials or make sure the backend is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // If already logged in, redirect to booking
  if (localStorage.getItem("token")) {
    navigate("/booking");
    return null;
  }

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      
      {message && (
        <div style={{
          padding: "10px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "5px",
          marginBottom: "15px"
        }}>
          {message}
        </div>
      )}
      
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#95a5a6" : "#4CAF50"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={styles.text}>
          Don't have an account? <a href="/register" style={{ color: "#3498db" }}>Register here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  text: {
    marginTop: "10px"
  }
};

export default Login;
