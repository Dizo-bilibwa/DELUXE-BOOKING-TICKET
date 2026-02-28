import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API_URL || "";
const IS_LOCALHOST = typeof window !== "undefined" && window.location.hostname === "localhost";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const extractErrorMessage = async (res) => {
    if (!res) return "Login failed. Please check your username and password.";
    const contentType = res.headers.get("content-type") || "";
    const looksLikeHtml = contentType.includes("text/html");
    if (looksLikeHtml || (res.status === 404 && !API_BASE && !IS_LOCALHOST)) {
      return "Backend API is not configured on Vercel. Set REACT_APP_API_URL to your Django backend URL and redeploy.";
    }

    try {
      const data = await res.json();
      if (typeof data?.detail === "string") return data.detail;
      if (typeof data?.non_field_errors?.[0] === "string") return data.non_field_errors[0];
      if (typeof data?.username?.[0] === "string") return data.username[0];
      if (typeof data?.password?.[0] === "string") return data.password[0];
    } catch (e) {
      // ignore JSON parse errors and fall back to generic message
    }
    return "Login failed. Please check your username and password.";
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const jwtResponse = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (jwtResponse.ok) {
        const jwtData = await jwtResponse.json();
        if (jwtData.access) {
          localStorage.setItem("token", jwtData.access);
          localStorage.setItem("refresh", jwtData.refresh || "");
          localStorage.setItem("token_type", "Bearer");
          localStorage.setItem("username", username);
          alert("Login successful!");
          navigate("/booking");
          return;
        }
      }

      // Fallback for legacy login endpoint that returns DRF token auth key
      const legacyResponse = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (legacyResponse.ok) {
        const legacyData = await legacyResponse.json();
        if (legacyData.token) {
          localStorage.setItem("token", legacyData.token);
          localStorage.removeItem("refresh");
          localStorage.setItem("token_type", "Token");
          localStorage.setItem("username", username);
          alert("Login successful!");
          navigate("/booking");
          return;
        }
      }

      const jwtMessage = await extractErrorMessage(jwtResponse);
      const legacyMessage = await extractErrorMessage(legacyResponse);
      setMessage(jwtMessage === "Login failed. Please check your username and password." ? legacyMessage : jwtMessage);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot reach backend API. If frontend is on Vercel, set REACT_APP_API_URL to your Django backend URL.");
    } finally {
      setLoading(false);
    }
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
