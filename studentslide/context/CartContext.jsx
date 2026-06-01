import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Already in cart — increase quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // New item — add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
    setDrawerOpen(true); // open drawer on add
  }, []);

  /* ── Remove from cart ── */
  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /* ── Update quantity ── */
  const updateQuantity = useCallback((id, qty) => {
    if (qty < 1) return; // prevent zero or negative
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  }, []);

  /* ── Clear cart ── */
  const clearCart = useCallback(() => setCartItems([]), []);

  /* ── Computed values ── */
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const numeric = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
    return sum + numeric * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* useCart — consume cart state anywhere*/

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return ctx;
}