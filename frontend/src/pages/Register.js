import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../service/apiService";
import "../assets/css/auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const { confirmPassword, ...submitForm } = form;
      await apiService.register(submitForm); // sử dụng apiService
      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng ký tài khoản</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Tên" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={handleChange} required />
        <button type="submit">Đăng ký</button>
      </form>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}
    </div>
  );
};

export default Register;
