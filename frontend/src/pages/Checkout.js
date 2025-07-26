import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { apiService } from '../service/apiService';
import { cleanId } from '../utils/cleanId';

export default function Checkout() {
  const { tableId: rawParam } = useParams();
  const { tableId: rawContext, cartItems, clearCart, getTotalPrice } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Tại quầy');

  const paramTableId = cleanId(rawParam);
  const contextTableId = cleanId(rawContext);
  const tableId = paramTableId || contextTableId || cleanId(localStorage.getItem('tableId'));

  const handlePay = async () => {
    if (!user?._id) return alert('Bạn cần đăng nhập để đặt hàng!');
    if (!tableId) return alert('Không xác định được bàn!');
    if (!cartItems.length) return alert('Giỏ hàng đang trống!');

    const orderData = {
      userId: user._id,
      tableId,
      items: cartItems.map(item => ({ food: item._id || item.id, quantity: item.quantity })),
      totalAmount: getTotalPrice(),
      paymentMethod,
      status: 'Đang xử lý'
    };

    setLoading(true);
    try {
      const newOrder = await apiService.createOrder(orderData);
      if (paymentMethod === 'VNPAY') {
        const paymentUrlData = {
          orderId: newOrder.data._id,
          amount: newOrder.data.totalAmount,
          orderDescription: `Thanh toan don hang cho ban ${tableId}`,
        };
        const paymentUrlResponse = await apiService.createPaymentUrl(paymentUrlData);
        window.location.href = paymentUrlResponse.data;
      } else {
        clearCart();
        navigate('/success', { state: { order: newOrder.data || newOrder, tableId } });
      }
    } catch (error) {
      console.error('Thanh toán thất bại', error.message);
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: '#f8f9fa' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                   style={{ width: '80px', height: '80px', background: 'rgba(128, 31, 31, 0.2)', backdropFilter: 'blur(10px)' }}>
                <i className="fas fa-receipt text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h2 className="text-black fw-bold mb-2">Xác nhận đơn hàng</h2>
              <div className="badge bg-light text-dark fs-6 px-3 py-2 rounded-pill">
                <i className="fas fa-table me-2"></i>
                Bàn số {tableId}
              </div>
            </div>

            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <i className="fas fa-shopping-bag text-primary me-2"></i>
                  Chi tiết đơn hàng
                </h5>
                
                <div className="order-items" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="d-flex align-items-center justify-content-between p-3 mb-3 rounded-3" 
                         style={{ backgroundColor: '#f8f9ff', border: '1px solid #e3e6ff' }}>
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '50px', height: '50px', background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold">{item.name}</h6>
                          <small className="text-muted">Số lượng: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-danger fs-5">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </div>
                        <small className="text-muted">
                          {item.price.toLocaleString()}₫ × {item.quantity}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-4 mt-4">
                  <div className="row">
                    <div className="col-6">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-calculator text-muted me-2"></i>
                        <span>Tạm tính:</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-tag text-muted me-2"></i>
                        <span>Thuế & phí:</span>
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <div className="mb-2">{getTotalPrice().toLocaleString()}₫</div>
                      <div className="mb-2 text-success">Miễn phí</div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-3 mt-3" style={{ background: 'linear-gradient(135deg, #0b36f3ff)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-white mb-0 fw-bold">Tổng thanh toán:</h5>
                      <h4 className="text-white mb-0 fw-bold">{getTotalPrice().toLocaleString()}₫</h4>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="fw-bold mb-3">Chọn phương thức thanh toán</h5>
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash"
                        value="Tại quầy"
                        checked={paymentMethod === 'Tại quầy'}
                        onChange={() => setPaymentMethod('Tại quầy')}
                      />
                      <label className="form-check-label" htmlFor="cash">
                        Tại quầy
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="vnpay"
                        value="VNPAY"
                        checked={paymentMethod === 'VNPAY'}
                        onChange={() => setPaymentMethod('VNPAY')}
                      />
                      <label className="form-check-label" htmlFor="vnpay">
                        VNPAY
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-lg w-100 text-white fw-semibold position-relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      border: 'none',
                      borderRadius: '15px',
                      padding: '15px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(40, 167, 69, 0.4)'
                    }}
                    onClick={handlePay}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 35px rgba(40, 167, 69, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                      }
                    }}
                  >
                    {loading && (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1.2rem', height: '1.2rem' }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Đang xử lý thanh toán...
                      </div>
                    )}
                    {!loading && (
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="fas fa-credit-card me-2"></i>
                        Xác nhận và Đặt món
                      </div>
                    )}
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <small className="text-muted d-flex align-items-center justify-content-center">
                    <i className="fas fa-shield-alt text-success me-2"></i>
                    Thanh toán được bảo mật với công nghệ mã hóa SSL
                  </small>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <button 
                className="btn btn-link text-white text-decoration-none"
                onClick={() => navigate(-1)}
                style={{ fontSize: '1rem' }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Quay lại giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999 }}>
          <div className="text-center text-white">
            <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Đang xử lý thanh toán...</h5>
            <p className="mb-0">Vui lòng không đóng trang này</p>
          </div>
        </div>
      )}
    </div>
  );
}
