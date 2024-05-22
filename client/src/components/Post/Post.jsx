import { Avatar, AvatarGroup, Box, ButtonGroup, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DotText from '../DotText'
import UsernameTag from '../User/UsernameTag'
import useShowToast from '../../hooks/useShowToast'
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import postsAtom from '../../atoms/postsAtom'
import { CopyIcon, DeleteIcon, DragHandleIcon } from '@chakra-ui/icons'
import usePost from '../../hooks/usePost'
import { CgMoreO, CgProfile } from 'react-icons/cg';
import { Bs3Circle, BsThreeDots } from 'react-icons/bs'
import PostOptions from './PostOptions'
import PostActions from './PostActions'

// This is the view for a specific post. 
const Post = ( { post, userId } ) =>
{
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    // const [ posts, setPosts ] = useRecoilState( postsAtom );
    const [ user, setUser ] = useState( null ); // This profile's user
    const { handleDeletePost } = usePost();

    // Need to get the user info about the poster.

    useEffect( () =>
    {
        const getUser = async () =>
        {
            if ( !userId ) { return; }
            try
            {
                const res = await fetch( `/api/users/profile/${ userId }` );
                const data = await res.json();

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
                    // showToast( "Success", data.message, "success" );
                    setUser( data.user );
                    // console.log( data.user );
                }
            } catch ( error )
            {
                console.error( "Error in userPage: ", error );
                setUser( null );
            } finally
            {
                // setLoading( false );
            }
        };

        getUser();
    }, [ userId ] );

    // Builds the dropdown menu on each post.
    const createPostOptionDropdown = () =>
    {
        return (
            <ButtonGroup gap='2' alignItems={ 'center' }>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton >
                            <CgMoreO size={ 24 } cursor={ "pointer" } />
                        </MenuButton>
                        <Portal>
                            <MenuList bg={ "gray.dark" }>
                                {
                                    ( currentUser?._id === user._id ) &&
                                    (
                                        <MenuItem
                                            bg={ "gray.dark" }
                                            _hover={ {
                                                backgroundColor: 'gray.light',
                                                color: 'gray.100'
                                            } }>
                                            <Flex
                                                flexDirection={ "row" }
                                                flex={ 1 }
                                                alignItems={ "center" }
                                                justifyContent={ "flex-start" }
                                                gap={ 5 }
                                                w={ "full" }
                                                onClick={
                                                    ( e ) =>
                                                    {
                                                        handleDeletePost( e, post );
                                                    }
                                                }
                                            >
                                                <DeleteIcon />{ ' ' }Delete
                                            </Flex>
                                        </MenuItem>
                                    )
                                }
                                <MenuItem
                                    bg={ "gray.dark" }
                                    _hover={ {
                                        backgroundColor: 'gray.light',
                                        color: 'gray.100'
                                    } }>
                                    <CopyIcon />
                                </MenuItem>

                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </ButtonGroup>
        )
    }

    return (
        ( user && post ) &&

        <Flex gap={ 2 } mb={ 2 } py={ 5 } px={ 5 } _hover={ {
            bg: useColorModeValue( "gray.700", "gray.800" )
        } }>
            <Flex flexDirection={ "column" } alignItems={ "center" }>

                {/* Post user avatar */ }
                <Link to={ `/${ user?.username }` }>
                    <Avatar size={ "md" } name={ `${ user?.username }` } src={ `${ user?.imgAvatar }` } />
                </Link>

                {/* Vertical bar on left side */ }
                <Box w={ "1px" } h={ "full" } bg={ "gray.light" } my={ 2 }></Box>

            </Flex>

            <Flex flex={ 1 } flexDirection={ "column" } gap={ 2 }>

                {/* Post username */ }
                <Flex justifyContent={ "space-between" } w={ "full" }>
                    <Link to={ `/u/${ user?.username }` }>
                        <UsernameTag username={ `${ user?.username }` } isVerified={ `${user?.isVerified}` } onClick={ ( e ) =>
                        {
                            e.preventDefault();
                            navigate( `/u/${ user?.username }` );
                        } } />
                    </Link>

                    <Flex gap={ 4 } alignItems={ "center" }>
                        <Text fontSize={ "xs" } color={ "gray.light" } w={ 36 } textAlign={ 'right' }>
                            {
                                formatDistanceToNow( new Date( post.createdAt ) )
                            } { ' ' }ago</Text>
                        <PostOptions user={ user } post={ post } />
                    </Flex>
                </Flex>

                {/* Post content */ }
                <Link to={ `/u/${ user?.username }/t/${ post._id }` }>

                    {/* Post text */ }
                    <Text fontSize={ "sm" }>{ post.text }</Text>

                    {/* Post Image */ }
                    <Post.Image post={post} />


                    {/* Actions and counters */ }
                    <Flex gap={ 3 } my={ 1 }>
                        { post && <PostActions post={ post } /> }
                    </Flex>

                    <Divider mt={ 4 } />
                </Link>
            </Flex>
        </Flex>
    )
}

const PostImage = ( props ) =>
{
    const {
        // Content settings.
        children,
        show = true,
        post = null,
        borderRadius=4,
        classes = "",
        styles = {},
        debug = false,
    } = props;

    return (
        post && (
            <Box
                borderRadius={ borderRadius }
                overflow={ "hidden" }
                border={ `1px solid ${ 'gray.light' }` }
                borderColor={ 'gray.light' }
                cursor={ 'pointer' }
                onClick={ ( e ) =>
                {
                    // Open the image to a larger view.
                }}
            >
                    {
                        post.img &&
                        (
                            <Image src={ post.img } maxW={'400px'} w={ 'full' } />
                        )
                    }
            </Box>
        )
    );
}
Post.Image = PostImage;


export default Post
