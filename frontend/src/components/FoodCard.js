import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { Plus } from 'lucide-react';

const FoodCard = ({ food, viewMode }) => {
  const { addToCart, isLoading } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = () => {
    if (!user) {
      const tableIdFromUrl = location.pathname.split('/menu/')[1];
      const tableIdFromStorage = localStorage.getItem('tableId');
      const currentTableId = tableIdFromUrl || tableIdFromStorage;
      navigate('/login', { state: { from: location, tableId: currentTableId } });
      return;
    }
    addToCart({
      id: food._id || food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0px 8px 16px rgba(0,0,0,0.15)' }}
      whileTap={{ scale: 0.97 }}
      className={viewMode === 'list' ? 'd-flex mb-4' : 'mb-4'}
    >
      <div className="card flex-fill border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="position-relative">
          <img
            src={food.image}
            alt={food.name}
            className="w-100"
            style={{ height: viewMode === 'list' ? '200px' : '180px', objectFit: 'cover' }}
          />
          {food.discount && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              -{food.discount}%
            </span>
          )}
          <button
            className="btn btn-light position-absolute top-0 end-0 m-2 p-1 rounded-circle"
            style={{ width: '36px', height: '36px' }}
            title="Add to favorites"
          >
            ❤️
          </button>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-2 text-truncate" title={food.name}>
            {food.name}
          </h5>
          <p
            className="card-text text-muted flex-grow-1 mb-3"
            style={{
              WebkitLineClamp: viewMode === 'list' ? 2 : 3,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {food.description}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5 fw-bold text-danger">
              {food.price.toLocaleString()}₫
            </span>
            <button
              className="btn btn-sm btn-success d-flex align-items-center"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-white me-2"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <Plus size={16} className="text-white me-2" />
              )}
              <span className="text-white">Add</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
