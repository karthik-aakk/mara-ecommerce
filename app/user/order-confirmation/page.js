"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (orderDoc.exists()) {
          setOrder(orderDoc.data());
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Order Placed!</h1>
      <p>Order ID: {orderId}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h2 className="text-lg font-semibold mt-4">Items:</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>{item.name} - ${item.price} x {item.quantity}</li>
        ))}
      </ul>

      <p className="font-bold mt-4">Total: ${order.total}</p>
    </div>
  );
}
