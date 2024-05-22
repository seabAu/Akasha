import User from "../schema/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utilities/generateTokenAndSetCookie.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Post from "../schema/postModel.js";

const signupUser = async( req, res ) => {

    try {
        // Get the fields passed in by the user.
        const { name, email, username, password } = req.body;
        const user = await User.findOne( {
            $or: [ {
                email
            }, {
                username
            } ]
        } );

        if ( user ) {
            return res
                .status( 400 )
                .json( { error: "User already exists." } );
        }

        // Salt the password.
        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash( password, salt );

        const newUser = new User( {
            name,
            email,
            username,
            password: hashedPassword
        } );

        if ( newUser ) {
            const token = generateTokenAndSetCookie( newUser._id, res );
            newUser.token = token;
            await newUser.save();

            res
                .status( 201 )
                .json( {
                    token: token,
                    user: {
                        ...newUser,
                        password: '',
                        _id: newUser._id,
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        username: newUser.username,
                        token: token,
                    },
                    message: "Signed in successfully"
                } );
            console.log( "Signed in successfully" );
            // res.send( "Signed up successfully" );
        } else {
            // Something went wrong.
            res
                .status( 400 )
                .json( { error: 'Something went wrong. Invalid data received' } );
        }
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in signupUser: ", error.message );
    }
}

const authUser = async( req, res ) => {
    try
    {
        console.log( "AuthUser :: req.user.id = ", req.user.id );
        // let user = User
        //     .findById( req.user.userId )
        //     .select( "-password" );
        let user = req.user; 

        if ( user )
        {
            console.log("res.status = ", res.status, ", user = ", req.user);
            // res.json(user);
            // let authorized = [ "superadmin", "admin" ].includes( user.role.toString() );
            res.send({
                user: user,
                success: true,
                status: res.status,
                // message: `User ${authorized ? 'is' : 'is not'} authorized to enter admin areas`,
            });
        }
        else
        {
            res.send({
                user: {},
                success: false,
                message: "User not found; failed to authenticate with session token. Try logging out and then in.",
                status: res.status,
            });
        }
    } catch ( error ) {
        res.send({
            user: {},
            success: false,
            status: 500,
            message: error.message
        });
        // res.status( 500 ).json( { error: error.message } );
    }

    /*
    
    console.log(
        "userRoute.js :: api/users/auth/user",
        // " :: req = ",
        // req.headers,
        " :: res.data = ",
        res.data,
        " :: res.user = ",
        res.user,
    );
    // User.findById( req.user.id ).select( '-password' ).then( ( user ) => res.json( user ) );
    User.findById(req.user.id)
        .select("-password")
        .then((user) => {
            console.log("res.status = ", res.status, ", user = ", user);
            // res.json(user);
            let authorized = [ "superadmin", "admin" ].includes( user.role.toString() );
            res.send({
                user: {
                    id: user.id,
                    role: user.role,
                    token: user.token,
                    // auth: user.role === "admin",
                    auth: authorized,
                },
                success: true,
                status: res.status,
                message: `User ${authorized ? 'is' : 'is not'} authorized to enter admin areas`,
            });
        });
    */
};

const loginUser = async( req, res ) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne( { username } );
        console.log( "loginUser :: user = ", user );

        const isCorrectPass = await bcrypt.compare(
            password,
            ( ( user !== null )
                ?
                ( user.password )
                :
                ( "" )
            ) || ""
        );

        if ( ( !user ) || ( !isCorrectPass ) ) {
            return res
                .status( 400 )
                .json( { error: "Invalid username or password" } );
        }

        // On successful login, create a new token. Save it to the user document in the db, and send it back to the user. 
        let token = generateTokenAndSetCookie( user._id, res );
        user.token = token;
        user.last_login = new Date();
        user.save();

        // delete user.password; // delete user.email; delete user.updatedAt; user.id =
        // user._id; delete user._id; delete user.__v; console.log( user );

        res
            .status( 200 )
            .json( {
                // user: user,
                token: token,
                user: {
                    _id: user._id,
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    imgAvatar: user.imgAvatar,
                    imgBackground: user.imgBackground,
                    followers: user.followers,
                    following: user.following,
                    status: user.status,
                    isFrozen: user.isFrozen,
                    isPrivate: user.isPrivate,
                    settings: user.settings,
                    token: token
                },
                message: "User logged in successfully."
            } );

    } catch ( error ) {
        res
            .status( 500 )
            .json( { message: error.message } )
        console.log( "Error in signupUser: ", error.message );
    }
}

