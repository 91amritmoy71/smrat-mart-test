import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center text-danger mb-3">Reset Password</h4>
        <form>
          <div className="mb-3">
            <label className="form-label">Enter your registered email</label>
            <input type="email" className="form-control" placeholder="Email address" />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-danger">Send Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
