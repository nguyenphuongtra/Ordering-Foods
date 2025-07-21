import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-4">
      <h4 className="mb-3">Danh mục</h4>
      <div className="d-flex flex-wrap gap-2">
        <button
          className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onCategoryChange('all')}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`btn ${selectedCategory === category.name ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onCategoryChange(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;