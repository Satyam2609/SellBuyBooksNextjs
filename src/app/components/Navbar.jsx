"use client";

import { useState } from "react";
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const logout = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BOOK_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/Register/login");
    } catch {
      console.log("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                SellBuy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'New Arrivals', href: '/products' },
                { name: 'Exchange Books', href: '/SellOldBook' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-full hover:bg-gray-100 hover:text-green-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* SEARCH BAR (Desktop) */}
            <div className="hidden sm:flex relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search books..."
                className="
                  block w-full sm:w-64 lg:w-80 pl-10 pr-3 py-2 
                  text-sm text-gray-900 bg-gray-50/50 
                  border border-gray-200 rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 
                  hover:bg-white transition-all duration-200
                "
              />
            </div>
            {/* Mobile Search Icon */}
            <button
              className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => setShowSearch(!showSearch)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>


            {/* CART */}
            <Link href="/Cart" className="relative p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors group">
              <ShoppingBagIcon className="h-6 w-6" />
              {/* Optional: Badge could go here */}
              <span className="sr-only">Cart</span>
            </Link>

            {/* AUTH */}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-green-500 transition-all"
                >
                  <img
                    src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                    className="h-9 w-9 rounded-full object-cover shadow-sm bg-gray-100"
                    alt="profile"
                  />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 transform origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    </div>

                    <div className="py-1">
                      <Link href="/Profile" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Profile
                      </Link>
                      <Link href="/add-books" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Your Books
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-50">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/Register/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/Register"
                  className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH BAR (Expandable) */}
        {showSearch && (
          <div className="sm:hidden pb-4 px-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>
        )}

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-100 animate-in slide-in-from-top-2">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-green-600">Home</Link>
            <Link href="/products" className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-green-600">New Arrivals</Link>
            <Link href="/SellOldBook" className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-green-600">Exchange Books</Link>

            {!user && (
              <div className="ml-3 mt-4 flex flex-col gap-2">
                <Link href="/Register/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">Log in</Link>
                <Link href="/Register" className="inline-block w-fit px-5 py-2 text-base font-medium text-white bg-green-600 rounded-full hover:bg-green-700 shadow-sm">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
