import axios from "axios";

const BASE_URL = "https://project-1-server.onrender.com/api";


async function testEndpoints() {
  try {
    // 1️⃣ Get all posts
    const allPosts = await axios.get(`${BASE_URL}/post/all?page=1&limit=5`);
    console.log("✅ /post/all response:", allPosts.data);
  } catch (err) {
    console.error("❌ /post/all error:", err.response?.data || err.message);
  }

  try {
    // 2️⃣ Get random post
    const randomPost = await axios.get(`${BASE_URL}/post/random`);
    console.log("✅ /post/random response:", randomPost.data);
  } catch (err) {
    console.error("❌ /post/random error:", err.response?.data || err.message);
  }

  try {
    // 3️⃣ Get user by ID (replace with a real user ID from your DB)
    const userId = "68f08b1487c8419257ac1ea1";
    const userRes = await axios.get(`${BASE_URL}/post/user/${userId}`);
    console.log("✅ /post/user/:id response:", userRes.data);
  } catch (err) {
    console.error("❌ /post/user/:id error:", err.response?.data || err.message);
  }

  try {
    // 4️⃣ Add a new post (PATCH)
    const userId = "68f08b1487c8419257ac1ea1";
    const newPost = { title: "Test Post", content: "Hello from test script" };
    const addPost = await axios.patch(`${BASE_URL}/post/user/${userId}`, newPost);
    console.log("✅ PATCH /post/user/:id response:", addPost.data);
  } catch (err) {
    console.error("❌ PATCH /post/user/:id error:", err.response?.data || err.message);
  }
}

testEndpoints();
