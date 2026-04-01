import type { CartItem } from "../types/Cart";
import { useCart } from "../context/CartContext";

interface CartItemCardProps {
  item: CartItem;
}

function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <img
        src={item.imageUrl || "/placeholder.png"}
        alt={item.productName}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.productName}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-quantity">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= 99}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="cart-item-total">
        <p>${item.lineTotal.toFixed(2)}</p>
      </div>
      <button
        className="cart-item-remove"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.productName}`}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItemCard;
