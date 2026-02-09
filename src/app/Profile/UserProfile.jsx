"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingBagIcon, TrashIcon, PencilSquareIcon, MapPinIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function UserProfile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myBooks, setMyBooks] = useState([]);

  // Form State
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // 🔥 FETCH USER & BOOKS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BOOK_URL}/api/getProfile`,
          { withCredentials: true }
        );
        const userData = userRes.data;
        setUser(userData);
        setFormData({
          name: userData.username || "",
          bio: userData.bio || "",
          profileImage: null
        });

        const booksRes = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/BookData`, {
          withCredentials: true,
        });

        const allBooks = booksRes.data.finddata || [];

        // Filter: likely matching email
        const userBooks = allBooks.filter(book =>
          (book.email === userData.email) ||
          (book.userEmail === userData.email) ||
          (book.userId === userData._id)
        );

        setMyBooks(userBooks);

      } catch (error) {
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add update logic here
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">

      {/* 1. Professional Header / Cover */}
      <div className="h-60 bg-slate-900 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2256&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-10">

        {/* 2. Main Profile Layout - Two Columns on Desktop */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: User Card */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 text-center border-b border-slate-100">
                <div className="relative inline-block">
                  <img
                    src={imagePreview || user?.profileImage || "/Eye.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  />
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-slate-800 text-white p-2 rounded-full cursor-pointer hover:bg-slate-700 transition shadow-md">
                      <PencilSquareIcon className="w-4 h-4" />
                      <input type="file" name="profileImage" accept="image/*" className="hidden" onChange={handleInputChange} />
                    </label>
                  )}
                </div>

                {!editMode ? (
                  <div className="mt-4">
                    <h1 className="text-xl font-bold text-slate-900">{user?.username || "Reader"}</h1>
                    <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <button
                        onClick={() => setEditMode(true)}
                        className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
                      >
                        <PencilSquareIcon className="w-4 h-4 mr-2 text-slate-500" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Username"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditMode(false)} className="flex-1 py-2 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="flex-1 py-2 text-xs font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-900">Save</button>
                    </div>
                  </form>
                )}
              </div>

              {/* About Section in Sidebar */}
              <div className="p-6 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">About</h3>
                {!editMode ? (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {user?.bio || "No bio information provided."}
                  </p>
                ) : (
                  <textarea
                    rows="4"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white"
                    placeholder="Write a short bio..."
                  />
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-slate-500">
                    <EnvelopeIcon className="w-4 h-4 mr-3 text-slate-400" />
                    {user?.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPinIcon className="w-4 h-4 mr-3 text-slate-400" />
                    India
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Stats & Books */}
          <div className="lg:w-2/3 space-y-6">

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Books Listed</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{myBooks.length}</p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                  <ShoppingBagIcon className="w-5 h-5" />
                </div>
              </div>
              {/* Placeholder Stats */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Books Sold</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">0</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Member Since</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">2024</p>
                </div>
                <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* My Books Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">My Books</h2>
                <button
                  onClick={() => router.push('/SellOldBook')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  + Sell New Book
                </button>
              </div>

              <div className="p-6">
                {myBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBooks.map((book) => (
                      <div key={book._id} className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200">
                        <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-semibold text-slate-700 rounded-md shadow-sm">
                            {book.category}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1" title={book.title}>{book.title}</h3>
                          <p className="text-xs text-slate-500 mb-3">{book.author || "Unknown Author"}</p>

                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">₹{book.discountPrice}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${book.condition === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                              {book.condition}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-3">
                      <ShoppingBagIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">No books listed</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1 mb-6">
                      Your personal library is empty. Add a book to start selling.
                    </p>
                    <button
                      onClick={() => router.push('/SellOldBook')}
                      className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition shadow-sm"
                    >
                      Sell a Book
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

// Icons for the stats (Adding simple fallback icons if some are missing)
function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  );
}
function UserIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  );
}
