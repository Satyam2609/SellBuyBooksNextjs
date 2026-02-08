"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import axios from "axios";
import OrderPlacedForm from "./OrderPlacedForm";

const ShoppingCart = () => {
  const router = useRouter();
  const [cart , setcart] = useState([])
  const [totalPrice , settotalPrice] = useState("")
  const [order , setorder] = useState(false)
  const [bookIds, setBookIds] = useState([]);
  const [deletecart , setdeletecart] = useState("")


  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.discountedPrice * (item.quantity || 1),
      0
    );
  };

  useEffect(() => {
    const fetchdata = async() => {
      try {
        const res = await axios.get("http://localhost:4000/api/getAllCart" , {
          withCredentials:true
        })
        setcart(res.data.cart.BookCart)
       console.log(
  res.data.cart.BookCart.map(i => ({
    bookId: i.bookId._id,
    quantity: i.quantity
  }))
);

        setBookIds(
  res.data.cart.BookCart.map(i => ({
    bookId: i.bookId._id,
    quantity: i.quantity
  }))
);


        
      } catch (error) {
        console.log(error.response?.data?.message)
        
      }
    }
    fetchdata()
  } , [])

  const handledelete = async (cartId) => {
  try {
    await axios.delete("http://localhost:4000/api/deleteCart", {
      data: { cartId },
      withCredentials: true,
    });

    setcart(prev => prev.filter(item => item.bookId._id !== cartId));

    setBookIds(prev => prev.filter(item => item.bookId.cartId !== cartId));
    router.reload()


  } catch (error) {
    console.log(error.response?.data?.message);
  }
};

  
    useEffect(() => {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.bookId.originalPrice * item.quantity,
    0
  );

  settotalPrice(total);
}, [cart]);


  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛒</h2>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="container flex mx-auto gap-5 p-4">
      {/* Cart Items */}
      <div className="space-y-4 w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.bookId.image}
                alt={item.bookId.title}
                className="w-20 h-20 object-cover rounded"
                
              />

              <div>
                <h2 className="font-semibold">{item.bookId.title}</h2>
                <h1>{item.bookId.brandName}</h1>
                <p className="text-sm text-gray-600">
                  ₹{item.bookId.originalPrice} × {item.quantity || 1}
                 
                </p>
              </div>
            </div>

            <div className="font-semibold">
               <button onClick={() => handledelete(item.bookId._id)} className="mb-5 flex w-10 justify-end">X</button>
              <div>
              ₹{item.bookId.originalPrice * (item.quantity || 1)}
              </div>

              
               <p>{item.bookId.condition}</p>
              
            </div>
          </div>
        ))}

        <div className="mt-8 flex justify-between items-center border-t pt-6">
        <h2 className="text-xl font-semibold">
          Total: ₹{totalPrice}
        </h2>

        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded"
        >
          Continue Shopping
        </button>
      </div>
      </div>
<div className="w-full max-w-md mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl p-8 flex flex-col gap-4">
  <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
  
  <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
    <span className="text-gray-700 font-medium">Total Items:</span>
    <span className="text-gray-900 font-semibold">{cart.length}</span>
  </div>
  
  <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
    <span className="text-gray-700 font-medium">Total Price:</span>
    <span className="text-green-600 font-bold text-lg">₹{totalPrice}</span>
  </div>
  
  <button onClick={() => setorder(true)} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
    Proceed to Checkout
  </button>
</div>

      
    </div>
    {
      order && <OrderPlacedForm  onClose={setorder} amount={totalPrice} bookscarts={bookIds} />
    }
    </>
  );
};

export default ShoppingCart;
