"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ShoppingBagIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function EnginerringBook() {
  const [booksData, setBooksData] = useState([]);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/engineeringBook`, {
          withCredentials: true,
        });
        setBooksData(res.data.findata);
        console.log(res.data.findata);
      } catch (error) {
        console.log("Error fetching books:", error.response?.data?.message);
      }
    };
    fetchData();
  }, []);

  const addToCart = async (bookId) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BOOK_URL}/api/createdCart`,
        { bookId, quantity: 1 },
        { withCredentials: true }
      );
      console.log("Added to cart", res.data);
      setPopup(true);
    } catch (error) {
      console.log("Error adding to cart:", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  return (
    <section className="bg-gray-50 py-14">
  <div className="max-w-8xl mx-auto px-4 sm:px-6">

    {/* HEADER */}
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Engineering Books
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Hand-picked pre-loved books at the best prices
        </p>
      </div>

      <button className="hidden sm:inline-flex text-sm font-semibold text-green-600 hover:text-green-700">
        View all →
      </button>
    </div>

    {/* BOOKS */}
    <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
      {booksData.map((book) => (
        <div
          key={book._id}
          className="
            snap-start
            min-w-[290px] sm:min-w-[330px]
            bg-white
            rounded-xl
            border border-gray-200
            hover:shadow-lg
            transition
          "
        >

          {/* IMAGE */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gray-100">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />

            {/* CATEGORY */}
            <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 px-2 py-1 rounded">
              {book.category}
            </span>

            {/* ADD TO CART */}
            <button
              onClick={() => addToCart(book._id)}
              className="
                absolute bottom-3 left-3 right-3
                flex items-center justify-center gap-2
                bg-green-600 text-white
                py-2.5 rounded-lg
                text-sm font-medium
                hover:bg-green-700
                transition
              "
            >
              <ShoppingBagIcon className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-green-600 uppercase">
                {book.brandName}
              </p>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  book.condition === "New"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {book.condition}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {book.title}
            </h3>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg font-bold text-gray-900">
                ₹{book.discountPrice}
              </span>

              {book.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{book.originalPrice}
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    {Math.round(
                      ((book.originalPrice - book.discountPrice) /
                        book.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* MOBILE VIEW ALL */}
    <div className="mt-6 text-center sm:hidden">
      <button className="text-sm font-semibold text-green-600">
        View all →
      </button>
    </div>

    {/* TOAST */}
    <div
      className={`fixed bottom-5 right-5 z-50 transition ${
        popup ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl">
        <CheckCircleIcon className="h-5 w-5 text-green-400" />
        <p className="text-sm">Added to cart</p>
      </div>
    </div>

  </div>
</section>

  );
}  