const logoutUser = ( req, res ) => {
    try {
        // Clear the cookie
        const { username, password } = req.body;
        res.cookie( "jwt", "", { maxAge: 1 } );
        res
            .status( 200 )
            .json( { message: `User logged out successfully.` } );
        console.log( "LogoutUser :: ", username, password );
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in logoutUser: ", error.message );
    }
}

const followUser = async( req, res ) => {
    try {
        // Clear the cookie
        const { id } = req.params; // Where the "/:id" is sent in the API Endpoint.
        const userToFollow = await User.findById( id );
        const currentUser = await User.findById( req.user._id );
        // const userToFollow = await User.findOne( { _id: id } ); const currentUser =
        // await User.findOne( { _id: req.user._id } );

        if ( id === req.user._id.toString() ) {
            return res
                .status( 400 )
                .json( { error: "You cannot follow/unfollow yourself." } );
        }

        if ( !userToFollow || !currentUser ) {
            return res
                .status( 400 )
                .json( { error: "User not found." } );
        }

        // See if we're already following this user.
        const isFollowing = currentUser
            .following
            .includes( id );

        if ( isFollowing ) {
            // Unfollow user. Modify current user following, then modify followers of
            // userToFollow.
            await User.findByIdAndUpdate( req.user._id, {
                $pull: {
                    following: id
                }
            } );
            await User.findByIdAndUpdate( id, {
                $pull: {
                    followers: req.user._id
                }
            } );
            res
                .status( 200 )
                .json( { message: "User unfollowed successfully" } );
        } else {
            // Follow user. Modify current user following, then modify followers of
            // userToFollow.
            await User.findByIdAndUpdate( req.user._id, {
                $push: {
                    following: id
                }
            } );
            await User.findByIdAndUpdate( id, {
                $push: {
                    followers: req.user._id
                }
            } );
            res
                .status( 200 )
                .json( { message: "User followed successfully" } );
        }
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in followUser: ", error.message );
    }
}

// Get all posts from all users
const getProfiles = async( req, res ) => {
    try {
        const users = await User
            .find()
            .select( "-password" )
            .select( "-updatedAt" )
            .sort( { createdAt: -1 } );
        res
            .status( 200 )
            .json( { data: users } );
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in getProfiles: ", error.message );
    }
}

const getProfile = async( req, res ) => {
    // Fetch username from params. Query is either username or userId
    const { query } = req.params;
    try {
        // Chain-select methods one by one, removing specific undesired fields that we
        // don't want the recipient to get.
        let user;

        // Query is userId
        if ( mongoose.Types.ObjectId.isValid( query ) ) {
            // Is a valid object ID.
            user = await User
                .findOne( { _id: query } )
                .select( "-password" )
                .select( "-updatedAt" );
        } else {
            // console.log( "Test" );
            user = await User
                .findOne( { username: query } )
                .select( "-password" )
                .select( "-updatedAt" );
        }

        // console.log( "getProfile: ", user, query );

        if ( !user ) {
            return res
                .status( 400 )
                .json( { error: "User not found" } );
        }

        res
            .status( 200 )
            .json( { message: "Fetched profile successfully", user: user } );
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in getProfile: ", error.message );
    }
}

const getUserProfile = async( req, res ) => {
    // Fetch username from params. Query is either username or userId
    const { username } = req.params;
    try {
        // Chain-select methods one by one, removing specific undesired fields that we
        // don't want the recipient to get.
        const user = await User
            .findOne( { username } )
            .select( "-password" )
            .select( "-updatedAt" );
        if ( !user )
            return res.status( 400 ).json( { error: "User not found" } );

        res
            .status( 200 )
            .json( { message: "Fetched profile successfully", user: user } );
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in getProfile: ", error.message );
    }
}

const deleteUser = async( req, res ) => {
    // Delete account from params.
    try {
        const user = await User.findById( req.params.id );
        console.log( "DeleteUser => req.params.id = ", req.params.id );

        if ( !user ) {
            return res
                .status( 404 )
                .json( { error: "User not found" } );
        }

        if ( user._id.toString() !== req.user._id.toString() ) {
            // Not authorized to make a post for someone else.
            return res
                .status( 401 )
                .json( { error: "Not authorized to delete this user." } );
        }

        await User.findByIdAndDelete( req.params.id );
        res
            .status( 200 )
            .json( { message: "User deleted successfully." } );

    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in deleteUser: ", error.message );
    }
}

