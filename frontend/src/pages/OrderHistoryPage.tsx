import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Order } from "../types/Order";
import { getMyOrders } from "../services/orderService";

function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="browse-link">Browse Products</Link>
        </div>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-conf">{order.confirmationNumber}</span>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="order-total">Total: ${order.total.toFixed(2)}</p>
              <p className="order-items-count">{order.items.length} item(s)</p>
              <Link to={`/orders/confirmation/${order.id}`} className="browse-link">
                View details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistoryPage;
