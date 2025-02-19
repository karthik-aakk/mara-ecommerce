"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Orders</h1>

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

              <h2 className="text-lg font-semibold mt-2">Update Status:</h2>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
