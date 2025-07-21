import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import '../style/Hero.css'; 
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
      title: "Món gì cũng có",
      subtitle: "Trải nghiệm ẩm thực hảo hạng",
      description: "Nguyên liệu tươi ngon, chế biến chuyên nghiệp và được phục vụ tận bàn với chất lượng 5 sao.",
      accent: "🍽️"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
      title: "Ẩm thực đặc sắc",
      subtitle: "Hương vị Việt Nam authentic",
      description: "Khám phá những món ăn truyền thống được chế biến bằng bí quyết gia truyền độc đáo.",
      accent: "🇻🇳"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
      title: "Không gian sang trọng",
      subtitle: "Phục vụ chuyên nghiệp",
      description: "Thưởng thức bữa ăn trong không gian ấm cúng với dịch vụ tận tâm từ đội ngũ của chúng tôi.",
      accent: "✨"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="hero-section">
      {/* Background Effects */}
      <div className="background-pattern">
        <div className="floating-1"></div>
        <div className="floating-2"></div>
        <div className="floating-3"></div>
      </div>

      <div className="container-fluid h-100 d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center min-vh-100">

            {/* Text Section */}
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <div className="accent-emoji mb-4">
                {slides[currentSlide].accent}
              </div>

              <div className="mb-4">
                <h1 className="display-1 fw-bold mb-3 gradient-text">
                  {slides[currentSlide].title}
                </h1>
                <h2 className="h3 text-muted fw-normal">
                  {slides[currentSlide].subtitle}
                </h2>
              </div>

              <p className="lead text-muted mb-4" style={{ maxWidth: '600px' }}>
                {slides[currentSlide].description}
              </p>

              {/* Features */}
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4">
                <div className="d-flex align-items-center px-3 py-2 feature-badge">
                  <Star className="me-2" style={{ width: '16px', height: '16px', color: '#f59e0b' }} fill="currentColor" />
                  <span className="text-muted small">5 sao chất lượng</span>
                </div>
                <div className="d-flex align-items-center px-3 py-2 feature-badge">
                  <Clock className="me-2" style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span className="text-muted small">Mở cửa 24/7</span>
                </div>
                <div className="d-flex align-items-center px-3 py-2 feature-badge">
                  <MapPin className="me-2" style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                  <span className="text-muted small">Giao hàng nhanh</span>
                </div>
              </div>

              {/* CTA */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-4">
                <button className="btn btn-lg px-4 py-3 gradient-btn btn-hover">
                  <span className="fw-semibold">Xem Menu Ngay</span>
                </button>
                <button className="btn btn-lg px-4 py-3 outline-btn btn-hover">
                  <span className="fw-semibold">Đặt Bàn Ngay</span>
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="d-flex justify-content-center justify-content-lg-start gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`indicator ${index === currentSlide ? 'active-indicator' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="col-lg-6">
              <div className="position-relative image-container">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-100 h-100 hero-image"
                  style={{ objectFit: 'cover', transition: 'all 1s ease' }}
                />

                <div className="image-overlay"></div>

                <div className="px-3 py-2 rating-badge">
                  <div className="d-flex align-items-center">
                    <Star style={{ width: '16px', height: '16px', color: '#fbbf24' }} fill="currentColor" />
                    <span className="ms-1 fw-semibold small">4.9</span>
                  </div>
                </div>

                {/* Navigation */}
                <button onClick={prevSlide} className="nav-btn nav-left">
                  <ChevronLeft style={{ width: '20px', height: '20px', color: '#374151' }} />
                </button>
                <button onClick={nextSlide} className="nav-btn nav-right">
                  <ChevronRight style={{ width: '20px', height: '20px', color: '#374151' }} />
                </button>

                {/* Decorative elements */}
                <div className="decorative-1"></div>
                <div className="decorative-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="wave-bottom">
        <svg viewBox="0 0 1440 120" className="w-100" style={{ height: '80px' }}>
          <path
            fill="rgb(255, 255, 255)"
            d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
