import React, { useEffect, useState } from 'react';
import { apiService } from '../service/apiService';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import OrderDetailModal from '../components/OrderDetailModal';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    limit: 10,
  });

  const handleRowClick = async (order) => {
    try {
      const res = await apiService.getOrder(order._id);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      alert('Không thể tải chi tiết đơn hàng.');
    }
  };

  const loadOrders = async (currentPage = 1) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pagination.limit,
      };
      if (status !== 'all') {
        params.status = status;
      }
      const res = await apiService.getOrders(params);
      setOrders(Array.isArray(res?.data?.orders) ? res.data.orders : []);
      if (res?.data?.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Load orders failed:', err);
      alert(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, [status]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      loadOrders(newPage);
    }
  };

  const changeStatus = async (order, newStatus) => {
    await apiService.updateOrder(order._id, { status: newStatus });
    loadOrders();
  };

  const removeOrder = async (order) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      await apiService.deleteOrder(order._id);
      loadOrders();
    }
  };

  // Filtering is now done on the backend, so we can remove the client-side filtering.
  const filtered = orders;

  const columns = [
    { key: '_id', label: 'Order ID' },
    {
      key: 'user',
      label: 'User',
      render: u => u?.name ? `${u.name} (${u._id.slice(-4)})` : u?._id
    },
    {
      key: 'table',
      label: 'Table',
      render: t => t ? `Bàn ${t.tableNumber} (${t._id.slice(-4)})` : '—'
    },
    {
      key: 'totalAmount',
      label: 'Total',
      render: a => a.toLocaleString('vi-VN') + ' ₫'
    },
    {
      key: 'paymentMethod',
      label: 'Thanh toán'
    },
    {
      key: 'status',
      label: 'Status',
      render: (s, o) => {
        const statusColors = {
          'Đang xử lý': 'text-warning',
          'Đã hoàn thành': 'text-success',
          'Đã hủy': 'text-danger'
        };
        return (
          <select
            className={`form-select form-select-sm ${statusColors[s] || ''}`}
            value={s}
            onChange={e => changeStatus(o, e.target.value)}
            style={{ fontWeight: 'bold' }}
          >
            {['Đang xử lý', 'Đã hoàn thành', 'Đã hủy']
              .map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: d => new Date(d).toLocaleString('vi-VN')
    }
  ];

  if (loading) return <div className="p-3">Loading...</div>;

  return (
    <div className="p-3">
      <h3>Order Management</h3>

      <div className="row mb-3">
        <div className="col-md-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm đơn hàng..."
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {['Đang xử lý', 'Đã hoàn thành', 'Đã hủy']
              .map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        onDelete={removeOrder}
        onRowClick={handleRowClick}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        <span>
          Trang{' '}
          <strong>
            {pagination.page} of {pagination.pages}
          </strong>
        </span>
        <div className="ms-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Trước
          </button>
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            Tiếp theo
          </button>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
