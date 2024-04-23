// Main imports
import express from 'express';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from "cloudinary";

// const app = express();
import { app, server } from "./socket/socket.js";

// Environment variables
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;
const URL = process.env.URL || 'localhost';

// Cloudinary uploading.
// REPLACE THIS.
cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
} );

// Connect database.
import connectDB from './database/connectdb.js';
connectDB();


// API Middleware
app.use( express.json( { limit: "50mb" } ) ); // To parse JSON data in the request body.
app.use( express.urlencoded( { extended: true } ) ); // To parse form data in the request body.
app.use( cookieParser() );

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
app.post( '/api/preview', async( req, res ) => {
    console.log( req.body );
} );

app.use( "/api/users", userRoutes );
app.use( "/api/posts", postRoutes );
app.use( "/api/chats", chatRoutes );

// app.listen( PORT, () => { console.log( `Server started at http://${ URL }:${ PORT }` ); } );
// Server.listen can handle handle both HTTP requests and socket events, better than express on its own. 
server.listen( PORT, () => { console.log( `Server started at http://${ URL }:${ PORT }` ); } );
