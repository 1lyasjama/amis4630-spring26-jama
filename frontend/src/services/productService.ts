import { apiFetch } from "./api";
import type { Product } from "../types/Product";

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
  imageUrl: string;
}

export function getProducts() {
  return apiFetch<Product[]>("/products", { auth: false });
}

export function getProduct(id: number) {
  return apiFetch<Product>(`/products/${id}`, { auth: false });
}

export function createProduct(request: ProductRequest) {
  return apiFetch<Product>("/products", { method: "POST", body: request });
}

export function updateProduct(id: number, request: ProductRequest) {
  return apiFetch<Product>(`/products/${id}`, { method: "PUT", body: request });
}

export function deleteProduct(id: number) {
  return apiFetch<void>(`/products/${id}`, { method: "DELETE" });
}
