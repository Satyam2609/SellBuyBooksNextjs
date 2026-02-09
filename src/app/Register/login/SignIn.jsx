"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios"


export default function Signin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BOOK_URL}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      // ✅ success → redirect
      router.push("/");
    } catch (err) {
      if (err.response?.data) {
        setError(
          err.response.data.error ||
            err.response.data.message ||
            "Login failed"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Left Image */}
      <div className="hidden  lg:flex w-6/12 justify-center">
        <img src="/Image1.svg" alt="signin illustration" priority />
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border-2 text-black border-black rounded focus:outline-none focus:border-black"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Password */}
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            <img
              src={showPassword ? "/Eye.png" : "/Eye2.png"}
              alt="toggle password"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              width={24}
              height={24}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Signup */}
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
