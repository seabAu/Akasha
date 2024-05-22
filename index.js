// Main imports
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors';
// const path = require( 'path' );

// Environment variables
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5100;
const URL = process.env.URL || 'localhost';
const __dirname = path.resolve();

// const app = express();
import { app, server } from "./server/socket/socket.js";

app.use( express.json() );
app.use(
    cors( {
        // origin: "localhost",
        origin: "*",
    } ),
);


// Cloudinary uploading.
// REPLACE THIS.
cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
} );

// Connect database.
import connectDB from './server/database/connectdb.js';
connectDB();


// API Middleware
app.use( express.json( { limit: "50mb" } ) ); // To parse JSON data in the request body.
app.use( express.urlencoded( { extended: true } ) ); // To parse form data in the request body.
app.use( cookieParser() );

// Routes
import userRoutes from "./server/routes/userRoutes.js";
import postRoutes from "./server/routes/postRoutes.js";
import chatRoutes from "./server/routes/chatRoutes.js";
app.post( '/api/preview', async( req, res ) => {
    console.log( req.body );
} );

// app.use( "*", ( req, res ) => {
//     console.log( "/* => Request = ", req.originalUrl );
// } );
app.use( "/api/users", userRoutes );
app.use( "/api/posts", postRoutes );
app.use( "/api/chats", chatRoutes );

// Server.listen can handle handle both HTTP requests and socket events, better than express on its own. 
server.listen( PORT, () => {
    // if ( process.env.DEBUG ) console.log( `Server.js :: server.listen(PORT) :: environment variables are currently: `, process.env );
    if ( process.env.DEBUG ) console.log( `Server.js :: server.listen(${PORT})` );
    console.log( `Server started at http://${ URL }:${ PORT }` );
} );

console.log( 'process.env.NODE_ENV = \"', process.env.NODE_ENV, "\"" );
console.log( '__dirname = \"', __dirname, "\"" );

if ( process.env.NODE_ENV === "production" ) {
    app.use( express.static( path.join( __dirname, "/client/dist" ) ) );

    // react app
    app.get( "*", ( req, res ) => {
        res.send( "app.get(/) => Production" );
        console.log( "Attempting to send index.html at: ", path.resolve( __dirname, 'client', 'dist', 'index.html' ) );
        res.sendFile( path.resolve( __dirname, "client", "dist", "index.html" ) );
        // res.sendFile( path.resolve( __dirname, "client", "dist", "assets", "index-CQRs3xKx.js" ) );
        // res.sendFile( path.resolve( __dirname, "client", "dist", "assets", "index-ByCNkNJ3.css" ) );
    } );
} else {
    app.get( "/", ( req, res ) => {
        res.send( "app.get(/) => Please set to production" );
    } );
    app.get( "*", ( req, res ) => {
        res.send( "app.get(*) => Please set to production" );
    } );
}

// server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

// On production, serve static built site.
// if ( process.env.NODE_ENV === 'production' ) {
//     app.use( express.static( 'client/dist' ) );
//     app.get( '*', ( req, res ) => {
//         // if ( process.env.DEBUG ) console.log( `Server.js :: app.get(//) :: environment variables are currently: `, process.env );
//         console.log( "Attempting to send index.html at: ", path.resolve( __dirname, '../client', 'dist', 'index.html' ) );
//         res.sendFile( path.resolve( __dirname, '../client', 'dist', 'index.html' ) ); // change as per your index.html 
//         res.send(
//             `Server currently running in the "${process.env.NODE_ENV}" environment."`,
//         );
//     } );
// } else {
//     app.get( "*", ( req, res ) => {
//         // if ( process.env.debug ) console.log( `Server.js :: app.get(//) :: environment variables are currently: `, process.env );
//         if ( process.env.debug ) console.log( `Server.js :: app.get(//)` );
//         res.send(
//             `Server currently running in the "${process.env.NODE_ENV}" environment. Please set to "production"`,
//         );
//     } );
// }
// if (['production'].includes(process.env.NODE_ENV)) {
//     app.use(express.static('client/build'));
// 
//     const path = require('path');
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve('client', 'dist', 'index.html'));
//     });
// }
