"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBagIcon, CheckCircleIcon, Calculator, Beaker, BookOpen, GraduationCap, Ghost, Search } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Suspense } from "react";

const CATEGORIES = [
    { id: "medical", name: "Medical", icon: Beaker, color: "from-blue-500 to-cyan-500" },
    { id: "engineering", name: "Engineering", icon: GraduationCap, color: "from-green-500 to-emerald-500" },
    { id: "comedy", name: "Comedy", icon: Ghost, color: "from-purple-500 to-pink-500" },
    { id: "fantasy", name: "Fantasy", icon: BookOpen, color: "from-pink-500 to-rose-500" },
    { id: "all", name: "All Books", icon: Search, color: "from-orange-500 to-red-500" },
];

function CategoriesContent() {
    const searchParams = useSearchParams();
    const initialCat = searchParams.get("cat") || "medical";
    const [selectedCategory, setSelectedCategory] = useState(initialCat);
    const [booksData, setBooksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const { setcount } = useAuth();

    useEffect(() => {
        const cat = searchParams.get("cat");
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const query = selectedCategory === "all" ? "" : selectedCategory;
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/searchBooks?q=${query}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setBooksData(res.data.results || []);
                }
            } catch (error) {
                console.error("Error fetching books:", error.message);
                setBooksData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [selectedCategory]);

    const addToCart = async (bookId) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BOOK_URL}/api/createdCart`,
                { bookId, quantity: 1 },
                { withCredentials: true }
            );
            setcount((prev) => prev + 1);
            setPopup(true);
            setTimeout(() => setPopup(false), 2000);
        } catch (error) {
            console.log("Error adding to cart:", error.message);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />

            <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-4">
                        Explore by Category
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Find the perfect book for your next adventure or study session. Select a category to get started.
                    </p>
                </div>

                {/* Category Switcher */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`
                  flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${isActive
                                        ? `bg-green-400`
                                        : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"}
                `}
                            >
                                <Icon size={20} />
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Book Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {booksData.map((book) => (
                                <div
                                    key={book._id}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img
                                            src={book.image || book.bookImage}
                                            alt={book.title}
                                            className="w-full h-full object-cover "
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <button
                                                onClick={() => addToCart(book._id)}
                                                className="w-full bg-white text-gray-900 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-500 hover:text-white transition-colors"
                                            >
                                                <ShoppingBagIcon size={18} />
                                                Add to Cart
                                            </button>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${book.condition === "New" || book.condition === "Like New" || book.condition === "NEW" || book.condition === "GOOD"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                                }`}>
                                                {book.condition}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Container */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{book.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{book.author || book.brandName}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-black text-green-600">₹{book.originalPrice || book.discountPrice}</span>
                                            <button
                                                onClick={() => addToCart(book._id)}
                                                className="p-2 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors sm:hidden"
                                            >
                                                <ShoppingBagIcon size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {booksData.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-400 text-xl font-medium">No books found in this category yet.</p>
                            </div>
                        )}
                    </>
                )}

            </main>

            <Footer />

            {/* TOAST */}
            <div
                className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${popup ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-3 bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
                    <div className="bg-green-500 rounded-full p-1">
                        <CheckCircleIcon size={20} className="text-white" />
                    </div>
                    <p className="font-semibold text-sm">Added to your cart!</p>
                </div>
            </div>
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        }>
            <CategoriesContent />
        </Suspense>
    );
}
