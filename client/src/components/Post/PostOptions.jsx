import React from 'react'
import { Avatar, AvatarGroup, Box, ButtonGroup, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorModeValue } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import usePost from '../../hooks/usePost';
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';
import { CgMoreO, CgProfile } from 'react-icons/cg';

const PostOptions = ( { post, user } ) =>
{
    const { handleDeletePost } = usePost();
    const currentUser = useRecoilValue( userAtom ); // Logged in user

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
                                    ( currentUser?._id === user?._id ) &&
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
        <>
            { user && post ? createPostOptionDropdown() : '' }
        </>
    )
}

export default PostOptions
