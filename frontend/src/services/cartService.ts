import { apiFetch } from "./api";
import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from "../types/Cart";

export function getCart() {
  return apiFetch<Cart>("/cart");
}

export function addToCart(request: AddToCartRequest) {
  return apiFetch<CartItem>("/cart", { method: "POST", body: request });
}

export function updateCartItem(cartItemId: number, request: UpdateCartItemRequest) {
  return apiFetch<CartItem>(`/cart/${cartItemId}`, { method: "PUT", body: request });
}

export function removeCartItem(cartItemId: number) {
  return apiFetch<void>(`/cart/${cartItemId}`, { method: "DELETE" });
}

export function clearCart() {
  return apiFetch<void>("/cart/clear", { method: "DELETE" });
}
