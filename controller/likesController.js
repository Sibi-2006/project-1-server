import User from "../module/userSchema.js";

export const AddLike = async (req, res) => {
  const { userId, local_id, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = user.posts.id(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.likes.includes(local_id)) {
      return res.status(400).json({ error: "Already liked this post" });
    }

    post.likes.push(local_id);
    await user.save();

    res.status(200).json({
      message: "Post liked successfully!",
      likes: post.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const Unlike = async (req, res) => {
  const { userId, local_id, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = user.posts.id(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.likes.includes(local_id)) {
      return res.status(400).json({ error: "Haven't liked this post" });
    }

    post.likes = post.likes.filter((f) => f !== local_id);
    await user.save();

    res.status(200).json({
      message: "Post unliked successfully!",
      likes: post.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
