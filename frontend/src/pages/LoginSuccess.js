import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tableId = params.get("tableId");

    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Điều hướng tới trang Menu với tableId
      navigate(`/menu/${tableId || ""}`);
    } else {
      // Nếu không có token -> quay về trang chủ
      navigate("/");
    }
  }, [navigate]);

  return <p>Đang đăng nhập...</p>;
};

export default LoginSuccess;
