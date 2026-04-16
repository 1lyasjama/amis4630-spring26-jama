import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { state } = useCart();
  const { isAuthenticated, isAdmin, state: authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          Buckeye Marketplace
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Products</Link>
          {isAuthenticated && (
            <>
              <Link to="/cart" className="nav-link cart-link">
                Cart
                {state.totalItems > 0 && (
                  <span className="cart-badge">{state.totalItems}</span>
                )}
              </Link>
              <Link to="/orders" className="nav-link">Orders</Link>
            </>
          )}
          {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
          {isAuthenticated ? (
            <>
              <span className="nav-user">{authState.user?.email}</span>
              <button onClick={handleLogout} className="nav-link link-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign in</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
