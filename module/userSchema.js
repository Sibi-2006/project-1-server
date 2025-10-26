import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    reply_content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    likes: { type: [String], default: [] },
    reply: [replySchema],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, trim: true },
    userName: { type: String, required: true, trim: true },
    password: { type: String, required: true },

    followers: { type: [String], default: [] }, 
    following: { type: [String], default: [] }, 

    bio: { type: String, trim: true, default: "Add bio" },
    posts: [postSchema],
    savedPosts: { type:[String], default:[]},
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
