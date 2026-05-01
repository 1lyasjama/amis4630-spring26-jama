# User Guide — Buckeye Marketplace

A safe place for OSU students to buy and sell. This guide walks
through the five things a shopper does on the site.

> **Live site:** `https://buckeye-frontend-jama.azurewebsites.net`
> **Test login:** `user@buckeye.test` / `User1234!`

## 1. Browse products

Open the site. The catalog shows every listing as a card — title,
price, category, seller. No login is needed to look around. Click any
card to open the **product detail page** with the full description.

![Product list](screenshots/Buckeye%20Product%20List.png)

![Product detail](screenshots/Buckeye%20Product%20Detail.png)

## 2. Create an account and log in

Click **Register** in the header. Enter an email and a password
(minimum 8 characters with one uppercase letter and one digit). On
success you're signed in automatically and your name appears in the
header. Returning users click **Login** instead and use the email +
password they registered with.

## 3. Add items to your cart

From either the catalog or a product detail page, click **Add to
Cart**. The cart-count badge in the header increments. You can add the
same item more than once; quantity is tracked per line.

Click the cart icon to open `/cart`. Each line item shows the unit
price, a quantity control, and a remove button. The order summary on
the right keeps the total live.

## 4. Place an order

From the cart click **Proceed to Checkout**. On `/checkout`:

1. Review the order summary on the right.
2. Fill in the shipping address.
3. Click **Place Order**.

You'll land on an **Order Confirmation** page that shows the
confirmation number, total, and shipping address. Behind the scenes
your cart is cleared and the line items are snapshotted into the order
record.

## 5. View your order history

Click **Order History** in the header (or visit `/orders`). You'll
see every order you've placed — confirmation number, date, total,
status (`Pending` / `Processing` / `Shipped` / `Delivered` /
`Cancelled`), and items. Order history is scoped to your account; you
will only ever see your own orders.

To sign out, click **Logout** in the header. Your tokens are removed
from the browser and you're returned to the catalog as a guest.
