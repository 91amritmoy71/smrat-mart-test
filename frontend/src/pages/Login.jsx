import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Only keep this inside handleLogin
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post("http://localhost:5600/api/signin", { email, password });
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Login failed");
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center text-danger mb-3">Welcome Back</h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-end">
            <Link to="/forgot-password" className="text-decoration-none small text-primary">
              Forgot Password?
            </Link>
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-danger">Login</button>
          </div>

          <div className="text-center">
            <small>
              New customer? <Link to="/signup" className="text-primary">Create an account</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;





