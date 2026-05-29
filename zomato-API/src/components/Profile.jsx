import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe } from '../redux/authSlice';
import DashboardLayout from './DashboardLayout';
import Loader from './Loader';
import { resolveImageUrl } from '../utils/imageUtils';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231e1e1e' rx='100'/%3E%3Ccircle cx='100' cy='75' r='36' fill='%23d4a017' opacity='0.65'/%3E%3Cellipse cx='100' cy='180' rx='64' ry='44' fill='%23d4a017' opacity='0.3'/%3E%3C/svg%3E";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  if (loading && !user) return <DashboardLayout><Loader /></DashboardLayout>;

  const rawImg = user?.image || user?.imageUrl || user?.avatar || null;
  const avatarSrc = resolveImageUrl(rawImg) || DEFAULT_AVATAR;

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <h2 className="mb-4">
          <i className="bi bi-person-circle"></i> Restaurant Profile
        </h2>

        {user ? (
          <div className="card">
            <div className="card-body p-4 p-md-5">
              <div className="row align-items-start">

                <div className="col-md-3 text-center mb-4 mb-md-0">
                  <img
                    src={avatarSrc}
                    alt={user.name || 'Restaurant'}
                    className="profile-avatar mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                  />
                  <h5 style={{ color: '#f5f5f5', fontWeight: 700, marginBottom: 4 }}>{user.name}</h5>
                  <div style={{ color: '#d4a017', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <i className="bi bi-patch-check-fill me-1"></i>Restaurant Owner
                  </div>
                </div>

                <div className="col-md-9">
                  <div style={{ borderLeft: '1px solid rgba(212,160,23,0.15)', paddingLeft: '2rem' }}>
                    <h6 style={{ color: '#d4a017', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', fontWeight: 700 }}>
                      Account Details
                    </h6>

                    <div className="row">
                      {[
                        { label: 'Email Address',      icon: 'envelope-fill',  val: user.email,   col: 'col-md-6' },
                        { label: 'Phone Number',       icon: 'telephone-fill', val: user.phone,   col: 'col-md-6' },
                        { label: 'Restaurant Address', icon: 'geo-alt-fill',   val: user.address, col: 'col-md-12' },
                      ].map(({ label, icon, val, col }) => (
                        <div key={label} className={`${col} mb-4`}>
                          <div className="profile-field-label">
                            <i className={`bi bi-${icon} me-1`}></i>{label}
                          </div>
                          <div className="profile-field-value">{val || '—'}</div>
                        </div>
                      ))}

                      {user.createdAt && (
                        <div className="col-md-6 mb-4">
                          <div className="profile-field-label">
                            <i className="bi bi-calendar-check-fill me-1"></i>Member Since
                          </div>
                          <div className="profile-field-value">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      background: 'rgba(212,160,23,0.05)',
                      border: '1px solid rgba(212,160,23,0.15)',
                      fontSize: '0.82rem',
                      color: '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <i className="bi bi-info-circle-fill" style={{ color: '#d4a017', fontSize: '1rem', flexShrink: 0 }}></i>
                      Profile editing is not supported by the API. Your profile information is set at registration time.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body empty-state">
              <i className="bi bi-person-x"></i>
              <p>Profile not available</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
