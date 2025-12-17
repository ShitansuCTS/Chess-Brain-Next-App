"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { connectSocket } from "../../../lib/socket";
import { useParams } from "next/navigation";

const Chessboard = dynamic(
  () => import("react-chessboard").then((mod) => mod.Chessboard),
  { ssr: false }
);

export default function SessionRoom() {
  const { sessionId } = useParams();

  const gameRef = useRef(new Chess());
  const socketRef = useRef(null);

  const [fen, setFen] = useState(gameRef.current.fen());

  // 🔌 CONNECT SOCKET
  useEffect(() => {
    const init = async () => {
      // 1️⃣ Get logged-in user + token
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Not authenticated");
        return;
      }

      const data = await res.json();

      // 2️⃣ Connect socket WITH token
      const socket = connectSocket(data.token);
      socketRef.current = socket;

      // 3️⃣ Join room
      socket.emit("join-room", { roomId: sessionId });

      // 4️⃣ Listen for opponent moves
      socket.on("move", ({ move }) => {
        console.log("Received move:", move);
        gameRef.current.move(move);
        setFen(gameRef.current.fen());
      });
    };

    init();

    return () => socketRef.current?.disconnect();
  }, [sessionId]);


  // ♟️ LOCAL MOVE
  const onPieceDrop = (sourceSquare, targetSquare) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };

    const result = gameRef.current.move(move);
    if (!result) return false;

    setFen(gameRef.current.fen());

    // 📡 SEND MOVE TO OTHER USER
    socketRef.current.emit("move", {
      roomId: sessionId,
      move,
    });

    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        boardWidth={420}
      />
    </div>
  );
}
