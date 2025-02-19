"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  useEffect(() => {
    if (isClient) {
      const fetchOrders = async () => {
        const querySnapshot = await getDocs(collection(db, "orders"));
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchOrders();
    }
  }, [isClient]);

  if (!isClient) return null; // Prevents rendering until client-side

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className="border p-4 mb-4 rounded">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Total:</strong> ${order.total}</p>

              <h2 className="text-lg font-semibold mt-2">Items:</h2>
              <ul className="list-disc pl-5">
                {order.items.map((item, index) => (
                  <li key={index}>{item.name} - ${item.price} x {item.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
