"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { connectSocket } from "../../../lib/socket";

export default function SessionRoom() {
  const { sessionId } = useParams();
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const init = async () => {
      // 1️⃣ Get auth token (cookie)
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      // 2️⃣ Connect socket
      const sock = connectSocket(data.token);
      setSocket(sock);

      // 3️⃣ Join session room
      sock.emit("join-room", { roomId: sessionId });
      setStatus("Connected to room");
    };

    init();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-xl font-semibold">Live Session</h1>
      <p className="mt-2 text-gray-600">Session ID: {sessionId}</p>
      <p className="mt-4 text-green-600">{status}</p>
    </div>
  );
}
