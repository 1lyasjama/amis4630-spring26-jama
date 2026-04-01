import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";

function CartPage() {
  const { state } = useCart();

  if (state.loading) return <p className="loading">Loading cart...</p>;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {state.error && <p className="error">{state.error}</p>}
      {state.successMessage && (
        <p className="success-message">{state.successMessage}</p>
      )}

      {state.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="browse-link">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {state.items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}

export default CartPage;
