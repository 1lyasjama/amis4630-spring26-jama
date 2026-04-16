import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import ProductList from "../components/ProductList";
import { getProducts } from "../services/productService";

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to fetch products"))
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
