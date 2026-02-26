import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Booking from "./Booking";
import ProtectedRoute from "./ProtectedRoute";
import Navigation from "./components/Navigation";
import { useEffect, useState } from "react";
const API_BASE = process.env.REACT_APP_API_URL || "";

function RoutesList() {
  const [routes, setRoutes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/routes/`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch routes");
        }
        return res.json();
      })
      .then(data => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching routes:", err);
        setError("Unable to load routes. Please make sure the backend server is running on port 8000.");
        setLoading(false);
      });
    
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to DELUXE BOOKING</h1>
      <p style={styles.subtitle}>Your premium train booking experience</p>
      
      <div style={styles.features}>
        <div style={styles.featureCard}>
          <h3>Easy Booking</h3>
          <p>Book your tickets in just a few clicks</p>
        </div>
        <div style={styles.featureCard}>
          <h3>Multiple Routes</h3>
          <p>Choose from various destinations</p>
        </div>
        <div style={styles.featureCard}>
          <h3>Comfort Classes</h3>
          <p>Select from economy to VIP classes</p>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Available Routes</h2>
      {error ? (
        <div style={styles.errorBox}>
          <p>{error}</p>
          <p style={{fontSize: '14px', marginTop: '10px'}}>
            Make sure Django is running: <code>py manage.py runserver 8000</code>
          </p>
        </div>
      ) : loading ? (
        <p>Loading routes...</p>
      ) : routes.length > 0 ? (
        <div style={styles.routesList}>
          {routes.map(r => (
            <div key={r.id} style={styles.routeCard}>
              <span style={styles.routeOrigin}>{r.origin}</span>
              <span style={styles.routeArrow}>→</span>
              <span style={styles.routeDest}>{r.destination}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No routes available.</p>
      )}

      {!isLoggedIn && (
        <div style={styles.cta}>
          <p>Please login to book your ticket</p>
          <a href="/login" style={styles.loginBtn}>Login Now</a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "32px",
    marginBottom: "10px"
  },
  subtitle: {
    textAlign: "center",
    color: "#7f8c8d",
    fontSize: "18px",
    marginBottom: "30px"
  },
  features: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "40px",
    flexWrap: "wrap"
  },
  featureCard: {
    flex: "1",
    minWidth: "200px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    margin: "10px"
  },
  sectionTitle: {
    color: "#2c3e50",
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px"
  },
  routesList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px"
  },
  routeCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#ecf0f1",
    borderRadius: "8px",
    fontSize: "16px"
  },
  routeOrigin: {
    fontWeight: "bold",
    color: "#2c3e50"
  },
  routeArrow: {
    color: "#3498db",
    fontSize: "20px"
  },
  routeDest: {
    fontWeight: "bold",
    color: "#2c3e50"
  },
  errorBox: {
    padding: "20px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "5px",
    textAlign: "center",
    marginTop: "20px"
  },
  cta: {
    textAlign: "center",
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#e8f6f3",
    borderRadius: "10px"
  },
  loginBtn: {
    display: "inline-block",
    padding: "12px 30px",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
    marginTop: "10px"
  }
};

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<RoutesList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
