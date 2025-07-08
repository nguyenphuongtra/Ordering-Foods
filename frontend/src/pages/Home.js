import React, { useEffect, useState } from "react";
import '../assets/css/home.css';

const Home = () => {
  const [email, setEmail] = useState("");
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setEmail(payload.email);
      } catch (e) {
        setEmail("");
      }
    }
    // Fetch foods
    fetch("http://localhost:4000/api/food")
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(() => setFoods([]));

    // Fetch categories
    fetch("http://localhost:4000/api/category")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="home-container">
      <h2 className="home-title">Trang chủ</h2>
      {email ? (
        <>
          <p className="home-email">Đăng nhập thành công với Gmail: <b>{email}</b></p>
          <button className="home-logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Đăng xuất</button>
        </>
      ) : (
        <button className="home-login-btn" onClick={() => window.location.href = '/login'}>Đăng nhập</button>
      )}
      <h3 className="food-list-title">Danh mục món ăn</h3>
      <ul className="category-list">
        {categories.map(category => (
          <li key={category._id} className="category-card">
            <b>{category.name}</b>
          </li>
        ))}
      </ul>
      <h3 className="food-list-title">Danh sách món ăn</h3>
      <ul className="food-list">
        {foods.map(food => (
          <li key={food._id} className="food-card">
            <b>{food.name}</b>
            <span className="food-price"> - {food.price}đ</span>
            <div className="food-desc">{food.description}</div>
            {food.image && <img src={food.image} alt={food.name} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
