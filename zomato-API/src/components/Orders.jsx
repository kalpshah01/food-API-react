import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/orderSlice';
import DashboardLayout from './DashboardLayout';
import OrderTable from './OrderTable';
import EmptyState from './EmptyState';
import Loader from './Loader';

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2>
            <i className="bi bi-bag-check-fill"></i> Orders
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 400, marginLeft: '10px' }}>
              ({safeOrders.length} total)
            </span>
          </h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => dispatch(fetchOrders())}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        <div className="card">
          <div className="card-body p-0" style={{ overflow: 'hidden' }}>
            {safeOrders.length > 0 ? (
              <OrderTable orders={safeOrders} />
            ) : (
              <EmptyState message="No orders found yet" icon="bag-x" />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