const getSuggestedUsers = async( req, res ) => {
    // Need to find all users that are not the current user, as well as not already
    // one of current user's followers.
    if ( req.hasOwnProperty( "user" ) ) {
        if ( req.user._id ) {
            // Valid input, proceed.
            const userId = req.user._id;
            try {
                const user = await User.findById( userId );
                // const usersFollowed = user.following;
                const usersFollowed = await User.findById( userId ).select( "following" );
                // console.log( "getSuggestedUsers: user = ", user, "\n", "usersFollowed = ", usersFollowed );

                const users = await User.aggregate( [ {
                    $match: {
                        _id: {
                            // $ne = Not Equal To
                            $ne: userId
                        }
                    }
                }, {
                    // Limit size to 10.
                    $sample: {
                        size: 10
                    }
                } ] );

                const filteredUsers = users.filter( ( user => !usersFollowed.following.includes( user._id ) ) );
                const suggestedUsers = filteredUsers.slice( 0, 8 );

                // Remove passwords from response.
                suggestedUsers.forEach( user => user.password = null );

                res
                    .status( 200 )
                    .json( { message: "Suggested users found successfully.", users: suggestedUsers } );

            } catch ( error ) {
                res
                    .status( 500 )
                    .json( { error: error.message } )

                console.log( "Error in getSuggestedUsers: ", error.message );
            }
        }
    }

}

const freezeAccount = async( req, res ) => {
    try {
        const user = await User.findById( req.user._id );
        if ( !user ) {
            return res.status( 400 ).json( { error: "User not found" } );
        }

        user.isFrozen = true;
        await user.save();

        res.status( 200 ).json( { success: true } );
    } catch ( error ) {
        res.status( 500 ).json( { error: error.message } );
    }
};

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY MANIPULATION
// This applies the properties of spliceObj to each object in the objArray.
const SpliceObjArray = ( objArray, spliceObj ) => {
    if ( Array.isArray( objArray ) ) {
        return objArray.map( ( obj ) => {
            return Object.assign( obj, spliceObj );
        } );
    } else {
        // * console.log("OBJUTILS.JS :: SpliceObjArray :: objArray = ", objArray, "\nspliceObj = ", spliceObj, "\nError: Bad input.");
        return objArray;
    }
};
const mergeProps = ( src, tgt ) => {
    // Accepts two objects; src is the object being edited, inputs is the object containing only the properties that are being updated.
    // console.log( "tgt = ", tgt, ", src = ", src );
    if ( Object.keys( src ).length ) {
        if ( src._doc && Object.keys( tgt ).length ) {
            let merged = {}; // = src;
            // console.log( "tgt keys = ", Object.keys( tgt ) );
            // console.log( "src keys = ", Object.keys( src ) );
            // console.log( "src._doc keys = ", Object.keys( src._doc ) );
            Object.keys( src._doc ).forEach( ( key, index ) => {
                let tgtValue = tgt[ key ];
                let srcValue = src[ key ];

                // console.log( "MergeProps :: CHECK key \"", key, "\"", " => ", srcValue, ", ", tgtValue );
                if ( tgt[ key ] ) {
                    // Input has this property.
                    merged = {...merged, [ key ]: tgtValue };
                    // console.log( "MergeProps :: UPDATE key \"", key, "\"", " to ", tgtValue, " :: ", "merged = ", merged );
                } else {
                    merged = {...merged, [ key ]: srcValue };
                    // console.log( "MergeProps :: SAVE key \"", key, "\"", " to ", srcValue, " :: ", "merged = ", merged );
                }
            } );
            return merged;
        } else {
            return src;
        }
    } else {
        return src;
    }
}

const swapIfValid = ( src, tgt ) => {
    if ( tgt !== null && tgt !== undefined ) {
        if ( tgt !== "" ) {
            if ( src !== tgt ) {
                return tgt;
            }
        }
    }
    return src;
}

