import React, { useState } from 'react'
import useShowToast from './useShowToast';

const usePreviewImg = () => {
    const [ imgUrl,
        setImgUrl
    ] = useState( null );
    const showToast = useShowToast();

    const handleImageChange = ( e ) => {
            const file = e.target.files[ 0 ];
            // console.log( file ); Check if file exists
            if ( file && file.type.startsWith( "image/" ) ) {
                // Create a file reader.
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Update state.
                    setImgUrl( reader.result );
                }

                // Turn it into a base 64 string.
                reader.readAsDataURL( file );
            } else {
                // Not an image. Return an error.
                showToast( "Invalid file type", "You must select an image file.", "error" );

                setImgUrl( null );
            }
        }
        // console.log( imgUrl ); Return multiple things, so the importing files need to
        // destructure these.
    return { handleImageChange, imgUrl, setImgUrl };
}

export default usePreviewImg
