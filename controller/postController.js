import mongoose from "mongoose";
import User from "../module/userSchema.js";

// Add a new post for a user
export const AddNewPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) return res.status(400).json({ error: "All fields required" });
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid user ID" });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newPost = { title, content };
    user.posts.push(newPost);
    await user.save();

    res.status(200).json({ message: "Post added!", posts: user.posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}; 

export const getPostsPaginated = async (req, res) => {
  console.log("GET /all route hit!");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const posts = await User.aggregate([
      { $unwind: "$posts" },
      { $sort: { "posts._id": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0, // keep as 0 if you don't want the user doc _id
          postId: "$posts._id",
          title: "$posts.title",
          content: "$posts.content",
          reply: "$posts.reply",
          userName: "$userName",
          userId: "$_id", // this will correctly give the user's ID
          likes: "$posts.likes" // add likes so frontend works
        },
      },
    ]);
    res.status(200).json({ posts, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// Get a single post by postId
export const getPostById = async (req, res) => {
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post ID" });

  try {
    const userWithPost = await User.findOne({ "posts._id": postId });
    if (!userWithPost) return res.status(404).json({ error: "Post not found" });

    const post = userWithPost.posts.id(postId).toObject();
    post.userName = userWithPost.userName;
    post.userId = userWithPost._id;

    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a reply to a post
export const addReplyToPost = async (req, res) => {
  const { postId } = req.params;
  const { reply_content } = req.body;

  if (!reply_content || !reply_content.trim()) return res.status(400).json({ error: "Reply content required" });
  if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ error: "Invalid post ID" });

  try {
    const userWithPost = await User.findOne({ "posts._id": postId });
    if (!userWithPost) return res.status(404).json({ error: "Post not found" });

    const post = userWithPost.posts.id(postId);
    post.reply.push({ reply_content });
    await userWithPost.save();

    res.status(200).json({ message: "Reply added!", reply: post.reply[post.reply.length - 1] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const GetOneUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Can't find user..." });
    }

    res.status(200).json({ message: "User found", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user from server..." });
  }
};


export const getRandomPost = async (req, res) => {
  try {
    const randomPost = await User.aggregate([
      { $unwind: "$posts" },
      { $sample: { size: 1 } },
      {
        $project: {
          _id: 0,
          postId: "$posts._id",
          title: "$posts.title",
          content: "$posts.content",
          reply: "$posts.reply",
          userName: "$userName",
          userId: "$_id",
          likes: "$posts.likes"
        },
      },
    ]);

    if (randomPost.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ post: randomPost[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




export const AddFollowers = async (req, res) => {
  const { id, local_id } = req.params; 

  try {
    const user = await User.findById(id);
    const localUser = await User.findById(local_id);

    if (!user || !localUser) {
      return res.status(404).json({ error: "User not found" });
    }

    
    if (user.followers.includes(local_id)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    // Update both sides
    user.followers.push(local_id);
    localUser.following.push(id);

    await user.save();
    await localUser.save();

    res.status(200).json({ message: "Followed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const RemoveFollower = async (req, res) => {
  const { id, local_id } = req.params; 

  try {
    const user = await User.findById(id);
    const localUser = await User.findById(local_id);

    if (!user || !localUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Not following check
    if (!user.followers.includes(local_id)) {
      return res.status(400).json({ error: "Not following this user" });
    }

    // Remove from arrays
    user.followers = user.followers.filter(f => f !== local_id);
    localUser.following = localUser.following.filter(f => f !== id);

    await user.save();
    await localUser.save();

    res.status(200).json({ message: "Unfollowed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
