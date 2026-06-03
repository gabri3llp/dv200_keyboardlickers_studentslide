/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const normaliseCartItem = (listing) => ({
  id: listing._id || listing.id,
  title: listing.title,
  category: listing.category,
  price: Number(listing.price) || 0,
  image: listing.image || listing.img,
  sellerName: listing.sellerName || 'Student seller',
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToCart = useCallback((listing) => {
    const item = normaliseCartItem(listing);

    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });

    setDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;

    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      drawerOpen,
      setDrawerOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [addToCart, cartCount, cartItems, cartTotal, clearCart, drawerOpen, removeFromCart, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
