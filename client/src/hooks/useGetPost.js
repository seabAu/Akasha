import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';

const useGetPost = ( { postId } ) => {
    const showToast = useShowToast();
    // const currentUser = useRecoilValue( userAtom ); // Logged in user
    const [ posts, setPosts ] = useRecoilState( postsAtom );
    const [ fetchingPost, setFetchingPost ] = useState( false );
    const [ post, setPost ] = useState( null );

    useEffect( () => {
        // Get this specific post's data.
        // console.log( "useGetPost -> handleGetPost -> username = ", username, ", ", "pid = ", pid );
        const handleGetPost = async() => {
            if ( fetchingPost ) return;

            setFetchingPost( true );
            try {
                const res = await fetch( `/api/posts/${ postId }` );
                const data = await res.json();

                if ( data.error ) {
                    // Error
                    showToast( "Error", data.error, "error" );
                    console.log( "useGetPost.js -> handleGetPost.data.error -> data: ", data, data.post );
                    // setPost( null );
                    return;
                } else {
                    // Success
                    showToast( "Success", data.message, "success" );
                    console.log( "useGetPost.js -> handleGetPost.data.success -> data: ", data, data.post );
                    setPosts( [ data.post ] );
                    setPost( data.post );
                }

            } catch ( error ) {
                showToast( "Error", error.message, "error" );
                console.error( "Error in useGetPost.js -> handleGetPost: ", error );
                setFetchingPost( false );
            } finally {
                // console.log( "useGetPost.js -> handleGetPost.finally -> post: ", post );
                setFetchingPost( false );
            }
        };

        handleGetPost();
    }, [ postId, setPosts ] );

    // console.log( imgUrl ); Return multiple things, so the importing files need to
    // destructure these.
    return { fetchingPost, postData: post };

}

export default useGetPost;
