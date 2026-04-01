import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
    setFeedback("Added!");
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={product.imageUrl} alt={product.title} className="product-card-image" />
        <div className="product-card-body">
          <h3 className="product-card-title">{product.title}</h3>
          <p className="product-card-price">${product.price.toFixed(2)}</p>
          <span className="product-card-category">{product.category}</span>
          <p className="product-card-seller">Sold by {product.sellerName}</p>
        </div>
      </Link>
      <div className="product-card-actions">
        <button
          className="add-to-cart-btn-sm"
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? "Adding..." : feedback || "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
