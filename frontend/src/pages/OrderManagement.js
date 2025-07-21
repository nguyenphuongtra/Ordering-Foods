import React, { useEffect, useState } from 'react';
import { apiService } from '../service/apiService';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await apiService.getOrders();
      setOrders(Array.isArray(res?.data?.orders) ? res.data.orders : []);
    } catch (err) {
      console.error('Load orders failed:', err);
      alert(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  const filtered = orders.filter(o => {
    const keyword = search.toLowerCase();
    const matchSearch = [
      o._id,
      o.user?._id,
      o.user?.name,
      o.table?._id,
      o.table?.tableNumber?.toString()
    ].some(v => v?.toString().toLowerCase().includes(keyword));

    const matchStatus = status === 'all' || o.status === status;
    return matchSearch && matchStatus;
  });

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
      key: 'status',
      label: 'Status',
      render: (s, o) => (
        <select
          className="form-select form-select-sm"
          value={s}
          onChange={e => changeStatus(o, e.target.value)}
        >
          {['Đang xử lý', 'Đã hoàn thành', 'Đã hủy']
            .map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      )
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
      />
    </div>
  );
};

export default OrderManagement;
