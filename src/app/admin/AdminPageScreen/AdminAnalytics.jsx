"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AdminAnalytics() {

  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [view, setView] = useState("daily");
  const [range, setRange] = useState("today"); // today, week, thisMonth, lastMonth, all

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BOOK_URL}/api/anlytic`,
          { withCredentials: true }
        );

        // Ensure array always
        const formattedDaily = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        formattedDaily.sort((a, b) => a.date - b.date);

        const formattedMonthly = (res.data.monthlyData || []).map(item => ({
          label: `${item._id.month} ${item._id.year}`,
          amount: item.totalAmount
        }));

        const formattedYearly = (res.data.yearlyData || []).map(item => ({
          label: `${item._id.year}`,
          amount: item.totalAmount
        }));

        setDailyData(formattedDaily);
        setMonthlyData(formattedMonthly);
        setYearlyData(formattedYearly);

      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

    fetchdata();
  }, []);

  // Total Revenue Calculation
  const total = dailyData.reduce((sum, item) => sum + (item.order_amount || 0), 0);

  const now = new Date();
  const todayName = now.toLocaleString("en-US", { month: "short" });
  const todayDate = now.getDate();
  const todayYear = now.getFullYear();

  const todayRevenue = dailyData.find(d => d.date === todayDate && d.month === todayName && d.year === todayYear)?.order_amount || 0;

  const getFilteredData = () => {
    if (view === "monthly") return monthlyData;
    if (view === "yearly") return yearlyData;

    let data = [...dailyData];
    const now = new Date();

    if (range === "today") {
      data = data.filter(d => d.date === todayDate && d.month === todayName && d.year === todayYear);
    } else if (range === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      data = data.filter(d => {
        const itemDate = d.fullDate ? new Date(d.fullDate) : new Date(`${d.month} ${d.date}, ${d.year}`);
        return itemDate >= sevenDaysAgo;
      });
    } else if (range === "thisMonth") {
      data = data.filter(d => d.month === todayName && d.year === todayYear);
    } else if (range === "lastMonth") {
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(now.getMonth() - 1);
      const lastMonthName = lastMonthDate.toLocaleString("en-US", { month: "short" });
      const lastMonthYear = lastMonthDate.getFullYear();
      data = data.filter(d => d.month === lastMonthName && d.year === lastMonthYear);
    }

    return data.map(d => ({ label: `${d.date} ${d.month}`, amount: d.order_amount }));
  };

  const activeData = getFilteredData();

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-gray-500 font-medium">
            Overview of your business performance
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex flex-col gap-4">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {["daily", "monthly", "yearly"].map((v) => (
              <button
                key={v}
                onClick={() => { setView(v); setRange("all"); }}
                className={`
                  px-6 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider
                  ${view === v ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"}
                `}
              >
                {v}
              </button>
            ))}
          </div>

          {view === "daily" && (
            <div className="flex bg-gray-200/50 rounded-xl p-1 self-end">
              {[
                { id: "today", label: "Today" },
                { id: "week", label: "Last 7 Days" },
                { id: "thisMonth", label: "This Month" },
                { id: "lastMonth", label: "Prev Month" },
                { id: "all", label: "All Time" }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`
                    px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                    ${range === r.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-blue-600"}
                  `}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today Card */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-bl-xl">
            Today
          </div>
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
            Real-time Sales
          </h2>
          <p className="text-3xl font-black text-green-600">
            ₹ {todayRevenue.toLocaleString()}
          </p>
        </div>

        {/* Total Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Revenue
          </h2>
          <p className="text-3xl font-black text-blue-600">
            ₹ {total.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
            Selected View
          </h2>
          <p className="text-3xl font-black text-gray-800 capitalize">
            {view}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
            Status
          </h2>
          <p className="text-3xl font-black text-green-500 transition-pulse">
            Live
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Revenue Trend ({view.charAt(0).toUpperCase() + view.slice(1)})
        </h2>

        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  fontWeight: 'bold'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
