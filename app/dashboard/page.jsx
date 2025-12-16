"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionForm from "../../components/SessionForm"

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);


    useEffect(() => {
        const init = async () => {
            try {
                // 1️⃣ Get logged-in user
                const meRes = await fetch("/api/auth/me", {
                    credentials: "include",
                });

                if (!meRes.ok) {
                    router.push("/login");
                    return;
                }

                const meData = await meRes.json();
                setUser(meData.user);

                // 2️⃣ Role-based data
                if (meData.user.role === "coach") {
                    const res = await fetch("/api/coach/students", {
                        credentials: "include",
                    });
                    const data = await res.json();
                    setStudents(data.students || []);
                }

                if (meData.user.role === "student") {
                    const res = await fetch("/api/student/coach", {
                        credentials: "include",
                    });
                    const data = await res.json();
                    setCoach(data.coach || null);
                }


                if (meData.user.role === "coach") {
                    const res = await fetch("/api/sessions/coach", { credentials: "include" });
                    const data = await res.json();
                    setSessions(data.sessions || []);
                }

                if (meData.user.role === "student") {
                    const res = await fetch("/api/sessions/student", { credentials: "include" });
                    const data = await res.json();
                    setSessions(data.sessions || []);
                }


            } catch (err) {
                console.error(err);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        router.push("/login");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    {user && (
                        <p className="text-sm text-gray-600">
                            {user.name} · <span className="capitalize">{user.role}</span>
                        </p>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                >
                    Logout
                </button>
            </div>

            {/* Content */}
            <div className="mt-6 bg-white p-6 rounded shadow">
                {/* COACH VIEW */}
                {user?.role === "coach" && (
                    <>
                        <h2 className="text-lg font-semibold mb-4">My Students</h2>

                        {students.length === 0 ? (
                            <p className="text-gray-500">No students assigned yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {students.map((s) => (
                                    <li
                                        key={s._id}
                                        className="border rounded p-3"
                                    >
                                        <p className="font-medium">{s.name}</p>
                                        <p className="text-sm text-gray-500">{s.email}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div>
                            <h2>Create Session</h2>
                            <SessionForm students={students} />
                        </div>
                    </>
                )}

                {/* STUDENT VIEW */}
                {user?.role === "student" && (
                    <>
                        <h2 className="text-lg font-semibold mb-4">My Coach</h2>

                        {coach ? (
                            <div className="border rounded p-4">
                                <p className="font-medium">{coach.name}</p>
                                <p className="text-sm text-gray-500">{coach.email}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Coach not assigned yet.</p>
                        )}
                    </>
                )}



                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">My Sessions</h2>

                    {sessions.length === 0 ? (
                        <p className="text-gray-500">No sessions scheduled.</p>
                    ) : (
                        <ul className="space-y-3">
                            {sessions.map((s) => (
                                <li key={s._id} className="border rounded p-3">
                                    <p className="font-medium">Title: {s.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {user.role === "coach"
                                            ? `Student: ${s.studentId.name} (${s.studentId.email})`
                                            : `Coach: ${s.coachId.name} (${s.coachId.email})`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Date: {s.date} | Time: {s.startTime} - {s.endTime}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}
