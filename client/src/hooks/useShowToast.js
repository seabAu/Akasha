import { useToast } from '@chakra-ui/react';
import React from 'react'

// Custom hook for showing the chakra ui toast elements with specific data.
const useShowToast = () => {
    const toast = useToast();
    const showToast = ( title = "", description = "", status = "", duration = 3000, isClosable = true, position = 'top' ) =>
    {
        console.log( "showToast :: ", title, description, status, duration, isClosable, position );
        if ( title && description )
        {
            toast( {
                title: title,
                description: description,
                status: status,
                duration: duration,
                isClosable: isClosable,
                position: position
            } );
        }
    }
    return showToast;
}

export default useShowToast
