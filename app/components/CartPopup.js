"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartPopup() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, toggleCart } = useCart();

  return (
    <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={toggleCart} className="text-red-500">✖</button>
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 mt-4">Your cart is empty.</p>
      ) : (
        <ul className="p-4 space-y-2">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">${item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-300 text-black px-2 rounded">-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-300 text-black px-2 rounded">+</button>
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white px-2 rounded ml-2">🗑</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="p-4 border-t">
          <Link href="/user/checkout">
            <button className="w-full bg-blue-500 text-white p-2 rounded">
              Go to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
