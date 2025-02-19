"use client";

import { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Ensures this runs only in the client
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!isClient) return; // Prevents execution on the server

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is an admin
      if (user.email === "admin@123.com") {
        router.push("/admin/dashboard"); // Redirect to admin panel
      } else {
        alert("Access Denied! You are not an admin.");
      }
    } catch (error) {
      alert("Login failed! " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-500 text-white p-2 rounded mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
