import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, UtensilsCrossed, BarChart3 } from 'lucide-react';
import {apiService} from '../service/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    foods: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    apiService.getOverview()
      .then(res => setStats(res.data))
      .catch(err => console.error('Load overview failed:', err));
  }, []);

  const cards = [
    { title: 'Foods',   value: stats.foods,   icon: UtensilsCrossed, bg: 'primary' },
    { title: 'Orders',  value: stats.orders,  icon: ShoppingBag,     bg: 'success' },
    { title: 'Users',   value: stats.users,   icon: Users,           bg: 'warning' },
    {
      title: 'Doanh thu',
      value: stats.revenue.toLocaleString('vi-VN') + ' ₫',
      icon: BarChart3,
      bg: 'danger'
    }
  ];

  return (
    <div className="row g-4">
      {cards.map((c, i) => (
        <div key={i} className="col-6 col-lg-3">
          <div className={`card text-white bg-${c.bg}`}>
            <div className="card-body d-flex align-items-center">
              <c.icon className="me-3" size={28} />
              <div>
                <h5 className="card-title">Tổng {c.title}</h5>
                <p className="card-text fs-4 mb-0">{c.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
