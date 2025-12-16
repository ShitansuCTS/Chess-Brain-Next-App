"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include", // important for HttpOnly cookie
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.user) {
                alert("Login successful ✅");
                router.push("/dashboard");
                // // Redirect based on role
                // if (data.user.role === "coach") router.push("/dashboard/coach");
                // else if (data.user.role === "student") router.push("/dashboard/student");
                // else router.push("/dashboard/admin");
            } else {
                alert(data.message || "Login failed ❌");
            }
        } catch (err) {
            console.error(err);
            alert("Server error ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
                <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

                <input
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 w-full rounded transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}
