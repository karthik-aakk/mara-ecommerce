"use client";

import { CartProvider } from "./context/CartContext";
import CartPopup from "./components/CartPopup";
import CartButton from "./components/CartButton";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      <html lang="en">
        <body>
          {/* Track Orders Button */}
          <Link href="/user/orders">
            <button className="fixed top-4 left-4 bg-green-500 text-white p-2 rounded">
              📦 Track Orders
            </button>
          </Link>

          {/* Cart System */}
          <CartButton />
          <CartPopup />

          {/* Page Content */}
          {children}
        </body>
      </html>
    </CartProvider>
  );
}
