import mongoose from "mongoose";

const chatSchema = new mongoose.Schema( {
    users: [ {
        // The conversation this message belongs to.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } ],
    lastMessage: {
        // The user that sent it
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seen: {
            type: Boolean,
            default: false,
        },
    }
}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true,
    _id: true
} );

const Chat = mongoose.model( "Chat", chatSchema );

export default Chat;
