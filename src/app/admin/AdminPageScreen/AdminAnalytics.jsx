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

  const [graphdata, setgraphdata] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BOOK_URL}/api/anlytic`,
          { withCredentials: true }
        );

        // Ensure array always
        const formatted = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];

        // Sort by date (important)
        formatted.sort((a, b) => a.date - b.date);

        setgraphdata(formatted);
        console.log(formatted)

      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };

    fetchdata();
  }, []);

  // Total from backend data (NOT dummy)
  const total = graphdata.reduce(
    (sum, item) => sum + (item.order_amount || 0),
    0
  );

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Monthly Analytics
        </h1>
        <p className="text-gray-500">
          {graphdata[0]?.month} {graphdata[0]?.year} Revenue Overview
        </p>
      </div>

      {/* Total Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Total Revenue
        </h2>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          ₹ {total.toLocaleString()}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Daily Revenue Trend
        </h2>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="order_amount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
