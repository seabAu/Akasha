import Post from "../schema/postModel.js";
import User from "../schema/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utilities/generateTokenAndSetCookie.js";
import mongoose from "mongoose";

import { v2 as cloudinary } from 'cloudinary';
import { upload, destroy } from '../utilities/cloudinaryUtils.js';


const createPost = async( req, res ) => {

    try {
        const { userId, text } = req.body;
        let { img } = req.body;
        console.log( "createPost: userId, text, img = ", userId, text, img );

        if ( !userId || !text ) {
            // If no userId or no text, return an error. 
            return res.status( 400 ).json( { error: "Fill in the required fields." } );
        }


        const user = await User.findById( userId );

        if ( !user ) {
            return res.status( 404 ).json( { error: "User not found" } );
        }

        if ( user._id.toString() !== req.user._id.toString() ) {
            // Not authorized to make a post for someone else.
            return res.status( 401 ).json( { error: "Not authorized to create post." } );
        }

        // Check post length.
        const maxLength = 1024;
        if ( text.length > maxLength ) {
            return res.status( 400 ).json( { error: `Post must be less than ${maxLength} characters.` } );
        }

        if ( img ) {
            const uploadedResponse = await cloudinary
                .uploader
                .upload( img );
            img = uploadedResponse.secure_url;
        }

        // TODO :: Add checking for code insertion here. IMPORTANT D:

        const newPost = new Post( { userId, text, img } );
        await newPost.save();

        res.status( 201 ).json( { message: "Post created successfully.", post: newPost } );

    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in createPost: ", error.message );
    }
}

// Get a specific post.
const getPost = async( req, res ) => {
    try {
        const post = await Post.findById( req.params.id );

        if ( !post ) {
            return res.status( 404 ).json( { error: "Post not found" } );
        }

        res.status( 200 ).json( { message: "Post fetched successfully", post } );

    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getPost: ", error.message );
    }
}

// Get all posts from all users
const getPosts = async( req, res ) => {
    try {
        const posts = await Post.find().sort( { createdAt: -1 } );

        res.status( 200 ).json( { data: posts } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getPosts: ", error.message );
    }
}

// Get all posts made by a specific user (displayed when viewing their profile)
const getUserPosts = async( req, res ) => {
    const { username } = req.params;
    try {
        // console.log( "getUserPosts: username = ", username );

        // First fetch the user via their unique username given via the request params.
        const user = await User.findOne( { username } );
        if ( !user ) {
            return res.status( 404 ).json( { error: `User '${username}' not found.` } );
        } else {
            const posts = await Post.find( { userId: user._id } ).sort( { createdAt: -1 } );
            res.status( 200 ).json( { message: `Posts for '${username}' fetched successfully.`, posts } );
        }
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getUserPosts: ", error.message );
    }
}

// Get all posts from followed users (requires to be given a user id to find which followers to find posts for)
const getFeedPosts = async( req, res ) => {
    try {
        const userId = req.user._id;
        const user = await User.findById( userId );

        if ( !user ) {
            return res.status( 404 ).json( { message: "User not found" } );
        }

        // Get IDs of accounts that this user is following.
        let following = user.following;

        // Add own ID to this list, so their own posts show up on the homepage.
        // console.log( following );
        following = [ ...following, userId ];


        const feedPosts = await Post.find( { userId: { $in: following } } ).sort( { createdAt: -1 } );
        // console.log( "getFeedPosts: feedPosts = ", feedPosts );

        res.status( 200 ).json( { feedPosts } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getFeedPosts: ", error.message );
    }
}

const getFeedPosts2 = async( req, res ) => {
    try {
        const { id: userId } = req.params;
        // const userId = req.user._id;
        const user = await User.findById( userId );

        if ( !user ) {
            return res.status( 404 ).json( { message: "User not found" } );
        }

        // console.log( user );

        const following = user.following;

        const feedPosts = await Post.find( { userId: { $in: following } } ).sort( { createdAt: -1 } );

        res.status( 200 ).json( { feedPosts } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in getFeedPosts: ", error.message );
    }
}

const replyPost = async( req, res ) => {
    try {
        const { text } = req.body;
        let { img } = req.body;

        if ( !text ) {
            return res.status( 404 ).json( { error: "You must enter text to reply." } );
        }

        // console.log
        const { id: postId } = req.params;
        const userId = req.user._id;
        const userImg = req.user.avatarImg;
        const username = req.user.username;

        const post = await Post.findById( postId );
        if ( !post ) {
            return res.status( 404 ).json( { error: "Post not found" } );
        }

        if ( img ) {
            const uploadedResponse = await cloudinary
                .uploader
                .upload( img );
            img = uploadedResponse.secure_url;
        }

        const reply = {
            userId: userId,
            postId: postId,
            userImg: userImg,
            username: username,
            text: text,
            img: img
        };

        post.replies.push( reply );
        await post.save();

        // console.log( "Reply: ", post );
        res.status( 200 ).json( { message: "Post replied to successfully.", post: post } );

    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in replyPost: ", error.message );
    }
}

const updatePost = async( req, res ) => {

}

const likePost = async( req, res ) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;
        const post = await Post.findById( postId );

        if ( !post ) {
            return res.status( 404 ).json( { error: "Post not found" } );
        }

        // Has this user liked this post already? 
        const userLikedPost = post.likes.includes( userId );
        if ( userLikedPost ) {
            // Already likes it, unlike.
            await Post.updateOne( { _id: postId, }, { $pull: { likes: userId } } );
            res.status( 200 ).json( { message: "Post un-liked successfully" } );
        } else {
            // Not yet like it, add to array.
            await Post.updateOne( { _id: postId, }, { $push: { likes: userId } } );
            res.status( 200 ).json( { message: "Post liked successfully" } );
        }

    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in deletePost: ", error.message );
    }
}

const deletePost = async( req, res ) => {

    try {
        const post = await Post.findById( req.params.id );

        if ( !post ) {
            return res.status( 404 ).json( { error: "Post not found" } );
        }

        if ( post.userId.toString() !== req.user._id.toString() ) {
            // Not authorized to make a post for someone else.
            return res.status( 401 ).json( { error: "Not authorized to delete post." } );
        }

        // If there are images involved, delete them from cloudinary.
        if ( post.img ) {
            const deleted = await destroy( post.img );
            // console.log( "deleted: ", deleted );
            // const imgId = post.img.split( "/" ).pop().split( "." )[ 0 ];
            // await cloudinary.uploader.destroy( imgId );
        }


        await Post.findByIdAndDelete( req.params.id );
        res.status( 200 ).json( { message: "Post deleted successfully." } );

    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } )
        console.log( "Error in deletePost: ", error.message );
    }
}

export {
    getPost,
    getFeedPosts,
    getUserPosts,
    getPosts,
    createPost,
    replyPost,
    likePost,
    deletePost,
    updatePost
}
