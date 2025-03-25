import React, { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import { io } from "socket.io-client";


const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const SOCKET_SERVER = process.env.NEXT_PUBLIC_SOCKET_SERVER;


if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !ADMIN_EMAIL) {
  console.error("Missing EmailJS environment variables. Check your .env.local file.");
}


const socket = io(SOCKET_SERVER);

interface FraudUrl {
  _id: string;
  name: string;
  risk_level: string;
  category: string;
}

const FraudUrlPage: React.FC = () => {
  const [fraudulentUrls, setFraudulentUrls] = useState<FraudUrl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/fraud-data?type=url");
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setFraudulentUrls(data);
        }
      } catch (error) {
        console.error("Error fetching fraudulent URLs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();


    socket.on("fraud-update", (newFraudUrl: FraudUrl) => {
      console.log("Fraud update received:", newFraudUrl);
      setFraudulentUrls((prevUrls) => [newFraudUrl, ...prevUrls]);
    });

    return () => {
      socket.off("fraud-update");
    };
  }, []);

  const handleAction = async (action: string, url: FraudUrl) => {
    try {
      const updatedUrls = fraudulentUrls.map((prevUrl) =>
        prevUrl._id === url._id
          ? {
              ...prevUrl,
              risk_level:
                action === "report"
                  ? "Investigating"
                  : action === "block"
                  ? "Blocked"
                  : "Under Investigation",
            }
          : prevUrl
      );
      setFraudulentUrls(updatedUrls);

      const response = await fetch("/api/fraud-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, name: url.name, type: "url" }),
      });

      if (!response.ok) throw new Error("Failed to perform action");

      const result = await response.json();
      alert(`Successfully ${action}ed: ${url.name}`);

 
      socket.emit("fraud-action", { action, url });

     
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !ADMIN_EMAIL) {
        console.error("Missing EmailJS environment variables.");
        return;
      }

      emailjs
        .send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            action: action.toUpperCase(),
            fraudName: url.name,
            fraudType: "URL",
            riskLevel: action === "report" ? "Investigating" : url.risk_level,
            reportedOn: new Date().toLocaleString(),
            to_email: ADMIN_EMAIL,
          },
          EMAILJS_PUBLIC_KEY
        )
        .then(() => {
          console.log(`Email notification sent for ${action}: ${url.name}`);
        })
        .catch((error) => {
          console.error("Error sending email notification:", error);
        });
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading fraudulent URLs...</p>;
  if (fraudulentUrls.length === 0) return <p className="text-center text-gray-500">No fraudulent URLs found.</p>;

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg mt-5">
      <h2 className="text-xl font-bold text-red-600 mb-3">🚨 Fraudulent URLs</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-red-500 text-white">
            <th className="border border-gray-300 px-4 py-2">URL</th>
            <th className="border border-gray-300 px-4 py-2">Risk Level</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fraudulentUrls.map((url, index) => (
            <tr key={url._id} className={`text-center ${index % 2 === 0 ? "bg-red-400" : "bg-pink-300"}`}>
              <td className="border border-gray-300 px-4 py-2">{url.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    url.risk_level === "High"
                      ? "bg-red-500"
                      : url.risk_level === "Medium"
                      ? "bg-yellow-500"
                      : url.risk_level === "Investigating"
                      ? "bg-blue-500"
                      : url.risk_level === "Blocked"
                      ? "bg-gray-600"
                      : "bg-green-500"
                  }`}
                >
                  {url.risk_level}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">{url.category}</td>
              <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                <button
                  onClick={() => handleAction("report", url)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition cursor-pointer"
                >
                  Report
                </button>
                <button
                  onClick={() => handleAction("block", url)}
                  className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600 transition cursor-pointer"
                >
                  Block
                </button>
                <button
                  onClick={() => handleAction("investigate", url)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 transition cursor-pointer"
                >
                  Investigate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FraudUrlPage;
