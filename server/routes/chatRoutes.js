import express from "express";
import * as C from "../controllers/chatController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post( "/", protectRoute, C.sendMessage );

// Get all messages between a given logged in user, and N users
router.get( "/user", protectRoute, C.getChats );
router.get( "/user/:otherUserId", protectRoute, C.getPrivateMessages );
router.get( "/group", protectRoute, C.getGroupMessages );



export default router;
