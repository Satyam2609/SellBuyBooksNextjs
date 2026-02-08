"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    avatar: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      setFormData((prev) => ({ ...prev, avatar: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All required fields must be filled");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const res = await fetch("http://localhost:4000/api/Signup", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Signup failed");
      }

      router.push("/Register/login"); // success ke baad redirect

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex md:flex-row-reverse items-center justify-center min-h-screen bg-gray-100">
      <div className="hidden lg:flex md:w-8/12 lg:w-6/12">
        <img src="/Image1.svg" alt="signup" />
      </div>

      <div className="w-full md:w-1/2 lg:w-1/3 bg-white shadow-lg p-8 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="h-20 w-20 rounded-full mb-2 object-cover"
              />
            )}
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={formData.password}
            onChange={handleChange}
          />

          <textarea
            name="bio"
            placeholder="Short bio (optional)"
            className="w-full mb-3 px-4 py-2 border rounded"
            value={formData.bio}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/Register/login" className="text-indigo-600">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
