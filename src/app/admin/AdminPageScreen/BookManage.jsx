"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Book, GraduationCap, Heart, ShoppingBag, Loader2, Edit3, X, Save, Upload } from "lucide-react";

export default function BookManage() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    engineering: 0,
    medical: 0,
    userListed: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BOOK_URL}/api/bookmanage?page=${currentPage}&limit=${limit}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setData(res.data.books);
        setStats(res.data.stats);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData();
    Object.keys(editingBook).forEach(key => {
      if (key === 'image' && editingBook[key] instanceof File) {
        formData.append('image', editingBook[key]);
      } else {
        formData.append(key, editingBook[key]);
      }
    });

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BOOK_URL}/api/updateBook/${editingBook._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      if (res.data.success) {
        alert("Book updated successfully!");
        setEditingBook(null);
        setImagePreview(null);
        fetchBooks();
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const STAT_CARDS = [
    { label: "Total Books", value: stats.totalBooks, icon: Book, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Loading book catalog...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Book Management</h1>
        <p className="text-gray-500 font-medium mt-1">Real-time control over your entire inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <Icon size={24} />
              </div>
              <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest">{card.label}</h2>
              <p className={`text-3xl font-black ${card.color} mt-1`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Book Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Book</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Title & Author</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Condition</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Pricing</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Source</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((book, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-16 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={book.image || book.bookImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-800 uppercase tracking-tight truncate max-w-[200px]">{book.title}</div>
                    <div className="text-xs text-gray-400 font-bold mt-0.5">{book.author || book.brandName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${book.condition === "New" || book.condition === "NEW"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                      }`}>
                      {book.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-900 text-lg">₹{book.price || book.discountPrice}</div>
                    {book.originalPrice > (book.price || book.discountPrice) && (
                      <div className="text-[10px] text-gray-400 line-through font-bold">₹{book.originalPrice}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${book.source === 'user-listed'
                      ? "bg-purple-100 text-purple-700 shadow-sm shadow-purple-200"
                      : "bg-blue-100 text-blue-700 shadow-sm shadow-blue-200"
                      }`}>
                      {book.source === 'user-listed' ? 'P2P' : 'Official'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show limit around current page
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-gray-300">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Edit Book Details</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{editingBook.source === 'catalog' ? 'Official Collection' : 'User Listed (P2P)'}</p>
              </div>
              <button
                onClick={() => { setEditingBook(null); setImagePreview(null); }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image Upload */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Book Cover</label>
                  <div className="relative group">
                    <div className="aspect-[3/4] rounded-3xl bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-blue-300 transition-colors">
                      <img
                        src={imagePreview || editingBook.image || editingBook.bookImage}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="text-white mb-2" size={32} />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setEditingBook({ ...editingBook, image: file });
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Text Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Title</label>
                    <input
                      type="text"
                      value={editingBook.title}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Author / Brand</label>
                    <input
                      type="text"
                      value={editingBook.author || editingBook.brandName}
                      onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value, brandName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Price (Sale)</label>
                      <input
                        type="number"
                        value={editingBook.price || editingBook.discountPrice}
                        onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value, discountPrice: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">MRP (Original)</label>
                      <input
                        type="number"
                        value={editingBook.originalPrice}
                        onChange={(e) => setEditingBook({ ...editingBook, originalPrice: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Category</label>
                    <select
                      value={editingBook.category}
                      onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-slate-700 uppercase tracking-widest text-xs"
                    >
                      <option value="engineering">Engineering</option>
                      <option value="medical">Medical</option>
                      <option value="comedy">Comedy</option>
                    </select>
                  </div>
                </div>
              </div>

              {editingBook.source === 'user-listed' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Description</label>
                  <textarea
                    rows={4}
                    value={editingBook.description}
                    onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium text-slate-600"
                  />
                </div>
              )}
            </form>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => { setEditingBook(null); setImagePreview(null); }}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {updateLoading ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
