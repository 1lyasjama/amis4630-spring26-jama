import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProduct } from "../services/productService";

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { addToCart, state } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getProduct(Number(id))
      .then((data) => setProduct(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${product.id}` } });
      return;
    }
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
  };

  if (loading) return <p className="loading">Loading product...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!product) return <p className="error">Product not found.</p>;

  const formattedDate = new Date(product.postedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">&larr; Back to listings</Link>
      <div className="product-detail-content">
        <img src={product.imageUrl} alt={product.title} className="product-detail-image" />
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <span className="product-detail-category">{product.category}</span>
          <p className="product-detail-description">{product.description}</p>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Adding..." : isAuthenticated ? "Add to Cart" : "Sign in to add to cart"}
          </button>
          {state.successMessage && (
            <p className="success-message">{state.successMessage}</p>
          )}
          <div className="product-detail-meta">
            <p><strong>Seller:</strong> {product.sellerName}</p>
            <p><strong>Posted:</strong> {formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
