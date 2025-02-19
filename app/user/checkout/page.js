"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { db } from "../../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Ensure this component is only rendered on the client to fix hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod,
        status: "Processing", // Default order status
        timestamp: Timestamp.now(),
      });

      setCart([]); // Clear the cart after order placement
      router.push(`/user/order-confirmation?id=${orderRef.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null; // Prevents rendering until client-side

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Order Summary:</h2>
        {cart.map((item) => (
          <p key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </p>
        ))}
        <p className="font-bold mt-2">
          Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Select Payment Method:</h2>
        <select
          className="border p-2 rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={loading}
        className="bg-green-500 text-white p-2 rounded w-full"
      >
        {loading ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
}
