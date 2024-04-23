import mongoose from "mongoose";

const postSchema = mongoose.Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        maxLength: 1024
    },
    img: {
        type: String
    },
    likes: {
        // array of user ids
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: "User",
        default: []
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    replies: [ {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            // Parent post ID
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
        userImg: {
            // To avoid a follow-up fetch request; cache their img url. 
            type: String
        },
        username: {
            type: String
        },
        text: {
            type: String,
            required: true
        },
        img: {
            type: String
        },
    } ],
    tags: {
        // array of user ids
        type: [ String ],
        default: []
    },
    meta: {
        // array of user ids
        type: [ String ],
        default: []
    },
}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true
} );

const Post = mongoose.model( "Post", postSchema );

export default Post;
