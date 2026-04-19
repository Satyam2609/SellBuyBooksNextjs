"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    PaperAirplaneIcon,
    SparklesIcon,
    UserIcon,
    ShoppingBagIcon,
    BookOpenIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../AuthProvider";
import OrderPlacedForm from "../Cart/OrderPlacedForm";

export default function AiReccomendation() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I'm your AI Book Assistant. Tell me a subject or interest, and I'll find the perfect books for you!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const { setcount } = useAuth();
    
    // UI States
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderInfo, setOrderInfo] = useState({ amount: 0, bookIds: [] });
    const [addedToast, setAddedToast] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addToCart = async (bookId) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BOOK_URL}/api/createdCart`,
                { bookId, quantity: 1 },
                { withCredentials: true }
            );
            setcount((prev) => prev + 1);
            setAddedToast(true);
            setTimeout(() => setAddedToast(false), 3000);
        } catch (error) {
            console.error("Cart error:", error);
            alert("Please login to add books to cart");
        }
    };

    const handleBuyNow = (book) => {
        // Handle price if it's a string (AI) or number (DB)
        const purePrice = typeof book.price === 'string' 
            ? book.price.replace(/[^0-9]/g, '') 
            : book.price;
            
        setOrderInfo({
            amount: purePrice,
            bookIds: [{ bookId: book.dbId || book._id, quantity: 1 }]
        });
        setShowOrderModal(true);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/bookPredict`, {
                text: input,
            });

            if (response.data.success) {
                const recommendations = response.data.recommendation;
                const databaseBooks = response.data.databaseBooks;
                const aiMessage = {
                    role: "assistant",
                    content: "I found some great recommendations for you!",
                    recommendations: recommendations,
                    databaseBooks: databaseBooks
                };
                setMessages((prev) => [...prev, aiMessage]);
                console.log("Response:", aiMessage);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "Sorry, I couldn't find any recommendations for that. Try another topic!" },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops! Something went wrong. Please try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] sm:max-w-[70%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-green-600" : "bg-white border border-gray-200 shadow-sm"
                                }`}>
                                {msg.role === "user" ? (
                                    <UserIcon className="h-6 w-6 text-white" />
                                ) : (
                                    <SparklesIcon className="h-6 w-6 text-green-600" />
                                )}
                            </div>

                            {/* Message Content */}
                            <div className="space-y-4">
                                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === "user"
                                        ? "bg-green-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                    }`}>
                                    <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>
                                </div>

                                {/* Unified Recommendations & Store Section */}
                                {(msg.recommendations || (msg.databaseBooks && msg.databaseBooks.length > 0)) && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <SparklesIcon className="h-5 w-5 text-green-500" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Personalized Results</span>
                                            </div>
                                            <div className="flex gap-2">
                                               <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                                                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Available with Us
                                               </span>
                                               <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                                                   <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Global Recommend
                                               </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* AI Recommendations */}
                                            {msg.recommendations && Object.entries(msg.recommendations).map(([level, book]) => (
                                                <div key={level} className={`relative bg-white rounded-2xl border ${book.isLocal ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'} shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                                                    <div className="relative aspect-[3/4] bg-gray-50">
                                                        {book.image ? (
                                                            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                                <BookOpenIcon className="h-12 w-12" />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Status Badges */}
                                                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm ${
                                                                level === 'beginner' ? 'bg-blue-100 text-blue-700' :
                                                                level === 'advanced' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-orange-100 text-orange-700'
                                                            }`}>
                                                                {level}
                                                            </span>
                                                            {book.isLocal && (
                                                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-green-600 text-white shadow-md animate-pulse">
                                                                    Apne Pass Hai
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="p-5">
                                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{book.title}</h3>
                                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2rem] leading-relaxed">
                                                            {book.description}
                                                        </p>
                                                        
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                            <div>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Current Price</p>
                                                                <p className="text-sm font-black text-gray-900">{book.price}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Status</p>
                                                                <p className={`text-[11px] font-bold ${book.isLocal ? 'text-green-600' : 'text-blue-500'}`}>
                                                                    {book.isLocal ? 'Verified Stock' : 'Market Available'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-[10px] text-gray-400 mt-2">
                                                            Available: <span className={book.isLocal ? "text-green-600 font-bold" : ""}>{book.availableAt}</span>
                                                        </p>
                                                    </div>
                                                    
                                                    {book.isLocal ? (
                                                        <div className="flex gap-2 mt-4 px-5 pb-5">
                                                            <button
                                                                onClick={() => addToCart(book.dbId)}
                                                                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-bold hover:bg-gray-800 transition flex items-center justify-center gap-1.5 shadow-sm"
                                                            >
                                                                <ShoppingBagIcon className="h-3.5 w-3.5" />
                                                                + Cart
                                                            </button>
                                                            <button
                                                                onClick={() => handleBuyNow(book)}
                                                                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-bold hover:bg-green-700 transition flex items-center justify-center gap-1.5 shadow-sm"
                                                            >
                                                                Buy Now
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="px-5 pb-5">
                                                            <button
                                                                onClick={() => book.buyLink && window.open(book.buyLink, '_blank')}
                                                                className="w-full mt-4 py-2.5 border-2 border-green-600 text-green-600 rounded-xl text-[10px] font-bold hover:bg-green-50 transition flex items-center justify-center gap-2"
                                                            >
                                                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                                                Buy Online
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Additional Local Books (Not in top 3) */}
                                            {msg.databaseBooks && msg.databaseBooks.filter(dbBook => 
                                                !Object.values(msg.recommendations || {}).some(aiBook => aiBook.dbId === dbBook._id)
                                            ).map((book, bIdx) => (
                                                <div key={bIdx} className="bg-white rounded-2xl border border-green-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                    <div className="relative aspect-[3/4] bg-gray-50">
                                                        {book.image ? (
                                                            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <BookOpenIcon className="h-10 w-10" />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-3 right-3">
                                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-green-600 text-white shadow-md">
                                                                Apne Pass Hai
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-5">
                                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{book.title}</h3>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded-md font-medium">
                                                                {book.brandName || "Locally Managed"}
                                                                </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                            <div className="flex-1">
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Our Price</p>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-sm font-black text-green-600">₹{book.discountPrice || book.originalPrice}</span>
                                                                    {book.discountPrice && book.originalPrice > book.discountPrice && (
                                                                        <span className="text-[10px] text-gray-400 line-through">₹{book.originalPrice}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Condition</p>
                                                                <p className="text-[11px] font-bold text-gray-700 capitalize">{book.condition || "Excellent"}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex gap-2 mt-5">
                                                            <button
                                                                onClick={() => addToCart(book._id)}
                                                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-[10px] font-bold hover:bg-gray-200 transition flex items-center justify-center gap-1.5"
                                                            >
                                                                <ShoppingBagIcon className="h-3.5 w-3.5" />
                                                                + Cart
                                                            </button>
                                                            <button
                                                                onClick={() => handleBuyNow(book)}
                                                                className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[10px] font-bold hover:bg-green-700 transition flex items-center justify-center gap-1.5 shadow-sm"
                                                            >
                                                                Buy Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                                <SparklesIcon className="h-6 w-6 text-green-600 animate-pulse" />
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                <form
                    onSubmit={handleSend}
                    className="max-w-4xl mx-auto flex items-center gap-3"
                >
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="E.g., 'I want to learn Quantum Physics' or 'Good novels for beginners'"
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 transition"
                        >
                            <SparklesIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`p-3 rounded-2xl transition-all shadow-md ${!input.trim() || loading
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                            }`}
                    >
                        <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    AI generated recommendations may vary.
                </p>
            </div>

            {/* MODALS & TOASTS */}
            {showOrderModal && (
                <OrderPlacedForm 
                    onClose={() => setShowOrderModal(false)} 
                    amount={orderInfo.amount} 
                    bookscarts={orderInfo.bookIds} 
                />
            )}

            <div
                className={`fixed bottom-24 right-5 z-50 transition-all duration-300 ${
                    addedToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                }`}
            >
                <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-700">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    <div className="flex flex-col">
                        <p className="text-sm font-bold">Added to Cart</p>
                        <p className="text-[10px] text-gray-400">View your shopping bag to checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
