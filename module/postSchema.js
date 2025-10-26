import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  reply_content: { type: String, required: true, trim: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  likes: { type: [String], default: [] },
  reply: [replySchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", postSchema);
