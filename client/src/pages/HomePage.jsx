import React, { useEffect, useState }
    from 'react'
import { Box, Button, Flex, Grid, GridItem, Spinner, useColorModeValue }
    from '@chakra-ui/react'
import { Link }
    from 'react-router-dom'
import { useRecoilState, useRecoilValue }
    from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from "../atoms/postsAtom";
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post/Post';
import UserList from '../components/User/UserList';
import * as utils from "../utilities";

const HomePage = () =>
{
    // Get posts of users we follow.
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    const [ posts, setPosts ] = useRecoilState( postsAtom );
    const [ loading, setLoading ] = useState( true );
    const showToast = useShowToast();
    useEffect( () =>
    {
        const getFeedPosts = async () =>
        {
            setLoading( true );
            setPosts( [] );
            try
            {
                // const res = await fetch(`/api/posts/feed/${currentUser._id}`);
                const res = await fetch( `/api/posts/feed`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify( { userId: currentUser._id }

                    )
                }
                );
                // console.log(res);
                const data = await res.json();
                // console.log(data);
                if ( data.error )
                {
                    showToast( "Error", data.error, "error" );
                }
                else
                {
                    // console.log(data.feedPosts);
                    setPosts( data.posts );
                }
            }
            catch ( error )
            {
                showToast( "Error", error.message, "error" );
            }
            finally
            {
                setLoading( false );
            }
        };
        getFeedPosts();
    }, [ setPosts ] );

    const buildPosts = ( data ) =>
    {
        // console.log( 'buildPosts: ', data );
        if ( utils.val.isValidArray( data ) )
        {
            return (
                <>
                    { data?.map( ( post ) =>
                    {
                        return (
                            <Post key={ post._id }
                                post={ post }
                                userId={ post.userId }
                                w={ '100%' }
                            />
                        );
                    }
                    ) }
                </>
            );
        }
        else
        {
            return (
                <>Nothing to see here.</>
            )
        }
    }

    return (
        <Flex
            w={ "100%" }
            gap={ `4` }
            alignItems={ 'flex-start' }
            // border={ '1px solid green' }
            overflow={ 'auto' }
            h={ "100%" }
            p={ 0 }
            px={ 0 }
        >
            <Grid
                templateAreas={ `"content aside"` }
                // gridTemplateRows={'1fr 1fr '}
                // gridTemplateColumns={'3fr 1fr'}
                gridTemplateColumns={ {
                    base: '100%',
                    md: '4fr 1fr',
                } }
                w={ "100%" }
                maxH={ 'full' }
                // border={ '1px solid green' }
                // minH={ '100%' }
                h={ "100%" }
                overflow={ 'auto' }
                gap='1'
                // color='blackAlpha.700'
                fontWeight='bold'
            >
                <GridItem
                    // bg='pink.300'
                    bg={ useColorModeValue( 'white', 'gray.dark' ) }
                    pt={ 8 }
                    // pl='2'
                    w={ "100%" }
                    maxH={ 'full' }
                    // border={ '1px solid green' }
                    minH={ '100%' }
                    overflow={ 'auto' }
                    area={ 'content' }>
                    {
                        loading
                            ? (
                                <Flex justify={ 'center' }>
                                    <Spinner size={ 'xl' }
                                    />
                                </Flex>
                            )
                            : (
                                ( posts?.length === 0 ) ? (
                                    <h1>Follow some users to see their post feeds.</h1>
                                ) :
                                    (
                                        buildPosts( posts )
                                    )
                            )
                    }
                </GridItem>
                <GridItem
                    // bg='green.300'
                    area={ 'aside' }
                    right={ 0 }
                    w={ '16em' }
                    top={ 0 }
                    bottom={0}
                    pt={ 8 }
                    // pl='2'
                    flexShrink={ 0 }
                    maxW={ 'auto' }
                    maxH={ '100%' }
                    overflowY={ 'auto' }
                    display={ {
                        base: "none",
                        md: "block"
                    } }>
                    <UserList />
                </GridItem>
            </Grid>
        </Flex>
    );
}


export default HomePage