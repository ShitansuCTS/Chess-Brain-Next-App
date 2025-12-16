import { NextResponse } from "next/server";
import Session from "../../../../models/Session";
import { verifyToken } from "../../../../lib/jwt";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";

export async function GET(req) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== "student")
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const sessions = await Session.find({ studentId: decoded.id })
            .populate("coachId", "name email role")
            .sort({ date: 1, startTime: 1 });

        return NextResponse.json({ sessions });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
