import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { name, email, password, role, coachId } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    coachId: role === "student" ? coachId : null,
  });

  return NextResponse.json({
    success: true,
    user,
  });
}
