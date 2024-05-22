import express from "express";
import * as C from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();
// Root endpoint = "/api/users".

// API ENDPOINTS
// /API/USERS/SIGNUP
// Authentication routes.
router.post( "/signup", C.signupUser );
router.post( "/login", C.loginUser );
router.post( "/logout", protectRoute, C.logoutUser );
router.get( "/suggested", protectRoute, C.getSuggestedUsers );
router.get( "/auth", protectRoute, C.authUser );

// Get profile data for a user.
router.get( "/profile/:query", C.getProfile );

// Get all users.
router.get( "/", C.getProfiles );


// PROTECTED ROUTES
router.post( "/follow/:id", protectRoute, C.followUser );
router.put( "/update/:id", protectRoute, C.updateUser );
router.put( "/freeze", protectRoute, C.freezeAccount );
router.delete( "/:id", protectRoute, C.deleteUser );

export default router;
