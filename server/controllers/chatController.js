import Message from "../schema/messageModel.js";
import Chat from "../schema/chatModel.js";
import Post from "../schema/postModel.js";
import User from "../schema/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { getRecieverSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import { upload, destroy } from '../utilities/cloudinaryUtils.js';

const sendMessage = async( req, res ) => {
    // console.log( "sendMessage" );
    try {
        const { receiverId, text } = req.body;
        let { img } = req.body;
        const senderId = req.user._id;

        // console.log(
        //     'SendMessage: ',
        //     "\n",
        //     "receiverId = ", receiverId,
        //     "\n",
        //     "senderId = ", senderId,
        //     "\n",
        //     "text = ", text,
        // );

        let chat = await Chat.findOne( {
            users: { $all: [ senderId, receiverId ] }
        } );
        let lastMessage = {
            text: text,
            senderId: senderId
        };

        if ( !chat ) {
            // Chat does not exist. Create a new one.
            chat = new Chat( {
                users: [
                    senderId,
                    receiverId
                ],
                lastMessage: lastMessage
            } );
            await chat.save();
        }

        if ( img ) {
            // We have image(s), upload beforehand.
            const imgUrl = await upload( img );
        }

        const message = new Message( {
            chatId: chat._id,
            senderId: senderId,
            text: text,
            img: img || "",
            /// attachments: [],
            /// reactions: reactions,
            /// seen: seen,
        } );

        // console.log( "Message: ", message );

        await Promise.all( [
            message.save(),
            chat.updateOne( {
                lastMessage: lastMessage
            } )
        ] );

        // Update all subscribers (sockets) of the new message in the chat.
        const receiverSocketId = getRecieverSocketId( receiverId );
        if ( receiverSocketId ) {
            io.to( receiverSocketId ).emit( "newMessage", message );
        }

        res.status( 201 ).json( { message: "Success", data: message } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in sendMessage: ", error.message );
    }
}

// Begins a new chat with participants; initializes with no messages.
const startChat = async( req, res ) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        // Chat does not exist. Create a new one.
        chat = new Chat( {
            users: [
                senderId,
                receiverId
            ],
            lastMessage: {
                text: "",
                senderId: senderId
            }
        } );
        await chat.save();

        res.status( 201 ).json( { message: "Successfully opened a new chat.", data: chat } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in sendMessage: ", error.message );
    }
}


const getPrivateMessages = async( req, res ) => {
    const { otherUserId } = req.params; // Sent in api endpoint
    const userId = req.user._id; // Sent in cookie
    // console.log( "getPrivateMessages -> otherUserId = ", otherUserId, " :: ", "userId = ", userId );
    const chatUsers = [ userId, otherUserId ];

    try {
        // Get the chat ID between these users. For now, just doing 2 at a time.
        const chat = await Chat.findOne( { users: { $all: chatUsers } } );

        if ( !chat ) {
            res.status( 404 ).json( { error: "Chat not found." } );
            return;
        }
        // Get messages with this chat ID.
        const messages = await Message.find( {
            chatId: chat._id
        } ).sort( { createdAt: -1 } );

        res.status( 200 ).json( { message: "Success", data: messages } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getPrivateMessages: ", error.message );
    }
}

// Get all messages between a logged in user and any other users attending a chat room.
// Expects: 
/*
    {
        "users": ["661c06c29c02e6cbd0900d9b", "661c054e7e779fb15b026c6c"]
    }
*/
const getGroupMessages = async( req, res ) => {
    const { otherUserId } = req.params; // Sent in api endpoint
    const userId = req.user._id; // Sent in cookie
    const chatUsers = req.body.users; // Sent in body.

    // console.log( "getGroupMessages -> chatUsers = ", chatUsers );

    try {
        // Get the chat ID between these users. For now, just doing 2 at a time.
        const chat = await Chat.findOne( { users: { $all: chatUsers } } );

        if ( !chat ) {
            res.status( 404 ).json( { error: "Chat not found." } );
            return;
        }
        // Get messages with this chat ID.
        const messages = await Message.find( {
            chatId: chat._id
        } ).sort( { createdAt: -1 } );

        res.status( 200 ).json( { message: "Success", data: messages } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getGroupMessages: ", error.message );
    }
}

// Get all chats a user is involved with.
const getChats = async( req, res ) => {
    const userId = req.user._id; // Sent in cookie
    // console.log( "getChats -> userId = ", req.user );

    try {
        // Find all chats this user is involved with.
        const chats = await Chat.find( {
            users: userId
        } ).populate( {
            path: 'users', // A reference to the User model, via the object type set in the schema. 
            select: 'username imgAvatar' // What fields to append from users
        } );

        res.status( 200 ).json( { message: "Success", data: chats } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getChats: ", error.message );
    }
}


export {
    sendMessage,
    startChat,
    getPrivateMessages,
    getGroupMessages,
    getChats
}
