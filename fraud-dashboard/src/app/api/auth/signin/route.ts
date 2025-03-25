import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 3600 });

  return response;
}
