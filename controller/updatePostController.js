import User from "../module/userSchema.js";

export const EditPost = async (req, res) => {
  const { id, post_id } = req.params;
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = user.posts.id(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the post
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    //Save the changes
    await user.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  const { id, post_id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = user.posts.id(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    
    post.deleteOne(); 

    await user.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
