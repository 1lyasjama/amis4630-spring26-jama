import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import type { ProductRequest } from "../services/productService";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";

const empty: ProductRequest = {
  title: "",
  description: "",
  price: 0,
  category: "",
  sellerName: "",
  imageUrl: "",
};

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductRequest>(empty);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setEditingId(null);
    setForm(empty);
  };

  const beginEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      sellerName: product.sellerName,
      imageUrl: product.imageUrl,
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId == null) {
        await createProduct(form);
      } else {
        await updateProduct(editingId, form);
      }
      reset();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Products</h1>

      <form onSubmit={save} className="admin-form" aria-label="product-form">
        <h2>{editingId ? `Edit Product #${editingId}` : "Add Product"}</h2>
        <div className="form-field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="form-field">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="form-field">
          <label>Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        </div>
        <div className="form-field">
          <label>Seller Name</label>
          <input value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} required />
        </div>
        <div className="form-field">
          <label>Image URL</label>
          <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="primary-btn">{editingId ? "Save changes" : "Create product"}</button>
          {editingId && (
            <button type="button" className="secondary-btn" onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Existing Products</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ul className="admin-products">
          {products.map((p) => (
            <li key={p.id} className="admin-product">
              <span className="admin-product-title">{p.title}</span>
              <span className="admin-product-price">${p.price.toFixed(2)}</span>
              <div className="admin-product-actions">
                <button onClick={() => beginEdit(p)}>Edit</button>
                <button onClick={() => remove(p.id)} className="danger-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminProductsPage;
