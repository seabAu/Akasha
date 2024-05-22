import User from "../schema/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const protectRoute = async( req, res, next ) => {
    // Middleware to protect certain routes that must first be authenticated.
    // Runs BEFORE any route controller functions are parsed.
    // console.log( "protectRoute: ", req, res, next );
    try {
        const token = req.cookies.jwt || req.header("x-auth-token");

        if ( !token ) {
            // Not authorized.
            return res.status( 401 ).json( { message: "Unauthorized." } );
        }
        const decoded = jwt.verify( token, process.env.JWT_SECRET );
        const user = await User.findById( decoded.userId ).select( "-password" );

        // If successful, append the user info. Requires being logged in with a valid session token cookie. 
        req.user = user;

        // Call the next function in the chain (route controller function(s)).
        next();

    } catch ( error ) {
        res.status( 500 ).json( { message: error.message } )
        console.log( "Error in protectRoute: ", error.message );
    }
}

export default protectRoute;
