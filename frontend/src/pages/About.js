import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../style/StaticPage.css';

const About = () => {
  return (
    <>
      <Header />
      <div className="static-page-container">
        <h2>Về chúng tôi</h2>
        <p>Chào mừng bạn đến với nhà hàng của chúng tôi! Chúng tôi cam kết mang đến cho bạn những món ăn ngon nhất được chế biến từ những nguyên liệu tươi sạch nhất.</p>
        <p>Đội ngũ đầu bếp của chúng tôi có nhiều năm kinh nghiệm và luôn sáng tạo để tạo ra những món ăn độc đáo, hấp dẫn.</p>
      </div>
      <Footer />
    </>
  );
};

export default About;
