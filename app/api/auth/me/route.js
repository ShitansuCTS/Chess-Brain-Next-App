import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/jwt";

export async function GET(req) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    //   console.log("Token: ", token);

    const user = verifyToken(token);


    //   console.log("The user is: ", user);


    if (!user) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
        user: {
            name: user.name,
            role: user.role,
        },
        token,
    });
}
