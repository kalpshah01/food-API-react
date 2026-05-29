import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import '../styles/sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { path: '/dashboard',  icon: 'speedometer2',   label: 'Dashboard' },
    { path: '/foods',      icon: 'cup-hot-fill',   label: 'Foods' },
    { path: '/add-food',   icon: 'plus-circle-fill', label: 'Add Food' },
    { path: '/orders',     icon: 'bag-check-fill', label: 'Orders' },
    { path: '/profile',    icon: 'person-circle',  label: 'Profile' },
  ];

  return (
    <>
      
      <button
        className="sidebar-toggle d-md-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <i className={`bi bi-${isOpen ? 'x' : 'list'}`}></i>
      </button>

      <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <i className="bi bi-bag-check-fill"></i>
            </div>
            <span className="sidebar-brand-name">Zomato</span>
          </div>
          {user && <span className="sidebar-user-name">{user.name || user.email}</span>}
        </div>

        
        <div className="sidebar-nav-section">
          <div className="sidebar-section-label">Main Menu</div>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                >
                  <i className={`bi bi-${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
