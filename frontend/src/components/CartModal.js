import React, { useContext } from 'react';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { Plus, Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CartModal() {
  const { tableId, cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user?._id) {
      alert('Bạn cần đăng nhập để đặt hàng!');
      return;
    }
    if (!cartItems.length) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    navigate(`/checkout/${tableId}`);
    const modalEl = document.getElementById('cartModal');
    bootstrap.Modal.getInstance(modalEl)?.hide();
  };

  return (
    <div className="modal fade" id="cartModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Giỏ hàng (Bàn {tableId})</h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body">
            {cartItems.length === 0 ? (
              <p className="text-center text-muted">
                Giỏ hàng của bạn đang trống
              </p>
            ) : (
              cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="d-flex align-items-center mb-3 border-bottom pb-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded me-3"
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="mb-1 text-muted">
                      {item.price.toLocaleString()}₫ x {item.quantity}
                    </p>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="modal-footer d-flex justify-content-between align-items-center">
            <h5>Tổng cộng: {getTotalPrice().toLocaleString()}₫</h5>
            <div>
              <button
                type="button"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Tiếp tục mua sắm
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCheckout}
              >
                Đặt món
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
