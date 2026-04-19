"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calculator, Beaker, BookOpen, GraduationCap, Ghost, Search } from "lucide-react";

const HOME_CATEGORIES = [
    { id: "medical", name: "Medical", icon: Beaker, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { id: "engineering", name: "Engineering", icon: GraduationCap, color: "bg-green-50 text-green-600", border: "border-green-100" },
    { id: "comedy", name: "Comedy", icon: Ghost, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
    { id: "fantasy", name: "Fantasy", icon: BookOpen, color: "bg-pink-50 text-pink-600", border: "border-pink-100" },
    { id: "all", name: "All Books", icon: Search, color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
];

export default function CategorySection() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/Search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        What are you looking for today?
                    </h2>
                    <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                        Search for any book or explore our popular categories below.
                    </p>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {HOME_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.id}
                                href={`/Categories?cat=${cat.id}`}
                                className={`
                  group relative flex flex-col items-center p-8 rounded-3xl border-2 ${cat.border} 
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white
                `}
                            >
                                <div className={`p-5 rounded-2xl ${cat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                    <Icon size={32} />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                    {cat.name}
                                </h3>
                                <div className="mt-2 text-sm text-gray-400 font-medium group-hover:text-gray-600">
                                    Explore Books
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
