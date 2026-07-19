import React, { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isWishlisted: (productId) => items.some((it) => it.id === productId),
      toggleWishlist: (product) =>
        setItems((prev) =>
          prev.some((it) => it.id === product.id)
            ? prev.filter((it) => it.id !== product.id)
            : [...prev, product]
        ),
      removeFromWishlist: (productId) =>
        setItems((prev) => prev.filter((it) => it.id !== productId)),
    }),
    [items]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
