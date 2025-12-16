import { NextResponse } from "next/server";
import User from "../../../models/User";
import Session from "../../../models/Session";
import { connectDB } from "../../../lib/db";
import { verifyToken } from "../../../lib/jwt";

export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== "coach") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { title, studentId, date, startTime, endTime } = await req.json();

        if (!title || !studentId || !date || !startTime || !endTime) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Check if the student exists and belongs to this coach
        const student = await User.findById(studentId);
        if (!student || student.coachId.toString() !== decoded.id) {
            return NextResponse.json({ message: "Invalid student" }, { status: 400 });
        }

        const session = await Session.create({
            title,
            coachId: decoded.id,
            studentId,
            date,
            startTime,
            endTime,
        });

        return NextResponse.json({ message: "Session created successfully", session });
    } catch (err) {
        console.error("Create session error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
