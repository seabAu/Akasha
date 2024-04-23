import mongoose from "mongoose";

const messageSchema = new mongoose.Schema( {
    chatId: {
        // The chat this message belongs to.
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    senderId: {
        // The user that sent it
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String
    },
    img: {
        type: String,
        default: ""
    },
    attachments: {
        type: [ String ],
        default: []
    },
    reactions: {
        // array of user ids
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: "User",
        default: []
    },
    seen: {
        type: Boolean,
        default: false
    },

}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true,
    _id: true
} );

const Message = mongoose.model( "Message", messageSchema );

export default Message;
