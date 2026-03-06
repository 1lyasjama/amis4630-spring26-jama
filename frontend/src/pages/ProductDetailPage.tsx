import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../types/Product";

const API_BASE = "http://localhost:5023/api";

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
