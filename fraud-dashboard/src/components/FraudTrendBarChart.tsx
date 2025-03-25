import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface FraudTrend {
  name: string;
  fraud_cases_detected: number;
}

const FraudTrendBarChart: React.FC = () => {
  const [fraudTrends, setFraudTrends] = useState<FraudTrend[]>([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line"); 

  useEffect(() => {
    fetch("/api/fraud-data?type=trend")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedTrends = data
            .map((trend) => ({
              name: trend.name,
              fraud_cases_detected: trend.fraud_cases_detected,
            }))
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

          setFraudTrends(formattedTrends);
        } else {
          console.warn("No Fraud Trends Found!");
          setFraudTrends([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching fraud trends:", error);
        setFraudTrends([]);
      });
  }, []);

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg mt-5">
      <h2 className="text-xl font-bold text-purple-600 mb-3">📊 Fraud Trends (Last 30 Days)</h2>

      {/* Toggle Chart Type */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 text-white rounded-lg cursor-pointer mr-2 ${
            chartType === "line" ? "bg-purple-700" : "bg-gray-400"
          }`}
          onClick={() => setChartType("line")}
        >
          📈 Line Graph
        </button>
        <button
          className={`px-4 py-2 text-white rounded-lg cursor-pointer ${
            chartType === "bar" ? "bg-purple-700" : "bg-gray-400"
          }`}
          onClick={() => setChartType("bar")}
        >
          📊 Bar Graph
        </button>
      </div>

      {fraudTrends.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "line" ? (
            <LineChart data={fraudTrends} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(date) => new Date(date).toISOString().split("T")[0]}
                tick={{ fontSize: 12 }}
                stroke="#8884d8"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#8884d8" />
              <Tooltip contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: "5px", border: "1px solid #8884d8", color: "blue" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="fraud_cases_detected"
                stroke="#FF5733"
                strokeWidth={3}
                dot={{ r: 5, fill: "#FF5733" }}
                activeDot={{ r: 8, fill: "#FF0000" }}
              />
            </LineChart>
          ) : (
            <BarChart data={fraudTrends} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(date) => new Date(date).toISOString().split("T")[0]}
                tick={{ fontSize: 12 }}
                stroke="#8884d8"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#8884d8" />
              <Tooltip contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: "5px", border: "1px solid #8884d8", color: "blue" }} />
              <Legend />
              <Bar dataKey="fraud_cases_detected" fill="#8884d8" barSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No fraud trend data available</p>
      )}
    </div>
  );
};

export default FraudTrendBarChart;
