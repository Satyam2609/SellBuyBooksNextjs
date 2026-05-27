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
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, count } = useAuth();


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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all duration-300">
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

            <Link href="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105">
              <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={38}
                  height={38}
                  className="transition-transform duration-500 group-hover:rotate-12"
                />
              </div>
              <span className="hidden sm:block text-2xl font-black tracking-tight bg-gradient-to-r from-green-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                SellBuy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Old Books', href: '/OldBooks' },
                { name: 'Sell Books', href: '/SellOldBook' },
                { name: 'AI Expert', href: '/BookReccomendation' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* SEARCH BAR (Desktop) */}
            <form onSubmit={handleSearch} className="hidden sm:flex relative group">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  block w-full sm:w-48 lg:w-64 pl-4 pr-10 py-2 
                  text-sm text-gray-900 bg-gray-100 
                  border border-transparent rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white
                  hover:bg-gray-200 transition-all duration-200
                "
              />
              <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
            {/* Mobile Search Icon */}
            <button
              className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => setShowSearch(!showSearch)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>


            {/* CART */}
            <Link href="/Cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
              <ShoppingBagIcon className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white shadow-sm">
                  {count}
                </span>
              )}
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
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/Register/login"
                  className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/Register"
                  className="px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-sm transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH BAR (Expandable) */}
        {showSearch && (
          <form onSubmit={handleSearch} className="sm:hidden pb-4 px-2 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <button type="submit" className="absolute bottom-6 right-4 flex items-center text-gray-400">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
        )}

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-gray-100 animate-in slide-in-from-top-2">
            <Link href="/" className="group flex items-center px-4 py-3 text-base font-semibold text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200">
              Home
            </Link>
            <Link href="/Categories" className="group flex items-center px-4 py-3 text-base font-semibold text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200">
              Categories
            </Link>
            <Link href="/OldBooks" className="group flex items-center px-4 py-3 text-base font-semibold text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200">
              Old Books
            </Link>
            <Link href="/SellOldBook" className="group flex items-center px-4 py-3 text-base font-semibold text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200">
              Sell Books
            </Link>
            <Link href="/BookReccomendation" className="group flex items-center px-4 py-3 text-base font-semibold text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200">
              AI Expert
            </Link>

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
