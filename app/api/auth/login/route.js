import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";
import jwt from "jsonwebtoken";

// Sign JWT token
function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user)
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        const token = signToken({ id: user._id, role: user.role, email: user.email , name: user.name});

        const response = NextResponse.json({
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });

        // Set HttpOnly cookie
        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // false in dev
            sameSite: "lax",  // works for same-origin
            path: "/",         // cookie available on all routes
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        });


        return response;
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
