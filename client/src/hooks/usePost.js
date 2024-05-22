import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';


const usePost = () => {
    const { pid, username } = useParams(); // Destructured value name must match the dynamic route.
    const showToast = useShowToast();
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    const navigate = useNavigate();
    const [ user, setUser ] = useState( null );
    const [ fetchingUser, setFetchingUser ] = useState( true );
    // const currentUser = useRecoilValue( userAtom ); // Logged in user
    const [ posts, setPosts ] = useRecoilState( postsAtom );
    const [ loading, setLoading ] = useState( false );

    const handleDeletePost = async( e, post ) => {
        e.preventDefault();

        if ( !post._id ) {
            showToast( "Error", "No post id given", "error" );
            return;
        }

        if ( !window.confirm(
                "Are you sure you want to delete this post?"
            ) ) {
            return;
        }

        setLoading( true );
        try {
            const res = await fetch( `/api/posts/${ post._id }`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            } );
            const data = await res.json();

            // console.log( "handleDeletePost -> data: ", data, "post._id = ", post._id, "\n", "username = ", username );

            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
                return;
            } else {
                // Success
                showToast( "Success", data.message, "success" );
                setPosts( ( prev ) => prev.filter( ( p ) => p._id !== post._id ) );

                // console.log( pid, username );
                // If we're on that deleted post's page, go back a page.
                if ( pid && username ) {
                    // Both router params are filled in, so we're definitely ON the post page.
                    // Format: /:username/thread/:pid
                    navigate( `/u/${ username }` );
                }
            }
        } catch ( error ) {
            console.error( "Error in userPage: ", error );
        } finally {
            setLoading( false );
        }
    }


    const handleLikePost = async( post ) => {
        const liked = post.likes.includes( currentUser._id );
        // Make sure we're logged in first.
        if ( !currentUser ) {
            return showToast( "Error", "You must be logged in to like this post.", "error" );
        }

        if ( loading ) {
            // Already in the process of doing this, return.
            return;
        }

        setLoading( true );

        try {
            const res = await fetch( `/api/posts/like/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            } );
            const data = await res.json();

            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
            } else {
                // Success
                // showToast( "Success", data.message, "success" );
                // console.log( "handleLike -> success -> data: ", data );

                // UPDATE LOCAL DATA
                if ( !liked ) {
                    // add the id of the current user to post.likes array
                    const updatedPosts = posts.map( ( p ) => {
                        if ( p._id === post._id ) {
                            return {...p, likes: [ ...p.likes, currentUser._id ] };
                        }
                        return p;
                    } );
                    setPosts( updatedPosts );
                } else {
                    // remove the id of the current user from post.likes array
                    const updatedPosts = posts.map( ( p ) => {
                        if ( p._id === post._id ) {
                            return {...p, likes: p.likes.filter( ( id ) => id !== currentUser._id ) };
                        }
                        return p;
                    } );
                    setPosts( updatedPosts );
                }

                // setLiked( !liked );
            }
        } catch ( error ) {
            showToast( "Error", error.message, "error" );
            console.error( "Error in getUserPosts: ", error );
        } finally {
            setLoading( false );
        }
    }


    // console.log( imgUrl ); Return multiple things, so the importing files need to
    // destructure these.
    return { loading, handleLikePost, handleDeletePost };
}

export default usePost;
