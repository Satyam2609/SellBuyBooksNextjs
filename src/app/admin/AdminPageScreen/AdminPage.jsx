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

const navigation = [
  { name: 'Overview', icon: HomeIcon, href: '#', current: true },
  { name: 'Books Management', icon: BookOpenIcon, href: '#', current: false },
  { name: 'Users & Roles', icon: UsersIcon, href: '#', current: false },
  { name: 'Financials', icon: CurrencyDollarIcon, href: '#', current: false },
  { name: 'Analytics', icon: ChartBarIcon, href: '#', current: false },
  { name: 'Settings', icon: Cog6ToothIcon, href: '#', current: false },
];



const recentOrders = [
  { id: '#ORD-001', customer: 'Amit Kumar', book: 'React Interview Guide', date: 'Oct 24, 2025', status: 'Completed', amount: '₹450', avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=0D8ABC&color=fff' },
  { id: '#ORD-002', customer: 'Priya Singh', book: 'Advanced Physics', date: 'Oct 24, 2025', status: 'Pending', amount: '₹620', avatar: 'https://ui-avatars.com/api/?name=Priya+Singh&background=F59E0B&color=fff' },
  { id: '#ORD-003', customer: 'Rahul Verma', book: 'Chemistry Vol 1', date: 'Oct 23, 2025', status: 'Shipped', amount: '₹380', avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=10B981&color=fff' },
  { id: '#ORD-004', customer: 'Sneha Gupta', book: 'History of India', date: 'Oct 23, 2025', status: 'Cancelled', amount: '₹210', avatar: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=EF4444&color=fff' },
  { id: '#ORD-005', customer: 'Vikram Das', book: 'Mathematics Class 12', date: 'Oct 22, 2025', status: 'Completed', amount: '₹550', avatar: 'https://ui-avatars.com/api/?name=Vikram+Das&background=6366F1&color=fff' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [totalPrice , settotalPrice] = useState()
  const [users , setusers] = useState()
  const [activeusers , setactiveusers] = useState()
  const [orderdata , setorderdata] = useState([])
  const [bookscount , setbookscount] = useState()

  useEffect(() => {
    const fetchdata = async() => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/ordersdatas`,{
        withCredentials:true
      })
      setorderdata(res.data.findBooks)
      setbookscount(res.data.booksCount)
      
    
      } catch (error) {
        console.log(error.response?.data?.message)
        
      }
    }
    fetchdata()
  } , [])
  


  const stats = [
  { name: 'Total Revenue', value: totalPrice, change: '+20.1%', trend: 'up', icon: CurrencyDollarIcon },
  { name: 'Total Users', value: users, change: '+15.1%', trend: 'up', icon: UsersIcon },
  { name: 'Active User', value: activeusers, change: '-3.2%', trend: 'down', icon: BookOpenIcon },
  { name: 'Totals Book', value: bookscount, change: 'Requires Action', trend: 'neutral', icon: BellIcon },
];

  useEffect(() => {
    const fetchdata = async() => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BOOK_URL}/api/ordersDetails`,{
        withCredentials:true
      })
      settotalPrice(res.data.total)
      setusers(res.data.findUserCount)
      setactiveusers(res.data.userActiveCount)
      console.log(res.data.findUserCount)
      } catch (error) {
        console.log(error.response?.data?.message)
        
      }
    }
    fetchdata()
  } , [])

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
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
          <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 flex items-center justify-between px-6 h-16 transition-shadow duration-200 hover:shadow-sm">
          <div className="flex items-center flex-1">
            <button
              className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="w-full max-w-lg lg:max-w-xs relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white sm:text-sm transition-all duration-200"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px] cursor-pointer ring-2 ring-transparent hover:ring-blue-100 transition-all">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <span className="text-xs font-bold text-blue-600">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* content scrollable area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Global performance metrics for today.</p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Export
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Add New Book
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl border border-slate-100 overflow-hidden group hover:border-blue-100 transition-colors">
                  <dt>
                    <div className={`absolute rounded-xl p-3 ${item.trend === 'up' ? 'bg-green-50' :
                        item.trend === 'down' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                      <item.icon className={`h-6 w-6 ${item.trend === 'up' ? 'text-green-600' :
                          item.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                        }`} aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-sm font-medium text-slate-500 truncate">{item.name}</p>
                  </dt>
                  <dd className="ml-16 pb-1 flex items-baseline sm:pb-2">
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    
                  </dd>
                </div>
              ))}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-lg leading-6 font-semibold text-slate-900">Recent Transactions</h3>
                  <p className="text-xs text-slate-500 mt-1">Latest book orders from customers.</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full whitespace-nowrap text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      
                      <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">BookImage</th>
                      <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Book Name</th>
                      <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Book Condition</th>
                      <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Book Category</th>
                      <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Discount Price</th>
                      <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-right">Amount</th>
                      <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {orderdata.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <div className="h-7 w-28 p-3 flex-shrink-0">
                              <img className="h-8 w-8 rounded-full" src={order.image} alt="" />
                            </div>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <div className="text-sm font-medium text-slate-900">{order.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{order.condition}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize`}>
                            {order.category}
                            
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{order.discountPrice}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 text-right">{order.originalPrice}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button className="text-slate-400 hover:text-slate-600">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Footer (Optional) */}
              <div className="bg-white px-4 py-3 border-t border-slate-100 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">20</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">Previous</a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">1</a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">2</a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">3</a>
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">Next</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
