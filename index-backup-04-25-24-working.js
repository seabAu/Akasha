import express from 'express';
import cors from 'cors';
const app = express();

import dotenv from 'dotenv';
dotenv.config();
const URL = 'localhost';
const PORT = 4100;

import path from 'path';
const __dirname = path.resolve();

app.use( express.static( 'public' ) ); // notice the absence of `__dirname`, explained later on

// if the request URL doesn't match anything in the 'public' folder, it will
// start searching here next.
app.use( express.static( 'client/dist' ) );

// from my testing, express will automatically locate index.html if it is in a
// static folder. Declaring a route is not required.

app.get( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'client', "dist", 'index.html' ) );
} );

app.use( express.json() );
app.use(
    cors( {
        // origin: "localhost",
        origin: "*",
    } ),
);

console.log( "path.join( __dirname, '/client/dist' ) = ", path.join( path.resolve(), "/client/dist" ) );
app.use( express.static( path.join( __dirname, "/client/dist" ) ) );

// react app
app.get( "*", ( req, res ) => {
    console.log( "Attempting to send index.html at: ", path.resolve( __dirname, 'client', 'dist', 'index.html' ) );
    res.sendFile( path.resolve( __dirname, "client", "dist", "index.html" ) );
    // res.sendFile( path.resolve( __dirname, "client", "dist", "assets", "index-CQRs3xKx.js" ) );
    // res.sendFile( path.resolve( __dirname, "client", "dist", "assets", "index-ByCNkNJ3.css" ) );
} );
// GET / => index.html GET /main.js => main.js

// Server.listen can handle handle both HTTP requests and socket events, better
// than express on its own.
app.listen( PORT, () => {
    console.log( `Server started at http://${URL}:${PORT}.` );
} );
