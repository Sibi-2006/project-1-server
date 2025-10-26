import User from "../module/userSchema.js";
import bcrypt from "bcrypt";

//Get all users
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//Sign Up
export const postNewUser = async (req, res) => {
  const { userName, userId, password } = req.body;

  if (!userName || !userId || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: "userId is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, userId, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        userId: newUser.userId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Sign In
export const SignInUser = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const findUser = await User.findOne({ userId });

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password!!" });
    }

    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: findUser._id,
        userName: findUser.userName,
        userId: findUser.userId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit user
export const EditUser = async (req, res) => {
  const { id } = req.params;
  const { userName, userId, bio } = req.body;

  if (!userName || !userId || !bio) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, userId, bio },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
