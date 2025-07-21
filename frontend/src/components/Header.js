import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, LogIn, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, loading, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-warning sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🍽️ FOOD
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/menu">
                Menu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light position-relative me-3"
              data-bs-toggle="modal"
              data-bs-target="#cartModal"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="badge bg-danger text-white position-absolute top-0 start-100 translate-middle badge-pill">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {loading ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={18} className="me-2" />
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" to="/profile">
                      <User size={16} className="me-2" /> Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center" onClick={logout}>
                      <LogOut size={16} className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-outline-light d-flex align-items-center" to="/login">
                <LogIn size={16} className="me-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
