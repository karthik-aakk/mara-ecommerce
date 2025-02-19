"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "../../context/CartContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  // Filtered products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Our Products</h1>

      {/* Category Filter */}
      <div className="mb-4 flex justify-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((product) => product.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <h2 className="text-lg font-semibold text-center">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
