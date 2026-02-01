



import { useEffect, useState } from "react";

function App() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/api/routes/")
      .then(res => res.json())
      .then(data => setRoutes(data));
  }, []);

  return (
    <div>
      <h2>Available Routes</h2>
      <ul>
        {routes.map(r => (
          <li key={r.id}>
            {r.origin} → {r.destination}
          </li>
        ))}
      </ul>
    </div>
  );
}



import Booking from "./Bookings";
function App(){
  return(
    <div>

    <Booking/>
    </div>
  );
}







import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Booking from "./Booking";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

































































