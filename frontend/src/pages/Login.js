import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
        <button type="submit">Đăng nhập</button>
      </form>
      <button className="auth-google-btn" onClick={handleGoogleLogin}>
        Đăng nhập với Google
      </button>
      <div className="auth-link">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </div>
      {error && <div className="auth-error">{error}</div>}
    </div>
  );
};

export default Login;
