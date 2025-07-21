// src/components/MenuFilters.jsx
import React from 'react';

const MenuFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  priceRange,
  setPriceRange,
  maxPrice,
}) => {
  return (
    <div className="card shadow-sm mb-6" style={{ borderRadius: '15px', border: 'none' }}>
      <div className="card-body p-4">
        <div className="row g-4">
          <div className="col-lg-6">
            <label className="form-label fw-semibold">
              <i className="fas fa-search me-2 text-primary"></i>
              Tìm kiếm món ăn
            </label>
            <div className="input-group">
              <span className="input-group-text border-0 bg-light">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Nhập tên món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '0 10px 10px 0' }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <label className="form-label fw-semibold">
              <i className="fas fa-tags me-2 text-primary"></i>
              Danh mục
            </label>
            <select
              className="form-select border-0 bg-light"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ borderRadius: '10px' }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category._id || category.id} value={category._id || category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-6">
            <label className="form-label fw-semibold">
              <i className="fas fa-money-bill-wave me-2 text-primary"></i>
              Khoảng giá: {priceRange.min.toLocaleString()}₫ - {priceRange.max.toLocaleString()}₫
            </label>
            <div className="row g-3">
              <div className="col-6">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={maxPrice}
                  step="10000"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                />
                <small className="text-muted">Giá thấp nhất</small>
              </div>
              <div className="col-6">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={maxPrice}
                  step="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                />
                <small className="text-muted">Giá cao nhất</small>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="col-lg-6">
            <label className="form-label fw-semibold">
              <i className="fas fa-filter me-2 text-primary"></i>
              Lọc nhanh theo giá
            </label>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => setPriceRange({ min: 0, max: 50000 })}>
                Dưới 50k
              </button>
              <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => setPriceRange({ min: 50000, max: 100000 })}>
                50k - 100k
              </button>
              <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => setPriceRange({ min: 100000, max: 200000 })}>
                100k - 200k
              </button>
              <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => setPriceRange({ min: 200000, max: maxPrice })}>
                Trên 200k
              </button>
              <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => setPriceRange({ min: 0, max: maxPrice })}>
                <i className="fas fa-redo me-1"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFilters;
