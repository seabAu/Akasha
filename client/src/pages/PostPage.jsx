import { Avatar, Box, Button, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UsernameTag from '../components/User/UsernameTag';
import { BsThreeDots } from 'react-icons/bs';
import DotText from '../components/DotText';
import ActionIcons from '../components/Page/ActionIcons';
import Comment from '../components/Post/Comment';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useNavigate, useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';
import usePost from '../hooks/usePost';
import useGetPost from '../hooks/useGetPost';
import PostOptions from '../components/Post/PostOptions';
import Post from '../components/Post/Post';
import PostActions from '../components/Post/PostActions';

// This is the full-view page for a given post-head.
const PostPage = () =>
{
    const { pid, username } = useParams(); // Destructured value name must match the dynamic route.
    const [ posts, setPosts ] = useRecoilState( postsAtom );
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    const navigate = useNavigate();
    const showToast = useShowToast();
    const { user, fetchingUser } = useGetUserProfile();
    // const [ post, setPost ] = useState( null );
    // const { fetchingPost, postData } = useGetPost(pid);
    const [ fetchingPost, setFetchingPost ] = useState( false );
    const post = posts[ 0 ];
    console.log( "PostPage -> posts: ", posts );

    useEffect( () =>
        {
            // Get this specific post's data.
            console.log( "PostPage -> username = ", username, ", ", "pid = ", pid );
            const getPost = async () =>
            {
                if ( fetchingPost ) return;
    
                setFetchingPost( true );
                try
                {
                    const res = await fetch( `/api/posts/${ pid }` );
                    const data = await res.json();
    
                    if ( data.error )
                    {
                        // Error
                        showToast( "Error", data.error, "error" );
                        console.log( "PostPage.js -> getPost.data.error -> data: ", data, data.post );
                        // setPost( null );
                        return;
                    }
                    else
                    {
                        // Success
                        showToast( "Success", data.message, "success" );
                        console.log( "PostPage.js -> getPost.data.success -> data: ", data, data.post );
                        setPosts( [ data.post ] );
                    }
    
                } catch ( error )
                {
                    showToast( "Error", error.message, "error" );
                    console.error( "Error in PostPage.js -> getPost: ", error );
                } finally
                {
                    console.log( "PostPage.js -> getPost.finally -> post: ", post );
                    setFetchingPost( false );
                }
            };
    
            getPost();
        }, [ pid, setPosts ] );
    

    const buildReplies = ( currentPost ) =>
    {
        if ( currentPost && currentPost?.replies?.length > 0 )
        {
            return (
                currentPost.replies.map( ( reply ) =>
                {
                    console.log( "currentPost: ", currentPost, "reply: ", reply );
                    return (
                        <Comment
                            key={ `${ currentPost._id }-${ reply._id }` }
                            reply={ reply }
                            lastReply={ reply._id === currentPost.replies[ post.replies.length - 1 ]._id }
                        />
                    );
                } )
            );
        }
        else
        {
            return (
                <Flex>No comments.</Flex>
            )
        }
    }

    return (
        <>
            {
                ( !user && !post && ( fetchingUser || fetchingPost ) ? (
                    <Flex justify={ 'center' }>
                        <Spinner size={ 'xl' } />
                    </Flex>
                ) : (
                    post && (
                        <Flex flex={ 1 } flexDirection={ "column" } gap={ 2 }>
                            <Flex justifyContent={ "space-between" } w={ "full" }>
                                <Flex w={ 'full' } alignItems={ 'center' } gap={ 3 }>
                                    <Avatar size={ "md" } name={ `${ user?.username }` } src={ `${ user?.imgAvatar }` } />
                                    <Flex>
                                        <UsernameTag username={ `${ user?.username }` } isVerified={ true } />
                                    </Flex>
                                </Flex>

                                <Flex gap={ 4 } alignItems={ "center" }>
                                    <Text fontSize={ "xs" } color={ "gray.light" } w={ 36 } textAlign={ 'right' }>
                                        {
                                            formatDistanceToNow( new Date( post.createdAt ) )
                                        } { ' ' }ago</Text>
                                    <PostOptions user={ user } post={ post } />
                                </Flex>
                            </Flex>

                            {/* Post content */ }
                            {/* Post text */ }
                            <Text fontSize={ "sm" }>{ post.text }</Text>

                            {/* Post Image */ }
                            <Post.Image post={post} />

                            {/* Actions and counters */ }
                            <Flex gap={ 3 } my={ 1 }>
                                { post && <PostActions post={ post } /> }
                            </Flex>

                            <Divider my={ 4 } />

                            <Flex justifyContent={ "space-between" }>
                                <Flex gap={ 2 } alignItems={ "center" }>
                                    <Text fontSize={ "2xl" }>👋</Text>
                                    <Text color={ "gray.light" }>Get the app to like, reply and post.</Text>
                                </Flex>
                                <Button>Get</Button>
                            </Flex>

                            <Divider my={ 4 } />

                            {/* Render replies. */ }

                            <Flex flexDirection={ 'column' }>
                                {
                                    post.replies && buildReplies( post )
                                }
                            </Flex>
                        </Flex>
                    )
                ) )
            }
        </>
    );
}

export default PostPage



/*
    const handleDeletePost2 = async ( e ) =>
    {
        e.preventDefault();
        if ( !window.confirm(
            "Are you sure you want to delete this post?"
        ) ) return;
        try
        {
            const res = await fetch( `/api/posts/${ post._id }`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            } );
            const data = await res.json();

            // console.log( "handleDeletePost -> data: ", data );
            // console.log( data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
                return;
            }
            else
            {
                // Success
                showToast( "Success", data.message, "success" );
                navigate( `/${ user.username }` );
                // console.log( data.user );
            }
        } catch ( error )
        {
            console.error( "Error in userPage: ", error );
        } finally
        {
            // setLoading( false );
        }
    }
*/
