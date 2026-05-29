import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/orderSlice';

const STATUS_OPTIONS = [
  'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled',
];

const STATUS_BADGE = {
  pending:          'bg-warning',
  confirmed:        'bg-info',
  preparing:        'bg-primary',
  out_for_delivery: 'bg-secondary',
  delivered:        'bg-success',
  cancelled:        'bg-danger',
};

const STATUS_LABEL = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

export default function OrderTable({ orders }) {
  const dispatch = useDispatch();

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <code>#{order._id.substring(0, 8).toUpperCase()}</code>
              </td>
              <td style={{ color: '#9ca3af' }}>{order.items?.length || 0} item(s)</td>
              <td style={{ color: '#d4a017', fontWeight: 600 }}>₹{order.total || 0}</td>
              <td>
                <span className={`badge ${STATUS_BADGE[order.status] || 'bg-secondary'}`}>
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </td>
              <td style={{ color: '#6b7280', fontSize: '0.82rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={{ width: '150px', fontSize: '0.78rem' }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status] || status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
