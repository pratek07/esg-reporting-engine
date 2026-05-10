import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (
      username === "admin"
      &&
      password === "admin123"
    ) {

      onLogin();

    } else {

      alert("Invalid Username or Password");

    }
  };

  return (

    <div style={containerStyle}>

      <div style={loginBox}>

        <h1>ESG Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          style={buttonStyle}
        >
          Login
        </button>

      </div>

    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#001B5E"
};

const loginBox = {
  background: "#002B7F",
  padding: "40px",
  borderRadius: "10px",
  width: "350px",
  textAlign: "center",
  color: "white"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "5px",
  border: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Login;