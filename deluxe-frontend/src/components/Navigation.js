import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    setUsername(user || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token_type");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>DELUXE BOOKING</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/booking" style={styles.link}>Book Ticket</Link>
            <span style={styles.welcome}>Hello, {username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2c3e50",
    color: "white"
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  brandLink: {
    color: "white",
    textDecoration: "none"
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    transition: "background 0.3s"
  },
  welcome: {
    color: "#ecf0f1",
    fontSize: "14px"
  },
  logoutBtn: {
    padding: "8px 15px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default Navigation;
