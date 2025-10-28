import express from "express";
import { 
  AddNewPost, 
  GetOneUser, 
  getRandomPost, 
  getPostsPaginated,
  getPostById,
  addReplyToPost,
  AddFollowers,
  RemoveFollower
} from "../controller/postController.js";
import { AddLike , Unlike } from "../controller/likesController.js";
import { EditPost , deletePost } from "../controller/updatePostController.js";
import { savePost , getSavedPost, unSavePost } from "../controller/saveController.js";
import { getFollowers , getFollwing} from "../controller/followController.js"
const Postrouter = express.Router();

// Get all posts (paginated)
Postrouter.get("/all", getPostsPaginated);

// Get random post
Postrouter.get("/random", getRandomPost);

// Get one user by ID (must come before /:postId)
Postrouter.get("/user/:id", GetOneUser);

// Add new post for a user
Postrouter.patch("/user/:id", AddNewPost);
//Add replay
Postrouter.post("/:postId/reply",addReplyToPost);

// Follow / unfollow routes
Postrouter.patch("/user/followers/:id/:local_id", AddFollowers);
Postrouter.patch("/user/unfollow/:id/:local_id", RemoveFollower);

//to show following and followers
Postrouter.get("/user/:id/followers",getFollowers);
Postrouter.get("/user/:id/following",getFollwing)
// Likes
Postrouter.patch("/user/like/:userId/:local_id/:postId", AddLike);
Postrouter.patch("/user/unlike/:userId/:local_id/:postId", Unlike);

// Edit post
Postrouter.patch("/user/editpost/:id/:post_id", EditPost);

// Delete post
Postrouter.delete("/user/deletepost/:id/:post_id", deletePost);

// Save post
Postrouter.post("/user/:userId/save/:postId", savePost);
Postrouter.get("/user/:userId/save", getSavedPost);
Postrouter.patch('/user/:userId/unsave/:postId', unSavePost);

// Get single post by postId (must be last to avoid conflicts)
Postrouter.get("/:postId", getPostById);

export default Postrouter;
