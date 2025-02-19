"use client";

import { useCart } from "../context/CartContext";

export default function CartButton() {
  const { toggleCart, cart } = useCart();

  return (
    <button onClick={toggleCart} className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-full">
      🛒 {cart.length}
    </button>
  );
}
