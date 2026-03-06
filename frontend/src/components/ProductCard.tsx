import { Link } from "react-router-dom";
import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.imageUrl} alt={product.title} className="product-card-image" />
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        <span className="product-card-category">{product.category}</span>
        <p className="product-card-seller">Sold by {product.sellerName}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
