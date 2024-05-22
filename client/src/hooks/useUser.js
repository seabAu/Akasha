import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useAuth from './useAuth';


// To avoid duplicating code for fetching a given user's data. 
const useUser = () => {
    const showToast = useShowToast();
    const [ user, setUser ] = useState( null );
    const [ loading, setLoading ] = useState( true );
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    const { handleLogout } = useAuth();

    // Fetch all users.
    const getUsers = async() => {
        // console.log( "getUser -> username = ", username );
        setLoading( true );
        try {
            const res = await fetch( `/api/users/` );
            const data = await res.json();

            // console.log( "useUser -> data: ", data );
            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
            } else {
                // Success
                showToast( "Success", data.message, "success" );
                setUser( data.user );
                // console.log( "useUser -> success -> data.user: ", user );
            }
        } catch ( error ) {
            console.error( "Error in getUser: ", error );
        } finally {
            console.log( "useUser -> finally -> user: ", user );
            setLoading( false );
        }
    };

    const handleAccountFreeze = async() => {
        if ( !window.confirm( "Are you sure you want to freeze your account?" ) ) return;

        try {
            const res = await fetch( "/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            } );
            const data = await res.json();

            if ( data.error ) {
                return showToast( "Error", data.error, "error" );
            }
            if ( data.success ) {
                await handleLogout();
                showToast( "Success", "Your account has been frozen", "success" );
            }
        } catch ( error ) {
            showToast( "Error", error.message, "error" );
        }
    };

    return ( { handleAccountFreeze, user, loading, getUsers } );
}

const useUserFollow = ( user ) => {
    const currentUser = useRecoilValue( userAtom );
    const [ following, setFollowing ] = useState( user?.followers.includes( currentUser._id ) );
    const [ loading, setLoading ] = useState( false );
    const showToast = useShowToast();

    const followUser = async() => {
        setLoading( true );
        try {
            const res = await fetch( `/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            } )
            const data = await res.json();

            /// console.log( "followUser -> data: ", data );
            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
                return;
            } else {
                // Success
                showToast( "Success", data.message, "success" );
                /// console.log( "followUser -> success -> data.user: ", user );
                if ( following ) {
                    showToast( "Success", `Unfollowed ${user.name}`, "success" );
                    user.followers.pop(); // simulate removing from followers
                } else {
                    showToast( "Success", `Followed ${user.name}`, "success" );
                    user.followers.push( currentUser._id ); // simulate adding to followers
                }
                setFollowing( !following );
            }
        } catch ( error ) {
            console.error( "Error in followUser: ", error );
        } finally {
            /// console.log( "followUser -> finally -> user: ", user );
            setLoading( false );
        }
    }

    return { followUser, loading, following };
};

export { useUser, useUserFollow };
