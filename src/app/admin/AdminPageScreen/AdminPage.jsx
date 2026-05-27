"use client"
import React, { useEffect, useState } from 'react';
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import AdminAnalytics from './AdminAnalytics';
import BookManage from './BookManage';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, href: '#', current: true },
  { name: 'Accounts', icon: UsersIcon, href: '#', current: false },
  { name: 'Books Management', icon: BookOpenIcon, href: '#', current: false },
  { name: 'Analytics', icon: ChartBarIcon, href: '#', current: false }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [totalPrice, settotalPrice] = useState(0)
  const [usersCount, setusersCount] = useState(0)
  const [activeusers, setactiveusers] = useState(0)
  const [orderdata, setorderdata] = useState([])
  const [bookscount, setbookscount] = useState(0)
  const [page, setpage] = useState("Dashboard")
  const [allUsers, setAllUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/ordersDetails`, {
          withCredentials: true
        })
        settotalPrice(res.data.total)
        setusersCount(res.data.findUserCount)
        setactiveusers(res.data.userActiveCount)
      } catch (error) {
        console.log("Error fetching stats:", error.response?.data?.message)
      }
    }
    fetchDashboardStats()
  }, [])

  // Fetch Recent Transactions
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/ordersdatas`, {
          withCredentials: true
        })
        setorderdata(res.data.findBooks)
        setbookscount(res.data.booksCount)
      } catch (error) {
        console.log("Error fetching transactions:", error.response?.data?.message)
      }
    }
    fetchRecentTransactions()
  }, [])

  // Fetch All Users when in Accounts tab
  useEffect(() => {
    if (page === "Accounts") {
      const fetchUsers = async () => {
        setLoadingUsers(true)
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/allUsers`, {
            withCredentials: true
          })
          if (res.data.success) {
            setAllUsers(res.data.users)
          }
        } catch (error) {
          console.error("Error fetching users:", error)
        } finally {
          setLoadingUsers(false)
        }
      }
      fetchUsers()
    }
  }, [page])

  const stats = [
    { name: 'Total Revenue', value: `₹${totalPrice?.toLocaleString()}`, trend: 'up', icon: CurrencyDollarIcon },
    { name: 'Total Users', value: usersCount, trend: 'up', icon: UsersIcon },
    { name: 'Active User', value: activeusers, trend: 'down', icon: BookOpenIcon },
    { name: 'Totals Book', value: bookscount, trend: 'neutral', icon: BellIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-lg">
              <span className="font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">SellBuy</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Menu</div>
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => { setpage(item.name); setActiveTab(item.name); }}
              className={classNames(
                activeTab === item.name
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium',
                'group flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200'
              )}
            >
              <item.icon
                className={classNames(
                  activeTab === item.name ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500',
                  'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                )}
                aria-hidden="true"
              />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors group">
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-700 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 flex items-center justify-between px-6 h-16 shadow-sm">
          <div className="flex items-center flex-1">
            <button className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-full max-w-lg lg:max-w-xs relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input type="text" className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-full bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm" placeholder="Search..." />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center p-[2px] cursor-pointer">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <span className="text-xs font-bold text-blue-600">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">

            {/* 1. Dashboard Page */}
            {page === "Dashboard" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Global performance metrics for today.</p>
                  </div>
                 
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.map((item) => (
                    <div key={item.name} className="bg-white p-6 shadow-sm rounded-2xl border border-slate-100 relative group transition-all hover:border-blue-100">
                      <div className="absolute top-6 right-6 p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <dt className="text-sm font-medium text-slate-500 uppercase tracking-widest">{item.name}</dt>
                      <dd className="text-2xl font-black text-slate-900 mt-2">{item.value}</dd>
                    </div>
                  ))}
                </div>

                <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-500">View all</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Book</th>
                          <th className="px-6 py-4">Condition</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orderdata.map((order) => (
                          <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 flex items-center space-x-3">
                              <img className="h-10 w-8 object-cover rounded shadow-sm" src={order.image} alt="" />
                              <span className="text-sm font-bold text-slate-900">{order.title}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{order.condition}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">{order.category}</span>
                            </td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">₹{order.originalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Admin Analytics Page */}
            {page === "Analytics" && <AdminAnalytics />}

            {/* 3. Books Management Page */}
            {page === "Books Management" && <BookManage />}

            {/* 4. Accounts (User Management) Page */}
            {page === "Accounts" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Accounts</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and view all registered customers.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input type="text" className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Search users..." />
                  </div>
                </div>

                <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="px-6 py-5">User Profile</th>
                          <th className="px-6 py-5">Email Address</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5 text-right">Join Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {loadingUsers ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Loading Users...</td>
                          </tr>
                        ) : allUsers.map((user, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-5 flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">
                                {user.fullname?.charAt(0).toUpperCase()}
                              </div>
                              <div className="font-black text-slate-800 uppercase tracking-tight">{user.fullname}</div>
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-slate-600 lowercase">{user.email}</td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Active</span>
                            </td>
                            <td className="px-6 py-5 text-right text-sm font-bold text-slate-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
