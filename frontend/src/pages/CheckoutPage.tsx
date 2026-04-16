import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

function CheckoutPage() {
  const { state, refreshCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (shippingAddress.trim().length < 5) {
      setError("Please enter a valid shipping address (5+ characters).");
      return;
    }
    if (state.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({ shippingAddress: shippingAddress.trim() });
      await refreshCart();
      navigate(`/orders/confirmation/${order.id}`, { state: { order } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <section className="checkout-summary" aria-label="order-summary">
          <h2>Order Summary</h2>
          <ul className="checkout-items">
            {state.items.map((item) => (
              <li key={item.id} className="checkout-item">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>${item.lineTotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <strong>Total</strong>
            <strong>${state.total.toFixed(2)}</strong>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="checkout-form" aria-label="shipping-form">
          <h2>Shipping Address</h2>
          <div className="form-field">
            <label htmlFor="shipping-address">Address</label>
            <textarea
              id="shipping-address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
              placeholder="123 Main Street, Columbus, OH 43210"
            />
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
