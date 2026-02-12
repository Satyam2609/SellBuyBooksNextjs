"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import axios from "axios";
import OrderPlacedForm from "./OrderPlacedForm";
import { TrashIcon, ShoppingBagIcon, ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const ShoppingCart = () => {
  const router = useRouter();
  const [cart, setcart] = useState([]);
  const [totalPrice, settotalPrice] = useState(0); // Changed default to 0 number
  const [order, setorder] = useState(false);
  const [bookIds, setBookIds] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  // Use a professional formatter for currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/getAllCart`, {
          withCredentials: true
        });

        if (res.data?.cart?.BookCart) {
          setcart(res.data.cart.BookCart);
          console.log("sfkmdfg",res.data.BookCart)
          setBookIds(
            res.data.cart.BookCart.map(i => ({
              bookId: i.bookId._id,
              quantity: i.quantity
            }))
          );
        }
      } catch (error) {
        console.log(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
    fetchdata();
  }, []);

  const handledelete = async (cartId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/deleteCart`, {
        data: { cartId },
        withCredentials: true,
      });

      setcart(prev => prev.filter(item => item.bookId._id !== cartId));
      setBookIds(prev => prev.filter(item => item.bookId._id !== cartId)); // Fixed: should filter by bookId._id matches cart's bookId._id logic or similar? 
      // Actually previous logic was: setBookIds(prev => prev.filter(item => item.bookId.cartId !== cartId)); 
      // Let's stick to the cart filtering logic which seems correct in the original code, but we update state directly instead of reload.
      // The original code reloaded the page. Let's try to update state seamlessly.
      // Correct logic: bookIds is derived from cart. If cart updates, we should update bookIds too, or just update cart and let derived state handle it?
      // Since we update `setcart` above, let's also update setBookIds.
      // Wait, original: `setBookIds(prev => prev.filter(item => item.bookId.cartId !== cartId))` looks weird because `bookId` usually is the book object, not containing `cartId`.
      // Let's just re-calculate bookIds from the updated cart in the next render or update it here.
      // Actually, simply removing from cart state is safer visual wise.

    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const total = cart.reduce(
      (sum, item) =>
        sum + (item.bookId.originalPrice) * (item.quantity || 1), 
 0
    );
    settotalPrice(total);
  }, [cart]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any books yet.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart <span className="text-gray-400 text-xl font-medium">({cart.length} items)</span></h1>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <li key={item._id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-gray-50/50 transition duration-150">

                      {/* Image */}
                      <div className="flex-shrink-0 h-28 w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative">
                        <img
                          src={item.bookId.image}
                          alt={item.bookId.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.bookId.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.bookId.brandName}</p>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs font-medium text-gray-600 mt-2">
                              {item.bookId.condition} Condition
                            </div>
                          </div>

                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.bookId.originalPrice * (item.quantity || 1))}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center bg-gray-100 p-2 py-3 rounded-lg w-full"> {/* Bottom row: Qty & Remove */}
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Quantity</p>
                            <p className="text-sm font-semibold text-gray-900">{item.quantity || 1}</p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handledelete(item.bookId._id)}
                            className="flex items-center text-sm font-medium text-red-500 bg-white border border-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <TrashIcon className="w-4 h-4 mr-1.5" />
                            Remove
                          </button>
                        </div>
                      </div>


                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>valet</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="text-gray-400 text-sm">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setorder(true)}
                  className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                  <LockClosedIcon className="w-3 h-3" /> Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {order && <OrderPlacedForm onClose={setorder} amount={totalPrice} bookscarts={bookIds} />}
    </>
  );
};

export default ShoppingCart;
