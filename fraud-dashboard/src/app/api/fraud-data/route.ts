import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Fraud from "@/models/Fraud";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in .env.local");
  process.exit(1);
}


async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI as string);
}


const SOCKET_PORT = 3001;
let io: Server | null = null;

declare global {
  var _io: Server | undefined;
}

if (!global._io) {
  const server = http.createServer();
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("New client connected!");
    socket.on("disconnect", () => console.log("Client disconnected!"));
  });

  server.listen(SOCKET_PORT, () => console.log(` WebSocket Server Running on Port ${SOCKET_PORT}`));
  global._io = io;
} else {
  io = global._io;
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const fraudEntries = await Fraud.find();
    let filteredData = type ? fraudEntries.filter((entry) => entry.type === type) : fraudEntries;

    console.log(`Filtered Fraud Data (Type: ${type || "all"}):`, filteredData);
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Error fetching fraud data:", error);
    return NextResponse.json({ error: "Failed to fetch fraud data" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const { action, name, type } = await req.json();

    if (!["app", "url", "trend"].includes(type)) {
      return NextResponse.json({ error: "Invalid fraud type" }, { status: 400 });
    }

    const fraudEntry = await Fraud.findOne({ name, type });

    if (!fraudEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

 
    if (action === "report") {
      fraudEntry.reported_on = new Date();
      fraudEntry.risk_level = "Investigating";
    } else if (action === "block") {
      fraudEntry.risk_level = "Blocked";
    } else if (action === "investigate") {
      fraudEntry.risk_level = "Under Investigation";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await fraudEntry.save();

 
    if (io) {
      io.emit("fraud_update", { data: fraudEntry });
      console.log("Sent real-time fraud update:", fraudEntry);
    } else {
      console.warn("WebSocket server is not initialized!");
    }

    return NextResponse.json({ message: `${name} has been ${action}ed`, data: fraudEntry });
  } catch (error:any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
