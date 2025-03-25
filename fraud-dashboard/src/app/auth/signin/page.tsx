"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      const token = Cookies.get("token");
      console.log("Token:", token);
      if (token) {
        router.push("/");
      }
    }, 100); 
  }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      Cookies.set("token", data.token, { expires: 1, secure: true }); 
      router.push("/"); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex justify-center items-center">
      <div id="login" className="w-fit min-w-[320px] max-w-sm bg-white rounded-lg shadow-lg flex flex-col p-6">
        <form className="text-indigo-600" onSubmit={handleSubmit}>
          <fieldset className="border-4 border-dotted border-indigo-500 p-5 rounded-lg">
            <legend className="px-3 text-lg italic font-semibold">Welcome Back!</legend>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 rounded-md bg-indigo-600 text-white p-2 text-center font-bold hover:bg-indigo-500 transition duration-200"
            >
              Log In
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-700 mt-4">
              Don't have an account?{" "}
              <a href="/auth/signup" className="font-bold text-indigo-500 hover:underline">
                Sign up
              </a>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
