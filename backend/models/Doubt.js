import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: String,
  question: String,
  answers: [{ userId: String, answer: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Doubt", doubtSchema);
