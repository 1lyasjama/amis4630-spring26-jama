import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartSummary() {
  const { state, clearCart } = useCart();

  return (
    <div className="cart-summary">
      <h2>Order Summary</h2>
      <div className="summary-row">
        <span>Items ({state.totalItems})</span>
        <span>${state.subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>${state.total.toFixed(2)}</span>
      </div>
      <Link to="/checkout" className="checkout-btn primary-btn">
        Proceed to Checkout
      </Link>
      <button className="clear-cart-btn" onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  );
}

export default CartSummary;
