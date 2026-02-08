"use client";
import {load} from "@cashfreepayments/cashfree-js"
import axios from "axios";
import { useState , useRef , useEffect } from "react";

export default function OrderPlacedForm({ onClose , amount , bookscarts}) {
    const [paymentdata , setpaymentdata] = useState({
        fullName:"",
        email:"",
        phone:"",
        Address:"",
        BuildingName:""

    })

    const handleChange = (e) => {
        const {name , value} = e.target
        setpaymentdata((prev) => ({...prev , [name]:value}))
    }
    const cashfreeRef = useRef(null);
     useEffect(() => { load({ mode: "sandbox" }).then((cf) => { cashfreeRef.current = cf; }); }, []);
      const handlePayment = async (e) => { 
        e.preventDefault()
        if (!cashfreeRef.current) 
            return alert("SDK not loaded"); 
        const res = await axios.post("http://localhost:4000/api/create-order", { bookscarts ,  paymentdata},{
            withCredentials:true
        }); const { payment_session_id } = res.data; cashfreeRef.current.checkout({ paymentSessionId: payment_session_id, redirectTarget: "_modal" }); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></div>

      {/* MODAL */}
      <form className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 z-10">
        
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={() => onClose(false)}
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold text-center">Place Your Order</h1>

        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            onChange={handleChange}
            name="fullName"
            value={paymentdata.fullName}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            onChange={handleChange}
            name="email"
            value={paymentdata.email}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            onChange={handleChange}
            value={paymentdata.phone}
            name="phone"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Address</label>
          <input
            type="text"
            onChange={handleChange}
            value={paymentdata.Address}
            name="Address"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Building Name</label>
          <input
            type="text"
            onChange={handleChange}
            name="BuildingName"
            value={paymentdata.BuildingName}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <h1>Total : {amount}</h1>
        

        <button
          type="submit"
          onClick={handlePayment}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
}
