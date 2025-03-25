import mongoose from "mongoose";
import dotenv from "dotenv";
import Fraud from "@/models/Fraud";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mukilanp:mukilan@cluster0.n752n.mongodb.net/fraudDB";

// Fraudulent Apps Data
const fraudulentApps = [
  { type: "app", name: "FakeBank Pro", developer: "XYZ Solutions", category: "Finance", risk_level: "High", reported_on: new Date("2025-03-15") },
  { type: "app", name: "FreeCryptoWin", developer: "ABC Corp", category: "Trading", risk_level: "Medium", reported_on: new Date("2025-03-12") },
  { type: "app", name: "LoanFastNow", developer: "QuickMoney Ltd", category: "Finance", risk_level: "High", reported_on: new Date("2025-03-10") },
  { type: "app", name: "MusicDownloader", developer: "Unknown Dev", category: "Entertainment", risk_level: "Low", reported_on: new Date("2025-03-09") },
  { type: "app", name: "InstaFollowers", developer: "GrowthHackers Inc", category: "Social Media", risk_level: "Medium", reported_on: new Date("2025-03-07") },
];

// Fraudulent URLs Data
const fraudulentUrls = [
  { type: "url", name: "http://free-money-now.com", risk_level: "High", detected_on: new Date("2025-03-14"), category: "Phishing" },
  { type: "url", name: "http://get-rich-fast.biz", risk_level: "Medium", detected_on: new Date("2025-03-12"), category: "Scam" },
  { type: "url", name: "http://unlimited-downloads.net", risk_level: "Low", detected_on: new Date("2025-03-10"), category: "Malware" },
  { type: "url", name: "http://win-bitcoins-today.com", risk_level: "High", detected_on: new Date("2025-03-09"), category: "Crypto Scam" },
  { type: "url", name: "http://fakebank-login.com", risk_level: "High", detected_on: new Date("2025-03-06"), category: "Phishing" },
];

// Fraud Trends Data
const fraudTrends = [
  { type: "trend", name: "2025-02-18", fraud_cases_detected: 12 },
  { type: "trend", name: "2025-02-19", fraud_cases_detected: 15 },
  { type: "trend", name: "2025-02-20", fraud_cases_detected: 18 },
  { type: "trend", name: "2025-02-21", fraud_cases_detected: 20 },
  { type: "trend", name: "2025-02-22", fraud_cases_detected: 25 },
  { type: "trend", name: "2025-02-23", fraud_cases_detected: 22 },
  { type: "trend", name: "2025-02-24", fraud_cases_detected: 27 },
  { type: "trend", name: "2025-02-25", fraud_cases_detected: 30 },
  { type: "trend", name: "2025-02-26", fraud_cases_detected: 28 },
  { type: "trend", name: "2025-02-27", fraud_cases_detected: 35 },
  { type: "trend", name: "2025-02-28", fraud_cases_detected: 40 },
  { type: "trend", name: "2025-02-29", fraud_cases_detected: 42 },
  { type: "trend", name: "2025-03-01", fraud_cases_detected: 38 },
  { type: "trend", name: "2025-03-02", fraud_cases_detected: 37 },
  { type: "trend", name: "2025-03-03", fraud_cases_detected: 50 },
  { type: "trend", name: "2025-03-04", fraud_cases_detected: 45 },
  { type: "trend", name: "2025-03-05", fraud_cases_detected: 52 },
  { type: "trend", name: "2025-03-06", fraud_cases_detected: 55 },
  { type: "trend", name: "2025-03-07", fraud_cases_detected: 58 },
  { type: "trend", name: "2025-03-08", fraud_cases_detected: 60 },
  { type: "trend", name: "2025-03-09", fraud_cases_detected: 62 },
  { type: "trend", name: "2025-03-10", fraud_cases_detected: 65 },
  { type: "trend", name: "2025-03-11", fraud_cases_detected: 67 },
  { type: "trend", name: "2025-03-12", fraud_cases_detected: 70 },
  { type: "trend", name: "2025-03-13", fraud_cases_detected: 75 },
  { type: "trend", name: "2025-03-14", fraud_cases_detected: 80 },
  { type: "trend", name: "2025-03-15", fraud_cases_detected: 85 },
  { type: "trend", name: "2025-03-16", fraud_cases_detected: 90 },
  { type: "trend", name: "2025-03-17", fraud_cases_detected: 95 },
  { type: "trend", name: "2025-03-18", fraud_cases_detected: 100 },
];

const fraudData = [...fraudulentApps, ...fraudulentUrls, ...fraudTrends];

async function seedDatabase() {
    try {
     
      await mongoose.connect(MONGODB_URI);
      console.log("✅ Connected to MongoDB");
  
      await Fraud.deleteMany();
      console.log("⚠️ Old data deleted");
  
      await Fraud.insertMany(fraudData);
      console.log("🚀 Fraud data inserted successfully!");
  
      process.exit();
    } catch (error) {
      console.error("❌ Error inserting data:", error);
      process.exit(1);
    }
  }
  
  seedDatabase();
