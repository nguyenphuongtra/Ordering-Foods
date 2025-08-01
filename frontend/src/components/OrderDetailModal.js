import React from 'react';
import Modal from './Modal';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <Modal onClose={onClose} title={`Chi tiết đơn hàng #${order._id.slice(-6)}`}>
      <div className="p-3">
        <p><strong>ID:</strong> {order._id}</p>
        <p><strong>Khách hàng:</strong> {order.user?.name} ({order.user?._id})</p>
        <p><strong>Bàn:</strong> {order.table?.tableNumber}</p>
        <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString('vi-VN')} ₫</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
        <p><strong>Trạng thái thanh toán:</strong> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
        <p><strong>Trạng thái đơn hàng:</strong> {order.status}</p>
        <p><strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        
        <h5 className="mt-4">Các món đã đặt:</h5>
        <ul className="list-group">
          {order.items && order.items.length > 0 ? (
            order.items.map(item => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {item.food ? item.food.name : 'Món ăn không tồn tại'}
                  <br />
                  <small className="text-muted">
                    {item.food ? `${item.food.price.toLocaleString('vi-VN')} ₫` : ''}
                  </small>
                </div>
                <span className="badge bg-primary rounded-pill">{item.quantity}</span>
              </li>
            ))
          ) : (
            <li className="list-group-item">Không có món nào trong đơn hàng.</li>
          )}
        </ul>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
