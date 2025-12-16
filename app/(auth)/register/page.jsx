"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("User registered successfully ✅");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Register
        </h2>

        <input
          className="border border-gray-800 text-black p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border border-gray-800 text-black p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-800 text-black p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="coach">Coach</option>
        </select>

        <button
          onClick={handleRegister}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 w-full rounded transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
}
