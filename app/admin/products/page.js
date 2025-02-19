"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);

      console.log("Uploading image...");
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    }
  };

  const saveProduct = async () => {
    if (!name || !price || !category) {
      alert("Please enter a product name, price, and category.");
      return;
    }

    setLoading(true);
    let imageUrl = editingProduct?.image || "";

    try {
      if (image) {
        console.log("Uploading image...");
        const uploadedUrl = await handleImageUpload(image);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error("Image upload failed");
        }
      }

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          name,
          price: parseFloat(price),
          category,
          image: imageUrl,
        });
        alert("Product updated!");
      } else {
        await addDoc(collection(db, "products"), {
          name,
          price: parseFloat(price),
          category,
          image: imageUrl,
        });
        alert("Product added!");
      }

      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setEditingProduct(null);
      window.location.reload();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    alert("Product deleted!");
    window.location.reload();
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Products</h1>

      {/* Add or Edit Product Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded mr-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 rounded mr-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded mr-2"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          onClick={saveProduct}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select onChange={(e) => setSelectedCategory(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          {[...new Set(products.map((product) => product.category))].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <ul className="mt-4">
        {filteredProducts.map((product) => (
          <li key={product.id} className="border p-2 flex justify-between items-center">
            <div className="flex items-center">
              {product.image && <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mr-2" />}
              <span>{product.name} - ${product.price} ({product.category})</span>
            </div>
            <div>
              <button onClick={() => editProduct(product)} className="bg-yellow-500 text-white p-2 rounded mr-2">
                Edit
              </button>
              <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white p-2 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
