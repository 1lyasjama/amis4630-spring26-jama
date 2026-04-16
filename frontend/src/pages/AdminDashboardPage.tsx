import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Manage products and orders.</p>
      <div className="admin-cards">
        <Link to="/admin/products" className="admin-card">
          <h2>Products</h2>
          <p>Add, edit, or delete products.</p>
        </Link>
        <Link to="/admin/orders" className="admin-card">
          <h2>Orders</h2>
          <p>View all orders and update status.</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
