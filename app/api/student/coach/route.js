import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/jwt";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";

export async function GET(req) {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "student") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }


    // console.log("The value is ", decoded)


    // ✅ Populate coachId, not coach
    const student = await User.findById(decoded.id).populate("coachId", "name email role");


    // console.log("The student is ", student)

    if (!student || !student.coachId) {
        return NextResponse.json({ coach: null });
    }

    return NextResponse.json({ coach: student.coachId });
}
