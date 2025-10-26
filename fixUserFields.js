import mongoose from "mongoose";
import User from "./module/userSchema.js"; // path to your schema
import { getDataBase } from "./db.js";     // your DB connection

async function updateAllUsersSavedPosts() {
  try {
    await getDataBase();

    // Find all users that don't have savedPosts or it's not an array
    const users = await User.find({
      $or: [
        { savedPosts: { $exists: false } },
        { savedPosts: { $not: { $type: "array" } } }
      ]
    });

    if (users.length === 0) {
      console.log("✅ All users already have savedPosts initialized");
      return;
    }

    for (const user of users) {
      user.savedPosts = [];
      await user.save();
      console.log(`Updated savedPosts for user ${user._id}`);
    }

    console.log(`✅ Updated ${users.length} users`);

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

updateAllUsersSavedPosts();
