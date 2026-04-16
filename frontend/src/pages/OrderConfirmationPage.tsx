import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import type { Order } from "../types/Order";
import { apiFetch } from "../services/api";

function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const preloaded = (location.state as { order?: Order } | null)?.order;
  const [order, setOrder] = useState<Order | null>(preloaded ?? null);
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preloaded || !id) return;
    apiFetch<Order>(`/orders/${id}`)
      .then((data) => setOrder(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id, preloaded]);

  if (loading) return <p className="loading">Loading order...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="error">Order not found.</p>;

  return (
    <div className="order-confirmation">
      <h1>Thank you for your order!</h1>
      <p className="confirmation-number">
        Confirmation: <strong>{order.confirmationNumber}</strong>
      </p>
      <div className="order-details">
        <h2>Order #{order.id}</h2>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Placed:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Shipping to:</strong> {order.shippingAddress}</p>

        <h3>Items</h3>
        <ul className="order-items">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.productName} × {item.quantity} — ${item.lineTotal.toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="order-total">
          <strong>Total: ${order.total.toFixed(2)}</strong>
        </p>
      </div>
      <div className="confirmation-links">
        <Link to="/orders" className="primary-btn">View order history</Link>
        <Link to="/" className="browse-link">Continue shopping</Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
