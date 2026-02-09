"use client";

import React, { useState } from "react";
import Image from "next/image";

const SellOld = () => {
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    image: null,
    condition: "new",
    category: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [addedBooks, setAddedBooks] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setBookDetails((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = Number(bookDetails.price);
    const discountedPrice = Math.round(price * 0.8);

    setAddedBooks((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: imagePreview,
        title: bookDetails.title,
        author: bookDetails.author,
        price,
        discountedPrice,
        condition: bookDetails.condition,
        category: bookDetails.category,
      },
    ]);

    setBookDetails({
      title: "",
      author: "",
      price: "",
      description: "",
      image: null,
      condition: "new",
      category: "",
    });
    setImagePreview(null);
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

          <input className="input-ui" name="title" placeholder="Book Title" value={bookDetails.title} onChange={handleInputChange} required />
          <input className="input-ui" name="author" placeholder="Author Name" value={bookDetails.author} onChange={handleInputChange} required />
          <input className="input-ui" type="number" name="price" placeholder="Price (₹)" value={bookDetails.price} onChange={handleInputChange} required />

          <select className="input-ui" name="category" value={bookDetails.category} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            <option value="fiction">Fiction</option>
            <option value="academic">Academic</option>
            <option value="children">Children</option>
          </select>

          <select className="input-ui" name="condition" value={bookDetails.condition} onChange={handleInputChange}>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>

          <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" required />

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
            Add Book
          </button>
        </form>

        {/* BOOK LIST */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Listed Books</h2>

          {addedBooks.length === 0 && (
            <p className="text-gray-500 text-sm">No books added yet.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col"
              >
                <div className="flex justify-center">
                  <Image src={book.image} alt={book.title} width={120} height={160} className="rounded-lg" />
                </div>

                <h3 className="font-semibold mt-3 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">{book.author}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-green-600">
                    ₹{book.discountedPrice}
                  </span>
                  <span className="line-through text-gray-400 text-sm">
                    ₹{book.price}
                  </span>
                </div>

                <button
                  onClick={() => removeBook(book.id)}
                  className="mt-3 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tailwind helper */}
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
