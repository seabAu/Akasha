import React, { useState } from 'react'
import userAtom from '../atoms/userAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import useShowToast from './useShowToast';

const useProfileUpdate = () => {
    const [ currentUser, setCurrentUser ] = useRecoilState( userAtom );
    const showToast = useShowToast();
    const [ updating, setUpdating ] = useState( false );

    const updateUser = async( e, user, inputs ) => {
        e.preventDefault();
        if ( !user ) {
            // No user given.
            showToast( "Error", "No user.", "error" );
            return;
        }

        if ( !inputs ) {
            // No inputs given.
            showToast( "Error", "No inputs received.", "error" );
            return;
        }

        setUpdating( true );
        try {
            // Fetch request
            // console.log(inputs);
            const res = await fetch( `api/users/update/${ user.id }`, {
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

            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
            } else {
                // Success
                const updatedUser = data.user;
                console.log( updatedUser );

                showToast( "Success", data.message, "success" );

                // Clear localStorage.
                localStorage.setItem( 'user', JSON.stringify( updatedUser ) );

                // Set state.
                setCurrentUser( updatedUser );

            }
        } catch ( error ) {
            showToast( "Error", error, "error" );
            console.error( "Error in useProfileUpdate -> updateUser: ", error );
            setUpdating( false );
        } finally {
            setUpdating( false );
        }
    }

}

export default useProfileUpdate
