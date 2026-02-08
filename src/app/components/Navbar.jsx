"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../AuthProvider";
import axios from "axios";
 // ✅ correct Next import

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [users, setUser] = useState(null);
  const router = useRouter();
  const {user} = useAuth()

 console.log(user?.profileImage)

  const logout = async() => {
    try {
      const res = await axios.put("http://localhost:4000/api/logout" , {} , {
        withCredentials:true
      })
      router.push("/Register/login")
      
    } catch (error) {
      console.log("LogOut Error")
    }
  };

  return (
    <header className="bg-white shadow-lg border-gray-400 border-b-2 sticky top-0 z-30">

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            <Link href="/">
              <img src="/logo.png" className="w-12 mr-5"/>
            </Link>

            <nav className="hidden w-full  lg:flex gap-6 text-sm font-medium">
              <Link href="/">Home</Link>
              <Link href="/products">New Arrivals</Link>
              <Link href="/add-books">Exchange Books</Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-9">
            {/* SEARCH */}
            <div className="flex items-center">
              <button onClick={() => setShowSearch(!showSearch)}>
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
              </button>
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search books..."
                  className="ml-2 border rounded px-2 py-1 text-sm"
                />
              )}
            </div>

            {/* CART */}
            <Link href="/Cart" className="flex items-center gap-1">
              <ShoppingBagIcon className="h-6 w-6 text-gray-500" />
              <span className="hidden lg:block text-sm">Cart</span>
            </Link>

            {/* AUTH */}
            {user ? (
              <div className="relative group">
                <img
                  src={user.profileImage}
                  className="h-8 w-8 rounded-full cursor-pointer"
                  alt="profile"
                />

                <div className="absolute right-0 mt-2 w-44 bg-white border shadow rounded hidden group-hover:block">
                  <p className="px-4 py-2 text-sm font-medium">
                    {user.name}
                  </p>

                  <Link
                    href="/Profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/add-books"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Your Books
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/Register/login"
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/Register"
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden py-4 space-y-3">
            <Link href="/" className="block">Home</Link>
            <Link href="/products" className="block">New Arrivals</Link>
            <Link href="/add-books" className="block">Exchange Books</Link>

            {!user && (
              <>
                <Link href="/signin" className="block">Login</Link>
                <Link href="/signup" className="block">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
