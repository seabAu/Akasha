import React, {useEffect, useState} from 'react'
import UserHeader from '../components/User/UserHeader'

// DATA
import {useParams} from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { Flex, Spinner } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import Post from '../components/Post/Post'

// This is the view for a specific user's profile or home page.
const UserPage = () => {
    const {username} = useParams(); // Destructured value name must match the dynamic route.
	const { user, fetchingUser } = useGetUserProfile(); // Use a custom hook to fetch the user data and set the state. Returns a loading param to make sure we don't jump ahead of the process.
    const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect( () =>
    {
        // Get all posts for THIS user.
        console.log( "UserPage -> user = ", user );

        const getUserPosts = async () =>
        {
            if ( !user ) return;
			setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();

                setPosts(data.posts);
                console.log( "getUserPosts.success -> posts: ", data.posts );
            } catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
                console.error("Error in getUserPosts: ", error);
            } finally
            {
                console.log( "getUserPosts.finally -> posts: ", posts );
				setFetchingPosts(false);
            }
        };

        getUserPosts();
    }, [username, user, setPosts]);

    const renderPosts = () =>
    {
        console.log( "renderPosts -> user = ", user, posts, posts.posts );
        if ( posts && posts !== null && posts !== undefined )
        {
            if ( posts.length > 0 )
            {
                return (
                    <>
                        { posts.map( ( post ) =>
                        {
                            return ( <Post key={ `${ post._id }` } post={ post } userId={post.userId}/> );
                        } ) }
                    </>
                );
            }
            else
            {
                return ( <h1>User has 0 posts.</h1> );
            }
        }
        else
        {
            return ( <h1>No posts found.</h1> );
        }
    }
    
    return (
        ( !user ) ? (
            ( fetchingUser ) ? (
                <Flex justifyContent={ 'center' }>
                    <Spinner size='xl' />
                </Flex>
            ) : (
                <Flex>User not found.</Flex> 
            )
        ) : (
            <Flex p={10} flexDirection={'column'} mb={100}>
                    <UserHeader thisUser={ user } />
                    
                    {
                        fetchingPosts && (
                            <Flex justifyContent={"center"} my={12}>
                                <Spinner size={"xl"} />
                            </Flex>
                        )
                    }

                    {
                        !fetchingPosts && posts && renderPosts()
                    }
            </Flex>
        )
    );
}

export default UserPage

/*
    return (
        <Flex
            w={ "100%" }
            gap={ `4` }
            alignItems={ 'flex-start' }
            // border={ '1px solid green' }
            overflow={ 'auto' }
            h={ "100%" }
            p={ 4 }
        >
            <Box flexGrow={ 1 }
                w={ "100%" }
                maxH={ 'full' }
                // border={ '1px solid green' }
                minH={ '100%' }
                h={ "100%" }
            >
                {( !user ) ? (
                ( fetchingUser ) ? (
                <Flex justifyContent={ 'center' }>
                    <Spinner size='xl' />
                </Flex>
                ) : (
                <Flex>User not found.</Flex>
                )
                ) : (
                <>
                    <UserHeader thisUser={ user } />

                    {
                        fetchingPosts && (
                            <Flex justifyContent={ "center" } my={ 12 }>
                                <Spinner size={ "xl" } />
                            </Flex>
                        )
                    }

                    {
                        !fetchingPosts && posts && renderPosts()
                    }

                </>
                )}
            </Box>
        </Flex>
    );
*/