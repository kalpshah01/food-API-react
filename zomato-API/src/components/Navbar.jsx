import { useSelector } from 'react-redux';
import { resolveImageUrl } from '../utils/imageUtils';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%231e1e1e' rx='20'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23d4a017' opacity='0.8'/%3E%3Cellipse cx='20' cy='36' rx='13' ry='9' fill='%23d4a017' opacity='0.5'/%3E%3C/svg%3E";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);

  const rawImg = user?.image || user?.imageUrl || user?.avatar || null;
  const avatarSrc = resolveImageUrl(rawImg) || DEFAULT_AVATAR;

  return (
    <nav className="dash-navbar navbar">
      <div className="container-fluid px-0">
        <span className="navbar-brand-text">
          <i className="bi bi-grid-3x3-gap-fill me-2" style={{ color: '#d4a017' }}></i>
          Admin Panel
        </span>
        <div className="d-flex align-items-center ms-auto gap-3">
          {user && (
            <div className="d-flex align-items-center gap-2">
              <div className="text-end d-none d-sm-block">
                <div style={{ color: '#f5f5f5', fontSize: '0.85rem', fontWeight: 600 }}>
                  {user.name || 'Restaurant'}
                </div>
                <div className="user-email">{user.email}</div>
              </div>
              <img
                src={avatarSrc}
                alt={user.name || 'User'}
                className="user-avatar"
                width="38"
                height="38"
                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
