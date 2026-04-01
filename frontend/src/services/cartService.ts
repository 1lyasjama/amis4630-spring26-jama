import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from "../types/Cart";

const API_BASE = "http://localhost:5023/api";

export async function getCart(): Promise<Cart> {
  const res = await fetch(`${API_BASE}/cart`);

  // 404 means no cart exists yet — return empty cart
  if (res.status === 404) {
    return {
      id: 0,
      userId: "",
      items: [],
      totalItems: 0,
      subtotal: 0,
      total: 0,
      createdAt: "",
      updatedAt: "",
    };
  }

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(request: AddToCartRequest): Promise<CartItem> {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to add item to cart");
  }

  return res.json();
}

export async function updateCartItem(
  cartItemId: number,
  request: UpdateCartItemRequest
): Promise<CartItem> {
  const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove cart item");
}

export async function clearCart(): Promise<void> {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to clear cart");
}
