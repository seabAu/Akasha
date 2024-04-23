import express from "express";
import * as C from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
// Root endpoint = "/api/posts".

// API ENDPOINTS
// /API/USERS/SIGNUP
// router.get( "/:username", C.getPosts ); // Get all posts for user.
router.get( "/", C.getPosts ); // Get all posts.
router.get( "/:id", C.getPost ); // Get specific post.
router.post( "/feed", protectRoute, C.getFeedPosts ); // Get all posts.
// router.get( "/feed/:id", protectRoute, C.getFeedPosts ); // Get all posts for user
router.get( "/user/:username", C.getUserPosts ); // Get all posts for user
router.post( "/create", protectRoute, C.createPost ); // Function cannot get the signed in user ID without protectRoute. 

// PROTECTED ROUTES
router.post( "/reply/:id", protectRoute, C.replyPost );
router.put( "/like/:id", protectRoute, C.likePost );
router.post( "/update/:id", protectRoute, C.updatePost );
router.delete( "/:id", protectRoute, C.deletePost );

export default router;
