import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import emailjs from "emailjs-com";


const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !ADMIN_EMAIL) {
  console.error("Missing EmailJS environment variables. Check your .env.local file.");
}


const socket = io("http://safescan-production.up.railway.app/", { transports: ["websocket"] });

const FraudPage: React.FC = () => {
  const [fraudulentApps, setFraudulentApps] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/fraud-data?type=app")
      .then((res) => res.json())
      .then((data) => {
        console.log("Received Fraudulent Apps Data:", data);
        setFraudulentApps(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("❌ Error fetching fraud apps:", error));


    socket.on("fraud_update", (newFraud) => {
      setFraudulentApps((prevApps) => {
        const exists = prevApps.some((app) => app.name === newFraud.data.name);
        return exists
          ? prevApps.map((app) =>
              app.name === newFraud.data.name
                ? { ...app, risk_level: newFraud.data.risk_level }
                : app
            )
          : [...prevApps, newFraud.data];
      });
    });

    return () => {
      socket.off("fraud_update");
    };
  }, []);


  const handleAction = async (action: string, app: any) => {
    try {
      if (!app.name) {
        console.error("Missing required fields in app object:", app);
        return;
      }

      const payload = { action, name: app.name, type: "app" };
      console.log("Sending API Request:", payload);

      const response = await fetch("/api/fraud-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("API Error Response:", result);
        throw new Error(result.error || "Failed to perform action");
      }

      alert(`Successfully ${action}ed: ${app.name}`);


      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !ADMIN_EMAIL) {
        console.error("❌ Missing EmailJS environment variables.");
        return;
      }

      emailjs
        .send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            action: action.toUpperCase(),
            fraudName: app.name,
            fraudType: "App",
            riskLevel: action === "report" ? "Investigating" : app.risk_level,
            reportedOn: new Date().toLocaleString(),
            to_email: ADMIN_EMAIL,
          },
          EMAILJS_PUBLIC_KEY
        )
        .then(() => {
          console.log(`Email notification sent for ${action}: ${app.name}`);
        })
        .catch((error) => {
          console.error("Error sending email notification:", error);
        });
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-blue-600 mb-3">📌 Fraudulent Apps (Live Updates)</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-4 py-2">App Name</th>
            <th className="border border-gray-300 px-4 py-2">Developer</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Risk Level</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fraudulentApps.map((app, index) => (
            <tr key={app._id} className={`text-center ${index % 2 === 0 ? "bg-blue-800" : "bg-gray-700"}`}>
              <td className="border border-gray-300 px-4 py-2">{app.name}</td>
              <td className="border border-gray-300 px-4 py-2">{app.developer}</td>
              <td className="border border-gray-300 px-4 py-2">{app.category}</td>
              <td className="border border-gray-300 px-4 py-2">{app.risk_level}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-3">
                <button onClick={() => handleAction("block", app)} className="px-3 py-1 bg-red-700 text-white rounded cursor-pointer">
                  Block
                </button>
                <button onClick={() => handleAction("investigate", app)} className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer">
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

export default FraudPage;
