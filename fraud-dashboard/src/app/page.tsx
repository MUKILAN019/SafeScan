"use client"; 

import { useEffect, useState } from "react";
import { FraudData } from "@/types/types";
import FraudTable from "@/components/FraudTable";
import FraudUrlTable from "@/components/FraudUrlTable";
import FraudTrendBarChart from "@/components/FraudTrendBarChart"

export default function Home() {
  const [fraudData, setFraudData] = useState<FraudData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fraud-data")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data: FraudData) => {
        setFraudData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("⚠️ Oops! Something went wrong. Unable to load data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-200 mb-6">Fraud Detection Dashboard</h1>

      <p className="text-lg text-gray-100 text-center mt-5 w-1/2">
        🚀 <span className="text-red-600 font-bold">Fraud Detection Dashboard</span> -Stay ahead of fraudulent activities with real-time monitoring, insightful analytics, and automated alerts. Detect, report, and take action seamlessly! 🔍 
      </p>
       <br/>
       <br/>

      {/*  Beautiful Error Message */}
      {error && (
        <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-md mb-4 flex items-center justify-between w-full max-w-2xl">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-white font-bold text-lg">✖</button>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-3">Fetching data...</p>
          </div>
        ) : fraudData ? (
          <>
            <FraudTable  />
            <FraudUrlTable  />
            <FraudTrendBarChart />
          </>
        ) : (
          <p className="text-center text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
}
