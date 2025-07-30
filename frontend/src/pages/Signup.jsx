import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post("http://localhost:5600/api/signup", { name, email, password });
    if (data.success) {
      alert("Signup successful");
      navigate("/login");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Signup failed");
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center text-danger mb-3">Create Account</h4>

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
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

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-danger">Signup</button>
          </div>

          <div className="text-center">
            <small>
              Already have an account? <Link to="/login" className="text-primary">Login</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

