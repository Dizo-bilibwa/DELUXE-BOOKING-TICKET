import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = process.env.REACT_APP_API_URL || "";
const IS_LOCALHOST = typeof window !== "undefined" && window.location.hostname === "localhost";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});

    if (!username || !password) {
      setErrors({
        username: !username ? "Username is required" : "",
        password: !password ? "Password is required" : ""
      });
      return;
    }

    const response = await fetch(`${API_BASE}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      setErrors({
        non_field_errors: !API_BASE && !IS_LOCALHOST
          ? ["Backend API is not configured on Vercel. Set REACT_APP_API_URL to your Django backend URL and redeploy."]
          : ["Registration failed: unexpected API response."]
      });
      return;
    }

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      // Display errors inline from the API response
      setErrors(data);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          {errors.username && (
            <span style={styles.error}>
              {Array.isArray(errors.username) 
                ? errors.username[0] 
                : errors.username}
            </span>
          )}
        </div>
        <div style={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          {errors.email && (
            <span style={styles.error}>
              {Array.isArray(errors.email) 
                ? errors.email[0] 
                : errors.email}
            </span>
          )}
        </div>
        <div style={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {errors.password && (
            <span style={styles.error}>
              {Array.isArray(errors.password) 
                ? errors.password[0] 
                : errors.password}
            </span>
          )}
        </div>
        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>
        {errors.non_field_errors && (
          <span style={styles.error}>
            {Array.isArray(errors.non_field_errors)
              ? errors.non_field_errors[0]
              : errors.non_field_errors}
          </span>
        )}
        <p style={styles.text}>
          Already have an account? <a href="/login">Login here</a>
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
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  error: {
    color: "#e74c3c",
    fontSize: "14px",
    marginTop: "5px"
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  text: {
    marginTop: "10px"
  }
};

export default Register;
