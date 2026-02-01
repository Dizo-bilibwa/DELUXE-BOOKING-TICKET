function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;




.then(res => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return res.json();
})
