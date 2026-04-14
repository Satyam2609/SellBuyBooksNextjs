"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShoppingBagIcon, CheckCircleIcon, Search, ArrowRight } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const [searchInput, setSearchInput] = useState(query);
    const { setcount } = useAuth();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/searchBooks?q=${encodeURIComponent(query)}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setResults(res.data.results);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
        setSearchInput(query);
    }, [query]);

    const handleNewSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/Search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    const addToCart = async (bookId) => {
        try {
            await axios.post(
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Search Header & Input */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-green-600 rounded-3xl text-white shadow-xl shadow-green-600/20">
                            <Search size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {loading ? "Searching..." : `Results for "${query}"`}
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">
                                {results.length} books match your criteria
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleNewSearch} className="relative w-full md:w-[450px] group">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search for another book..."
                            className="
                w-full pl-6 pr-14 py-4 bg-white border-2 border-transparent rounded-2xl shadow-sm
                text-gray-900 focus:border-green-500 focus:shadow-xl focus:outline-none transition-all duration-300
              "
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gray-900 text-white rounded-xl hover:bg-green-600 transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Finding the best books for you...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {results.map((book) => (
                            <div
                                key={book._id || book.id}
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <button
                                            onClick={() => addToCart(book._id || book.id)}
                                            className="w-full bg-white text-gray-900 py-3 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                        >
                                            <ShoppingBagIcon size={20} />
                                            Add to Cart
                                        </button>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-black text-gray-700 shadow-xl uppercase tracking-wider">
                                            {book.category}
                                        </span>
                                    </div>
                                    {book.source === 'user-listed' && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1.5 rounded-xl bg-green-600 text-white text-[10px] font-black shadow-xl uppercase tracking-wider">
                                                Pre-loved
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-green-600 transition-colors uppercase tracking-tight">{book.title}</h3>
                                    <p className="text-sm text-gray-400 mb-6 truncate font-medium underline decoration-gray-200 underline-offset-4">{book.brandName || book.author || 'Anonymous'}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-2xl font-black text-gray-900">₹{book.discountPrice || book.price}</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${book.condition === "New" || book.condition === "Like New" || book.condition === "NEW"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                            }`}>
                                            {book.condition}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                        <div className="p-8 bg-gray-50 rounded-full w-fit mx-auto mb-6">
                            <Search size={64} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No matching books found</h2>
                        <p className="text-gray-400 max-w-md mx-auto font-medium">We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.</p>
                        <button
                            onClick={() => { setSearchInput(""); router.push("/Search") }}
                            className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </main>

            <Footer />

            {/* TOAST */}
            <div
                className={`fixed bottom-10 right-10 z-50 transition-all duration-500 transform ${popup ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-4 bg-gray-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl border border-white/5">
                    <div className="bg-green-500 rounded-full p-1.5 shadow-lg shadow-green-500/40">
                        <CheckCircleIcon size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-widest">Added to Bag</p>
                        <p className="text-gray-400 text-xs mt-0.5">Your item is ready for checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-400 animate-pulse">Initializing Search...</div>}>
            <SearchResults />
        </Suspense>
    );
}
