import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        coachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["scheduled", "completed", "canceled"],
            default: "scheduled",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