const updateUser = async( req, res ) => {
    const {
        name,
        username,
        email,
        password,
        // followers, following,
        status,
        bio,
        settings,
        isFrozen,
        isVisible,
        isVerified,
        isPrivate
    } = req.body;
    let { imgAvatar, imgBackground } = req.body;
    let userUpdate = req.body;

    const userId = req.user._id;

    // console.log( req.body, req.user );

    try {
        let user = await User.findById( userId );
        console.log( "UpdateUser -> user = ", user, "\n\n\n", "userUpdate = ", userUpdate );
        if ( !user )
            return res.status( 400 ).json( { error: "User not found" } );

        if ( req.params.id !== userId.toString() )
            return res.status( 400 ).json( { error: "You cannot update other user's profile" } );

        if ( userUpdate.password ) {
            // Salt the password.
            const salt = await bcrypt.genSalt( 10 );
            const hashedPassword = await bcrypt.hash( password, salt );
            userUpdate.password = hashedPassword;
        }

        // console.log( "Data: ", user );

        // TODO :: Add in a way to convert the base 64 images back into image files,
        // saved on a server-local CDN of sorts.
        /*

        if ( imgBackground ) {
            if ( user.imgBackground ) {
                await cloudinary
                    .uploader
                    .destroy( user.imgBackground.split( "/" ).pop().split( "." )[ 0 ] );
            }

            const uploadedResponse = await cloudinary
                .uploader
                .upload( imgBackground );
            imgBackground = uploadedResponse.secure_url;
        }
        */

        if ( userUpdate.imgAvatar ) {
            if ( user.imgAvatar ) {
                // Delete existing uploaded image
                await cloudinary
                    .uploader
                    .destroy( user.imgAvatar.split( "/" ).pop().split( "." )[ 0 ] );
            }

            const uploadedResponse = await cloudinary
                .uploader
                .upload( imgAvatar );

            userUpdate.imgAvatar = uploadedResponse.secure_url;
        }

        // Update values if present in req.body;
        user.name = swapIfValid( user.name, userUpdate.name );
        user.username = swapIfValid( user.username, userUpdate.username );
        user.email = swapIfValid( user.email, userUpdate.email );
        user.imgAvatar = swapIfValid( user.imgAvatar, userUpdate.imgAvatar );
        user.status = swapIfValid( user.status, userUpdate.status );
        user.bio = swapIfValid( user.bio, userUpdate.bio );
        user.isFrozen = swapIfValid( user.isFrozen, userUpdate.isFrozen );
        user.isVisible = swapIfValid( user.isVisible, userUpdate.isVisible );
        user.isPrivate = swapIfValid( user.isPrivate, userUpdate.isPrivate );
        user.isVerified = swapIfValid( user.isVerified, userUpdate.isVerified );
        user.settings = swapIfValid( user.settings, userUpdate.settings );
        user.id = userUpdate.userId;

        // // console.log( "Updated user = ", user );
        //const merged = mergeProps( user, userUpdate );

        //user._doc = merged;
        // console.log( "Merged = ", merged, "\n\n", "user ", user );
        user = await user.save();

        // Case for when user changes username - have to update posts and replies. Find
        // all posts that this user replied to and update username and imgAvatar fields.
        await Post.updateMany( {
            "replies.userId": userId
        }, {
            $set: {
                "replies.$[reply].username": user.username,
                "replies.$[reply].userImg": user.imgAvatar
            }
        }, {
            arrayFilters: [ {
                "reply.userId": userId
            } ]
        } );

        res
            .status( 200 )
            .json( {
                message: "Profile updated successfully.",
                user: {
                    _id: user._id,
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    bio: user.bio,
                    status: user.status,
                    imgAvatar: user.imgAvatar,
                    imgBackground: user.imgBackground,
                    followers: user.followers,
                    following: user.following,
                    isFrozen: user.isFrozen,
                    isPrivate: user.isPrivate,
                    isVerified: user.isVerified,
                    settings: user.settings
                }
            } );
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in followUser: ", error.message );
    }
}

const controllerBoilerplate = async( req, res ) => {
    try {
        const data = req.body;

        console.log( "Finished successfully. Data: ", data );
        res.send( "Finished successfully. Data: ", data );

        res
            .status( 201 )
            .json( {
                message: "Finished successfully. Data: " + JSON.stringify( data ),
                data: {
                    data
                }
            } );
    } catch ( error ) {
        res
            .status( 500 )
            .json( { error: error.message } )
        console.log( "Error in signupUser: ", error.message );
    }
}

export {
    signupUser,
    loginUser,
    authUser,
    logoutUser,
    followUser,
    updateUser,
    deleteUser,
    getProfile,
    getProfiles,
    getSuggestedUsers,
    freezeAccount
};
