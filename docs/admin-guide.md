# Admin Guide — Buckeye Marketplace

Admin features cover **product management** and **order management**.
Every admin action is protected on the server with
`[Authorize(Roles = "Admin")]`.

> **Test admin login:** `admin@buckeye.test` / `Admin123!`

## Sign in as an admin

Use the regular **Login** page with the admin credentials. You'll see
an **Admin** link in the header that opens `/admin`.

## Manage products

Visit `/admin/products`.

- **Add:** click **+ New Product**, fill in title, description, price,
  category, seller name, image URL, then **Save**. The product
  appears in the catalog immediately.
- **Edit:** click **Edit** on any row, change fields, **Save**. Past
  orders are unaffected — `OrderItem` rows snapshot product name,
  unit price, and line total at order time.
- **Delete:** click **Delete** and confirm. Past orders that
  referenced the product remain intact thanks to those snapshots.

Validation: price must be greater than zero; title and image URL are
required.

## Update an order's status

Visit `/admin/orders` to see every order in the system —
confirmation number, customer email, date, total, current status.

Use the **Status** drop-down on a row to change the order:
`Pending` → `Processing` → `Shipped` → `Delivered`. Any state can
move to `Cancelled`. The change saves immediately
(`PUT /api/orders/{id}/status`); the customer sees the new status
the next time they refresh `/orders`.
