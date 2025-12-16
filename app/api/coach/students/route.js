import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/jwt";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";

export async function GET(req) {
    await connectDB();

    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "coach") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const students = await User.find({ coachId: decoded.id })
        .select("_id name email");

    return NextResponse.json({ students });
}
