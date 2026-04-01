import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Header() {
  const { state } = useCart();

  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          Buckeye Marketplace
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart
            {state.totalItems > 0 && (
              <span className="cart-badge">{state.totalItems}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
