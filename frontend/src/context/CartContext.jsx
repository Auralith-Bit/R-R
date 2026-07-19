import React, { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, price, qty } = action.payload;
      const lineId = `${product.id}__${size}`;
      const existing = state.items.find((it) => it.lineId === lineId);
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.lineId === lineId ? { ...it, qty: it.qty + qty } : it
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            lineId,
            productId: product.id,
            name: product.name,
            image: product.image,
            size,
            price,
            qty,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((it) => it.lineId !== action.payload) };
    case "INCREASE_QTY":
      return {
        items: state.items.map((it) =>
          it.lineId === action.payload ? { ...it, qty: it.qty + 1 } : it
        ),
      };
    case "DECREASE_QTY":
      return {
        items: state.items
          .map((it) =>
            it.lineId === action.payload ? { ...it, qty: it.qty - 1 } : it
          )
          .filter((it) => it.qty > 0),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const value = useMemo(() => {
    const totalCount = state.items.reduce((sum, it) => sum + it.qty, 0);
    const subtotal = state.items.reduce(
      (sum, it) => sum + it.qty * it.price,
      0
    );

    return {
      items: state.items,
      totalCount,
      subtotal,
      addItem: (product, size, price, qty = 1) =>
        dispatch({ type: "ADD_ITEM", payload: { product, size, price, qty } }),
      removeItem: (lineId) => dispatch({ type: "REMOVE_ITEM", payload: lineId }),
      increaseQty: (lineId) => dispatch({ type: "INCREASE_QTY", payload: lineId }),
      decreaseQty: (lineId) => dispatch({ type: "DECREASE_QTY", payload: lineId }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
