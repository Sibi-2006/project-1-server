import User from "../module/userSchema.js";

export const getFollowers = async (req, res) => {
  const { id } = req.params;

  try {
    // Wait for the user to be fetched
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get all follower IDs from the user
    const followerIds = user.followers || [];

    // Fetch all follower user documents in parallel
    const allFollowers = await Promise.all(
      followerIds.map((followerId) => User.findById(followerId).select("-password"))
    );

    res.status(200).json({
      message: "Found all followers",
      allFollowers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFollwing =async (req,res)=>{
  const { id } = req.params;
  try {
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

   
    const followingId = user.following || [];

    const allfollowings = await Promise.all(
      followingId.map((followerId) => User.findById(followerId).select("-password"))
    );

    res.status(200).json({
      message: "Found all followers",
      allfollowings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}