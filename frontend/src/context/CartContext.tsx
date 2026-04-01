import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Cart, CartItem } from "../types/Cart";
import * as cartService from "../services/cartService";

// State shape
interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Actions
type CartAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Cart }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SET_SUCCESS"; payload: string }
  | { type: "CLEAR_MESSAGE" }
  | { type: "OPTIMISTIC_REMOVE"; payload: number }
  | { type: "OPTIMISTIC_CLEAR" }
  | { type: "OPTIMISTIC_UPDATE_QTY"; payload: { id: number; quantity: number } };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  total: 0,
  loading: true,
  error: null,
  successMessage: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        subtotal: action.payload.subtotal,
        total: action.payload.total,
        loading: false,
        error: null,
      };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_SUCCESS":
      return { ...state, successMessage: action.payload };

    case "CLEAR_MESSAGE":
      return { ...state, successMessage: null, error: null };

    case "OPTIMISTIC_REMOVE": {
      const filtered = state.items.filter((i) => i.id !== action.payload);
      const subtotal = filtered.reduce((sum, i) => sum + i.lineTotal, 0);
      return {
        ...state,
        items: filtered,
        totalItems: filtered.reduce((sum, i) => sum + i.quantity, 0),
        subtotal,
        total: subtotal,
      };
    }

    case "OPTIMISTIC_CLEAR":
      return { ...state, items: [], totalItems: 0, subtotal: 0, total: 0 };

    case "OPTIMISTIC_UPDATE_QTY": {
      const updated = state.items.map((i) =>
        i.id === action.payload.id
          ? {
              ...i,
              quantity: action.payload.quantity,
              lineTotal: i.price * action.payload.quantity,
            }
          : i
      );
      const sub = updated.reduce((sum, i) => sum + i.lineTotal, 0);
      return {
        ...state,
        items: updated,
        totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: sub,
        total: sub,
      };
    }

    default:
      return state;
  }
}

// Context value
interface CartContextValue {
  state: CartState;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearMessage: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const cart = await cartService.getCart();
      dispatch({ type: "FETCH_SUCCESS", payload: cart });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err.message : "Failed to load cart",
      });
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Auto-clear success messages after 3 seconds
  useEffect(() => {
    if (state.successMessage) {
      const timer = setTimeout(() => dispatch({ type: "CLEAR_MESSAGE" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.successMessage]);

  const addToCart = useCallback(
    async (productId: number, quantity: number = 1) => {
      try {
        await cartService.addToCart({ productId, quantity });
        dispatch({ type: "SET_SUCCESS", payload: "Item added to cart!" });
        await refreshCart();
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err.message : "Failed to add item",
        });
      }
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      if (quantity < 1) return;
      dispatch({ type: "OPTIMISTIC_UPDATE_QTY", payload: { id: cartItemId, quantity } });
      try {
        await cartService.updateCartItem(cartItemId, { quantity });
        dispatch({ type: "SET_SUCCESS", payload: "Quantity updated" });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err.message : "Failed to update quantity",
        });
        await refreshCart();
      }
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (cartItemId: number) => {
      dispatch({ type: "OPTIMISTIC_REMOVE", payload: cartItemId });
      try {
        await cartService.removeCartItem(cartItemId);
        dispatch({ type: "SET_SUCCESS", payload: "Item removed from cart" });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err.message : "Failed to remove item",
        });
        await refreshCart();
      }
    },
    [refreshCart]
  );

  const clearCartAction = useCallback(async () => {
    dispatch({ type: "OPTIMISTIC_CLEAR" });
    try {
      await cartService.clearCart();
      dispatch({ type: "SET_SUCCESS", payload: "Cart cleared" });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err.message : "Failed to clear cart",
      });
      await refreshCart();
    }
  }, [refreshCart]);

  const clearMessage = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGE" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartAction,
        refreshCart,
        clearMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
