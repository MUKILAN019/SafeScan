"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/auth/sigin"); 
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      router.push("/auth/signin");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
      <div id="signup" className="w-fit min-w-[320px] max-w-sm bg-white rounded-lg shadow-lg flex flex-col p-6">
        <form className="text-indigo-600" onSubmit={handleSubmit}>
          <fieldset className="border-4 border-dotted border-indigo-500 p-5 rounded-lg">
            <legend className="px-3 text-lg italic font-semibold">Register Now!</legend>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <label className="block text-sm font-bold mt-3" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="block text-sm font-bold mt-3" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2 rounded-md font-bold hover:bg-indigo-500">
              Register
            </button>
            <p className="text-center text-sm text-gray-700 mt-4">
              Having an account already?{" "}
              <a href="/auth/signin" className="font-bold text-indigo-500 hover:underline">
                Login
              </a>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
