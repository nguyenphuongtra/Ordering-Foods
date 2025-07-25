import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../assets/css/auth.css";
import { AuthContext } from "../contexts/AuthContext";
import { apiService, API_BASE_URL } from "../service/apiService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loadingRedirect, setLoadingRedirect] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const from = location.state?.from?.pathname || "/menu";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const tableId = params.get("tableId");

    if (token) {
      setLoadingRedirect(true);
      login(token)
        .then(() => {
          if (tableId) {
            navigate(`/menu/${tableId}`);
          } else {
            navigate(from);
          }
        })
        .catch(err => {
          setError("Đăng nhập bằng Google thất bại");
          setLoadingRedirect(false);
        });
    }
  }, [location.search, login, navigate, from]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiService.login(form);
      await login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  const handleGoogleLogin = () => {
    const tableId = location.state?.tableId;
    const googleAuthUrl = `${API_BASE_URL}/auth/google`;
    const redirectUrl = tableId
      ? `${googleAuthUrl}?tableId=${encodeURIComponent(tableId)}`
      : googleAuthUrl;

    window.location.href = redirectUrl;
  };

  if (loadingRedirect) {
    return (
      <div className="auth-container">
        <h3>Đang đăng nhập bằng Google...</h3>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      <button className="auth-google-btn" onClick={handleGoogleLogin}>
        Đăng nhập với Google
      </button>
      <div className="auth-link">
        Chưa có tài khoản?{" "}
        <Link
          to={{
            pathname: "/register",
            state: { from },
          }}
        >
          Đăng ký
        </Link>
      </div>
      {error && <div className="auth-error">{error}</div>}
    </div>
  );
};

export default Login;
