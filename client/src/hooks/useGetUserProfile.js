import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

// To avoid duplicating code for fetching a given user's data. 
const useGetUserProfile = () => {
    const { username } = useParams(); // Destructured value name must match the dynamic route.
    const showToast = useShowToast();
    const [ user, setUser ] = useState( null );
    const [ fetchingUser, setFetchingUser ] = useState( true );
    const currentUser = useRecoilValue( userAtom );

    useEffect( () => {
        const getUser = async() => {
            // console.log( "getUser -> username = ", username );
            setFetchingUser( true );
            try {
                const res = await fetch( `/api/users/profile/${username}` );
                const data = await res.json();

                // console.log( "useGetUserProfile -> data: ", data );

                if ( data.error ) {
                    // Error
                    showToast( "Error", data.error, "error" );
                } else {
                    // Success
                    showToast( "Success", data.message, "success" );

                    // We now have valid user data.
                    // Check a few things before serving it up to a viewer.
                    // isPrivate
                    if ( data.user.isPrivate ) {
                        if ( username !== currentUser.username ) {
                            // If private and not logged in to that account, reject viewing.
                            showToast( "Error", "Sorry, that user's account is private.", "error" );
                            setFetchingUser( false );
                            setUser( null );
                            return;
                        }
                    }

                    // isFrozen
                    if ( data.user.isFrozen ) {
                        showToast( "Error", "Sorry, that user has frozen their account.", "error" );
                        setFetchingUser( false );
                        setUser( null );
                        return;
                    }

                    // All set, save and load.
                    setUser( data.user );
                    // console.log( "useGetUserProfile -> success -> data.user: ", user );
                }
            } catch ( error ) {
                console.error( "Error in getUser: ", error );
                setFetchingUser( false );
            } finally {
                // console.log( "useGetUserProfile -> finally -> user: ", user );
                setFetchingUser( false );
            }
        };

        getUser();
    }, [ username ] );


    return ( { user, fetchingUser } );
}

export default useGetUserProfile;
