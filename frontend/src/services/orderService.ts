import { apiFetch } from "./api";
import type { Order, CreateOrderRequest } from "../types/Order";

export function createOrder(request: CreateOrderRequest) {
  return apiFetch<Order>("/orders", { method: "POST", body: request });
}

export function getMyOrders() {
  return apiFetch<Order[]>("/orders/mine");
}

export function getAllOrders() {
  return apiFetch<Order[]>("/orders");
}

export function updateOrderStatus(orderId: number, status: string) {
  return apiFetch<Order>(`/orders/${orderId}/status`, {
    method: "PUT",
    body: { status },
  });
}
