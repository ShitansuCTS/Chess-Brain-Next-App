"use client";

import { useState, useEffect } from "react";

export default function SessionForm({ coachId }) {
    const [students, setStudents] = useState([]);
    const [title, setTitle] = useState("");
    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch students linked to this coach
    useEffect(() => {
        const fetchStudents = async () => {
            const res = await fetch("/api/coach/students", { credentials: "include" });
            const data = await res.json();
            setStudents(data.students || []);
        };
        fetchStudents();
    }, []);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        if (!title || !studentId || !date || !startTime || !endTime) {
            alert("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/sessions", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, studentId, date, startTime, endTime }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Session created successfully ✅");
                // Reset form
                setTitle("");
                setStudentId("");
                setDate("");
                setStartTime("");
                setEndTime("");
            } else {
                alert(data.message || "Failed to create session ❌");
            }
        } catch (err) {
            console.error(err);
            alert("Server error ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Create New Session</h2>
            <form onSubmit={handleCreateSession} className="space-y-3">
                <input
                    type="text"
                    placeholder="Session Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Creating..." : "Create Session"}
                </button>
            </form>
        </div>
    );
}
