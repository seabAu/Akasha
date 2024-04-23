import mongoose from "mongoose";

const userSchema = mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    imgAvatar: {
        type: String,
        default: ""
    },
    imgBackground: {
        type: String,
        default: ""
    },
    followers: {
        type: [ String ],
        default: []
    },
    following: {
        type: [ String ],
        default: []
    },
    status: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    settings: {
        type: [ {} ]
    },
    permissions: {
        type: [ {} ]
    }
}, {
    // This adds "createdAt" and "updatedAt" timestamps automatically.
    timestamps: true,
    _id: true
} );

const User = mongoose.model(
    "User",
    userSchema
);

export default User;
