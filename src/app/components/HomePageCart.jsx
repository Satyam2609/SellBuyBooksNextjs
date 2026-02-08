"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [booksData, setBooksData] = useState([]);
  const [popup ,setpopup] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/BookData", {
          withCredentials: true,
        });
        setBooksData(res.data.finddata);
        console.log(res.data.finddata);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };
    fetchData();
  }, []);

  const addToCart = async (bookId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/createdCart",
        { bookId, quantity: 1 },
        { withCredentials: true }
      );
      console.log("Added to cart", res.data);
      setpopup(true)
      if(popup){
        setTimeout(() => {
          setpopup(false)
        } , 5000)
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
  if (popup) {
    const timer = setTimeout(() => {
      setpopup(false);
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [popup]);




  return (
    <div className="max-w-9xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">📚 Books</h1>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {booksData.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transition hover:shadow-2xl"
          >
            {/* Image */}
            <div className="h-84 bg-gray-100 relative">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-sm text-gray-500 uppercase tracking-wide">
                {book.brandName}
              </h2>

              <div className="flex items-start justify-between gap-2">
                <h1 className="text-base h-10 font-semibold text-gray-800 line-clamp-2 pr-2">
                  {book.title}
                </h1>
                <div className="flex gap-2">
                  
                <span className="shrink-0 px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600 capitalize">
                  {book.category}
                </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-lg font-bold text-green-600">
                  ₹{book.discountPrice}
                </span>
                <span className=" text-center p-1 text-xs rounded-full bg-gray-200 text-gray-600 capitalize">
                  {book.condition}
                </span>
                <span className="text-sm line-through text-gray-400">
                  ₹{book.originalPrice}
                </span>
              </div>

              <button
                onClick={() => addToCart(book._id)}
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

        {popup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
      ✅ Added to Cart
    </div>
  </div>
)}

      </div>
    </div>
  );
}
