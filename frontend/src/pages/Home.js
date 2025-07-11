import React, { useEffect, useState } from "react";
import "../assets/css/home.css";
import "../assets/images/FOOD-logo.png"; // Assuming you have a logo image in your assets


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
    fetch("http://localhost:4000/api/food")
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(() => setFoods([]));
    fetch("http://localhost:4000/api/category")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="../assets/images/FOOD-logo.png" alt="Food-Logo" />
        </div>  
        <nav className="nav">
          <a href="/">Trang chủ</a>
          <a href="/">Thực đơn</a>
          <a href="/">Lịch sử</a>
          <a href="/">Liên hệ</a>
          <a href="/">Giới thiệu</a>
          <a href="/">Blog</a>
          <a href="/">Tài khoản</a>
          {email ? (
            <button className="login-btn" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Đăng xuất</button>
          ) : (
            <>
              <button className="login-btn" onClick={() => window.location.href = '/login'}>Đăng nhập</button>
              <button className="register-btn">Đăng ký</button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="subtitle">Fastest Delivery & Easy Pickup</p>
          <h1>Kings Burger</h1>
          <p className="desc">
            Good food starts with good ingredients. We only bring you the best.
          </p>
          <button className="view-menu-btn">View Our Menu</button>
        </div>
        <div className="hero-img">
          <img src="https://img.dominos.vn/1M_Menu+m%C3%B3n+ch%C3%ADnh+PC-MB.jpg" alt="Burger" />
          <div className="discount-badge">
            <span>UPTO</span>
            <strong>20%</strong>
            <span>DISCOUNT</span>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="deals">
        <h2>
          Up to -40% <span role="img" aria-label="party">🎉</span> Order.uk exclusive deals
        </h2>
        <div className="deal-tabs">
          <button>Vegan others</button>
          <button>Sushi</button>
          <button className="active">Pizza & Fast food</button>
        </div>
        <div className="deal-cards">
          {demoDeals.map((deal, idx) => (
            <div className="deal-card" key={idx}>
              <img src={deal.img} alt={deal.title} />
              <div className="deal-info">
                <span className="discount">{deal.discount}</span>
                <div>
                  <div className="restaur">Restaur</div>
                  <div className="title">{deal.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Food Items */}
      <section className="popular">
        <h3>
          <span className="highlight">Crispy, Every Bite Taste</span>
        </h3>
        <h2>Popular Food Items</h2>
        <div className="popular-list">
          {demoPopular.map((item, idx) => (
            <div className="popular-item" key={idx}>
              <img src={item.img} alt={item.title} />
              <div className="item-title">{item.title}</div>
              <div className="item-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Danh mục món ăn động */}
      <section className="category-section">
        <h3 className="food-list-title">Danh mục món ăn</h3>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category._id} className="category-card">
              <b>{category.name}</b>
            </li>
          ))}
        </ul>
      </section>

      {/* Danh sách món ăn động */}
      <section className="food-section">
        <h3 className="food-list-title">Danh sách món ăn</h3>
        <ul className="food-list">
          {foods.map(food => (
            <li key={food._id} className="food-card">
              <b>{food.name}</b>
              <span className="food-price"> - {food.price}đ</span>
              <div className="food-desc">{food.description}</div>
              {food.image && (
                <img
                  src={
                    food.image.startsWith("http")
                      ? food.image
                      : `http://localhost:4000/${food.image.replace(/^\/+/, "")}`
                  }
                  alt={food.name}
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;