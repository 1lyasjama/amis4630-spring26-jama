import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import ProductList from "../components/ProductList";

const API_BASE = "http://localhost:5023/api";

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="catalog-page">
      <h1>Buckeye Marketplace</h1>
      <p className="catalog-subtitle">Browse items for sale by OSU students</p>
      <ProductList products={products} />
    </div>
  );
}

export default CatalogPage;
