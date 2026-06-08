import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe } from '../redux/authSlice';
import { fetchFoods } from '../redux/foodSlice';
import { fetchOrders } from '../redux/orderSlice';
import DashboardLayout from './DashboardLayout';
import Loader from './Loader';
import OrderTable from './OrderTable';
import { resolveImageUrl } from '../utils/imageUtils';



export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { foods } = useSelector((state) => state.food);
  const { orders } = useSelector((state) => state.order);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setStatsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchAuthMe()),
          dispatch(fetchFoods()),
          dispatch(fetchOrders()),
        ]);
      } finally {
        setStatsLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  if (authLoading || statsLoading) return <DashboardLayout><Loader /></DashboardLayout>;

  const totalFoods      = Array.isArray(foods)  ? foods.length  : 0;
  const availableFoods  = Array.isArray(foods)  ? foods.filter((f) => f.availability !== false).length : 0;
  const pendingOrders   = Array.isArray(orders) ? orders.filter((o) => o.status === 'pending').length  : 0;
  const deliveredOrders = Array.isArray(orders) ? orders.filter((o) => o.status === 'delivered').length : 0;

  const stats = [
    { label: 'Total Foods',     value: totalFoods,      icon: 'cup-hot-fill',     iconClass: 'stat-icon-gold'  },
    { label: 'Available',       value: availableFoods,  icon: 'check-circle-fill', iconClass: 'stat-icon-green' },
    { label: 'Pending Orders',  value: pendingOrders,   icon: 'hourglass-split',   iconClass: 'stat-icon-amber' },
    { label: 'Delivered',       value: deliveredOrders, icon: 'truck',             iconClass: 'stat-icon-blue'  },
  ];

  const rawImg = user?.image || user?.imageUrl || user?.avatar || null;
  const avatarSrc = resolveImageUrl(rawImg);

  return (
    <DashboardLayout>
      <div className="container-fluid">

        <div className="mb-4">
          <h2 style={{ fontSize: '1.4rem' }}>
            <i className="bi bi-speedometer2"></i>
            Dashboard
          </h2>
          {user && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 0 }}>
              Welcome back, <strong style={{ color: '#d4a017' }}>{user.name || 'Restaurant'}</strong>
            </p>
          )}
        </div>

        
        <div className="row g-3 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="col-sm-6 col-xl-3">
              <div className="stat-card">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                  <div className={`stat-icon ${s.iconClass}`}>
                    <i className={`bi bi-${s.icon}`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="row g-3">
          
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header">
                <h5><i className="bi bi-person-circle"></i> Restaurant Profile</h5>
              </div>
              <div className="card-body">
                {user ? (
                  <div className="text-center">
                    <img
                      src={avatarSrc}
                      alt={user.name || 'Restaurant'}
                      className="profile-avatar mb-3"
                      style={{ width: '90px', height: '90px' }}
                      onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                    <h6 style={{ color: '#f5f5f5', fontWeight: 700, marginBottom: 4 }}>{user.name}</h6>
                    <div style={{ color: '#d4a017', fontSize: '0.75rem', marginBottom: '1rem', fontWeight: 500 }}>
                      Restaurant Owner
                    </div>
                    <hr style={{ borderColor: 'rgba(212,160,23,0.1)', margin: '0.75rem 0' }} />

                    <div className="text-start">
                      {[
                        { label: 'Email',   icon: 'envelope-fill',  val: user.email   },
                        { label: 'Phone',   icon: 'telephone-fill', val: user.phone   },
                        { label: 'Address', icon: 'geo-alt-fill',   val: user.address },
                      ].map(({ label, icon, val }) => val && (
                        <div key={label} className="mb-3">
                          <div className="profile-field-label">
                            <i className={`bi bi-${icon} me-1`}></i>{label}
                          </div>
                          <div className="profile-field-value">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', textAlign: 'center' }}>Profile not loaded</p>
                )}
              </div>
            </div>
          </div>

          
          <div className="col-md-8">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5><i className="bi bi-bag-check-fill"></i> Recent Orders</h5>
                <a href="/orders" style={{ color: '#d4a017', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                  View all <i className="bi bi-arrow-right"></i>
                </a>
              </div>
              <div className="card-body p-0" style={{ overflow: 'hidden' }}>
                {Array.isArray(orders) && orders.length > 0 ? (
                  <OrderTable orders={orders.slice(0, 5)} />
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-bag-x"></i>
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
