"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const SellOld = () => {
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    bookimage: null,
    condition: "new",
    category: "",
  });
  const [loader , setloader] = useState(false)

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    setBookDetails((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    if (type === "file" && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true)

    try {
      const formData = new FormData();
      formData.append("title", bookDetails.title);
      formData.append("author", bookDetails.author);
      formData.append("price", bookDetails.price);
      formData.append("description", bookDetails.description);
      formData.append("condition", bookDetails.condition);
      formData.append("category", bookDetails.category);
      formData.append("bookimage", bookDetails.bookimage);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BOOK_URL}/api/sellBook`,
        formData,
        { withCredentials: true }
      )

      // Reset form
      setBookDetails({
        title: "",
        author: "",
        price: "",
        description: "",
        bookimage: null,
        condition: "new",
        category: "",
      });
      setloader(false)
      setImagePreview(null);
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
      setloader(false)
    }
    finally{
      setloader(false)
    }
  };

  const removeBook = (id) => {
    setAddedBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📚 Sell / Exchange Your Books
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">Add Book Details</h2>

          <input
            className="input-ui"
            name="title"
            placeholder="Book Title"
            value={bookDetails.title}
            onChange={handleInputChange}
            required
          />
          <input
            className="input-ui"
            name="author"
            placeholder="Author Name"
            value={bookDetails.author}
            onChange={handleInputChange}
            required
          />
          <input
            className="input-ui"
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={bookDetails.price}
            onChange={handleInputChange}
            required
          />

          <select
            className="input-ui"
            name="category"
            value={bookDetails.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="fiction">Fiction</option>
            <option value="academic">Academic</option>
            <option value="children">Children</option>
          </select>

          <select
            className="input-ui"
            name="condition"
            value={bookDetails.condition}
            onChange={handleInputChange}
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            name="bookimage"
            className="text-sm"
            required
          />

          {imagePreview && (
            <div className="flex justify-center">
              <Image
                src={imagePreview}
                alt="Preview"
                width={140}
                height={180}
                className="rounded-xl shadow-md"
              />
            </div>
          )}

          <textarea
            className="input-ui h-28"
            name="description"
            placeholder="Book Description"
            value={bookDetails.description}
            onChange={handleInputChange}
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold">
            {loader ? <ClipLoader size={20} className="animate-spin"/> : "Add Book"}
          </button>
        </form>

        {/* BOOK LIST */}
        
      </div>

      <style jsx>{`
        .input-ui {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          outline: none;
        }
        .input-ui:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }
      `}</style>
    </div>
  );
};

export default SellOld;
