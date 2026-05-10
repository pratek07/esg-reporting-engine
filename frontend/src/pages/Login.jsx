import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      alert("Login Successful");
      onLogin();
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>ESG Reporting Engine</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={handleLogin} style={button}>
          Login
        </button>

        <p style={demo}>
          Demo Login → admin / admin123
        </p>
      </div>
    </div>
  );
}

const container = {
  background: "linear-gradient(135deg,#041c6b,#2563eb)",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
};

const card = {
  background: "white",
  padding: "50px",
  borderRadius: "20px",
  width: "400px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const title = {
  marginBottom: "30px",
  color: "#041c6b",
  fontSize: "35px",
};

const input = {
  width: "100%",
  padding: "16px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "18px",
  color: "black",
  background: "white",
};

const button = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg,#06beb6,#48b1bf)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const demo = {
  marginTop: "20px",
  color: "gray",
};

export default Login;