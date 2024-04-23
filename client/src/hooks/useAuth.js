// Hooks for login, logout, and signup.
import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useAuth = () =>
{
    const [ currentUser, setCurrentUser ] = useRecoilState( userAtom );
    const showToast = useShowToast();
    const [ loading, setLoading ] = useState( false );

    const handleLogin = async ( inputs ) =>
    {

        setLoading( true );
        try
        {
            // Fetch request
            const res = await fetch( "/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( inputs )
            } );

            const data = await res.json();
            //// console.log( data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
            } else
            {
                // Success
                //// showToast( "Success", data.message, "success" );

                const user = data.user;

                // Set current user info. On success, we receive back the active user's details.
                //// console.log( user );

                // Save to localStorage.
                localStorage.setItem( "user", JSON.stringify( user ) );

                // Update state.
                setCurrentUser( user );
            }

        } catch ( error )
        {
            console.error( "Error in handleLogin: ", error );
        } finally
        {
            setLoading( false );
        }
    }

    const handleSignup = async ( inputs ) =>
    {
        const {
            name,
            username,
            email,
            password,
        } = inputs;

        if ( !name || !username || !email || !password ) return;
        try
        {
            // Target in vite.config.js is appended to this endpoint.
            const res = await fetch( "/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( inputs ),
            } );

            const data = await res.json();

            if ( data.error )
            {
                // We received an error.
                showToast( "Error", data.error, "error" );
            } else
            {
                // Success. Send a toast.
                //// showToast( "Success", data.message, "success" );

                const user = data.user;

                // Set current user info. On success, we receive back the active user's details.
                //// console.log( user );

                // Save to localStorage.
                localStorage.setItem( "user", JSON.stringify( user ) );

                // Update state.
                setCurrentUser( user );
            }

        } catch ( error )
        {
            console.error( "Error in handleSignup: ", error );
        }
    }

    const handleLogout = async () =>
    {
        //
        try
        {
            // Fetch request
            const res = await fetch( "/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            } );

            const data = await res.json();

            //// console.log( data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
            } else
            {
                // Success
                //// showToast( "Success", data.message, "success" );

                // Clear localStorage.
                localStorage.removeItem( 'user' );

                // Set state.
                setCurrentUser( null );
            }

        } catch ( error )
        {
            console.error( "Error in handleLogout: ", error );
        }
    }

    const handleDelete = async ( userId ) =>
    {
        // Delete this account. First double check. 
        if ( !window.confirm( "Are you sure you want to delete your account?" ) ) return;
        try
        {
            // Fetch request
            const res = await fetch( `/api/users/${ userId }`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            } );

            const data = await res.json();

            console.log( 'handleDelete -> data = ', data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
            } else
            {
                // Success
                showToast( "Success", data.message, "success" );

                // Clear localStorage.
                localStorage.removeItem( 'user' );

                // Set state.
                setCurrentUser( null );
            }

        } catch ( error )
        {
            console.error( "Error in handleLogout: ", error );
        }
    }


    const handleUpdate = async ( e, userId, inputs ) =>
    {
        e.preventDefault();
        if ( !userId )
        {
            // No user given.
            showToast( "Error", "No user ID given.", "error" );
            return;
        }

        if ( !inputs )
        {
            // No inputs given.
            showToast( "Error", "No inputs received.", "error" );
            return;
        }

        if ( loading )
        {
            // Already loading. Return.
            return;
        }

        setLoading( true );
        try
        {
            // Fetch request
            console.log( "Sending useProfileUpdate -> updateUser -> inputs = ", inputs );
            const res = await fetch( `api/users/update/${ userId }`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( {
                    ...inputs
                } )
            } );

            const data = await res.json();

            console.log( data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
            }
            else
            {
                // Success
                const updatedUser = data.user;
                console.log( updatedUser );

                showToast( "Success", data.message, "success" );

                // Clear localStorage.
                localStorage.setItem( 'user', JSON.stringify( updatedUser ) );

                // Set state.
                setCurrentUser( updatedUser );
            }
        } catch ( error )
        {
            showToast( "Error", error, "error" );
            console.error( "Error in useProfileUpdate -> updateUser: ", error );
            setLoading( false );
        } finally
        {
            setLoading( false );
        }
    }

    return {
        handleSignup,
        handleLogin,
        handleLogout,
        handleDelete,
        handleUpdate,
        loading,
        currentUser
    };
}

export default useAuth;
