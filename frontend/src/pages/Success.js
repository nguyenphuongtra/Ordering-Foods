import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;
  const tableId = state?.tableId;

  if (!order) {
    navigate(`/menu/${tableId || ''}`);
    return null;
  }

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Đặt Món Thành Công!</h4>
        </div>
        <div className="card-body">
          <p className="lead">Cảm ơn bạn đã đặt món tại bàn <strong>{tableId}</strong>.</p>
          <p>Mã đơn hàng của bạn:<br/><strong>{order._id}</strong></p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/menu/${tableId}`)}
          >
            Tiếp tục đặt món
          </button>
        </div>
      </div>
    </div>
  );
}
