import { useEffect, useState, useContext } from 'react';
import {BrowserRouter as Router,Routes, Route, useNavigate, Navigate,} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './pages/Menu';
import CartModal from './components/CartModal';
import { CartProvider } from './contexts/CartContext';
import { AuthContext } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext'; 
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import FoodManagement from './pages/FoodManagement';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import QRScanner from './pages/QRScanner'
import Success from './pages/Success';
import LoginSuccess from "./pages/LoginSuccess";
import { BarChart3, UtensilsCrossed, ShoppingBag, Users } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import VnpayReturn from './pages/VnpayReturn';

function TokenHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, "/menu");
      navigate('/');
    }
  }, [navigate]);
  return null;
}

const AdminLayout = () => {
  const [tab, setTab] = useState('dashboard');
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'foods', label: 'Foods', icon: UtensilsCrossed },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users }
  ];

  const renderTab = {
    dashboard: <Dashboard />,
    foods: <FoodManagement />,
    orders: <OrderManagement />,
    users: <UserManagement />
  }[tab];

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-12 col-md-3 col-lg-2 bg-light sidebar py-3">
          <h4 className="px-3">Food Admin</h4>
          <ul className="nav flex-column">
            {tabs.map(t => (
              <li className="nav-item" key={t.id}>
                <button
                  className={`nav-link btn btn-link w-100 text-start ${tab === t.id ? 'active text-primary' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <t.icon className="me-2" size={18} />
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-12 col-md-9 col-lg-10 px-4 py-3">
          <h2 className="mb-4">{tabs.find(t => t.id === tab).label}</h2>
          {renderTab}
        </main>
      </div>
    </div>
  );
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function Layout({ children }) {
  return (
    <>
      {children}
      <CartModal />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <TokenHandler />
          <Routes>
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
            <Route path="/vnpay_return" element={<VnpayReturn />} />

            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/checkout/:tableId?" element={
              <Layout>
                <Checkout/>
              </Layout>
            } />
            <Route path="/menu/:tableId" element={
              <Layout>
                <Menu />
              </Layout>
            } />
            <Route path="/menu" element={
              <Layout>
                <Menu />
              </Layout>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            } />
            <Route path="/" element={<Navigate to="/menu" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
