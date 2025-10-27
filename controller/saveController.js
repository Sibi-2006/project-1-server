import User from "../module/userSchema.js";

// Save a post
export const savePost = async (req, res) => {
  const { userId, postId } = req.params;

  try {
    // 👉 Use findById if userId is Mongo _id
    const user = await User.findById(userId);
    // const user = await User.findOne({ userId }); // use this if it's your custom field

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    user.savedPosts.push(postId);
    await user.save();

    res.status(200).json({
      message: "Post saved successfully",
      savedPosts: user.savedPosts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all saved posts
export const getSavedPost = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    

    if (!user) return res.status(404).json({ message: "User not found" });

    const allUsers = await User.find({}, "posts");

    const savedPosts = [];
    for (const postId of user.savedPosts) {
      for (const u of allUsers) {
        const post = u.posts.id(postId);
        if (post) savedPosts.push(post);
      }
    }

    res.status(200).json({ savedPosts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const unSavePost = async (req, res) => {
  const { userId, postId } = req.params;

  try {
    // 1️⃣ Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Check if post exists in savedPosts
    const isSaved = user.savedPosts.includes(postId);
    if (!isSaved)
      return res.status(400).json({ message: "Post not found in saved posts" });

    // 3️⃣ Remove post from savedPosts
    user.savedPosts = user.savedPosts.filter(
      (id) => id.toString() !== postId.toString()
    );

    // 4️⃣ Save updated user
    await user.save();

    // 5️⃣ Respond success
    res.status(200).json({ message: "Post unsaved successfully" });
  } catch (err) {
    console.error("Error in unSavePost:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

