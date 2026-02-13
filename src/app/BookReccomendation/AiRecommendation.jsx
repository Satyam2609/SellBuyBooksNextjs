"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    PaperAirplaneIcon,
    SparklesIcon,
    UserIcon,
    ShoppingBagIcon,
    BookOpenIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

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

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
                const aiMessage = {
                    role: "assistant",
                    content: "I found some great recommendations for you!",
                    recommendations: recommendations,
                };
                setMessages((prev) => [...prev, aiMessage]);
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

                                {/* Recommendations Grid */}
                                {msg.recommendations && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                        {Object.entries(msg.recommendations).map(([level, book]) => (
                                            <div key={level} className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="relative aspect-[3/4] bg-gray-100">
                                                    {book.image ? (
                                                        <img
                                                            src={book.image}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                            <BookOpenIcon className="h-12 w-12" />
                                                            <span className="text-[10px] uppercase font-bold mt-2">No Image</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${level === 'beginner' ? 'bg-blue-100 text-blue-700' :
                                                                level === 'advanced' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {level}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{book.title}</h3>
                                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{book.description}</p>
                                                    <button
                                                        className="w-full py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                                    >
                                                        <ShoppingBagIcon className="h-4 w-4" />
                                                        Interested
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
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
        </div>
    );
}
