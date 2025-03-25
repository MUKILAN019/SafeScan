import mongoose from "mongoose";

const FraudSchema = new mongoose.Schema({
  type: { type: String, enum: ["app", "url", "trend"], required: true },
  name: { type: String, required: true },
  developer: { type: String },
  category: { type: String },
  risk_level: { type: String, enum: ["Low", "Medium", "High", "Blocked", "Under Investigation"], default: "Low" },
  reported_on: { type: Date, default: Date.now },
  detected_on: { type: Date },
  fraud_cases_detected: { type: Number },
});

export default mongoose.models.Fraud || mongoose.model("Fraud", FraudSchema);
