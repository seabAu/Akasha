import { Server } from "socket.io";

// Create an HTTP server.
import http from 'http';

// Create an express app, and bind it with the http server instance
import express from 'express';
import { receiveMessageOnPort } from "worker_threads";
import Message from "../schema/messageModel.js";
import Chat from "../schema/chatModel.js";
const app = express();
const server = http.createServer( app );

// 
const io = new Server( server, {
    cors: {
        origin: "http://localhost:3000",
        methods: [ "GET", "POST" ]
    }
} );

// User id hashmap.
const userSocketMap = {} // userId: socketId

export const getRecieverSocketId = ( receiverId ) => {
    console.log( "receiverId = ", receiverId );
    return userSocketMap[ receiverId ];
}

io.on( 'connection', ( socket ) => {
    // The socket is the user that just connected.
    console.log( "User connected: ", socket.id );

    // This is sent to the backend via:
    //// const socket = io( "http://localhost:5000", {
    ////     query: {
    ////         userId: user?._id
    ////     }
    //// } );

    const userId = socket.handshake.query.userId;
    if ( userId != "undefined" ) {
        // Update socket hash map.
        userSocketMap[ userId ] = socket.id;
    }

    io.emit( "getOnlineUsers", Object.keys( userSocketMap ) ); // Emit event with key of each user.

    socket.on( "markMessageSeen", async( { chatId, userId } ) => {
        try {
            // Update all messages in this conversation to be 'seen'. 
            await Message.updateMany( { chatId: chatId, seen: false }, { $set: { seen: true } } );
            await Chat.updateOne( { _id: chatId }, { $set: { "lastMessage.seen": true } } );

            // Send this event to other users in this chat.
            io.to( userSocketMap[ userId ] ).emit( "messagesSeen", { chatId } );
        } catch ( error ) {
            console.log( error );
        }
    } )

    socket.on( "disconnect", () => {
        console.log( "User disconnected: ", socket.id );

        // Delete user socket from the hash map.
        delete userSocketMap[ userId ];
        io.emit( "getOnlineUsers", Object.keys( userSocketMap ) );
    } );
} );

export { io, server, app };
