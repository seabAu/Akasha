import React, { useState } from 'react'
import {
    Stack,
    HStack,
    VStack,
    Box,
    Flex,
    Avatar,
    Text,
    MenuButton,
    Link,
    Menu,
    MenuList,
    MenuItem,
    Portal,
    useToast,
    Button
} from '@chakra-ui/react';

import {CgMoreO} from 'react-icons/cg';
import {BsInstagram} from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';
import useShowToast from '../../hooks/useShowToast';
import { useUserFollow } from '../../hooks/useUser';

// Header for a user profile page
const UserHeader = ( { thisUser } ) =>
{
    const toast = useToast();

    // If looking at our own profile page, show extra buttons.
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    // const [ following, setFollowing ] = useState( thisUser?.followers.includes( currentUser?._id ) );
	const { followUser, following, loading } = useUserFollow(thisUser);

    console.log( "UserHeader -> thisUser = ", thisUser );
    const copyURL = () => {
        const currentURL = window.location.href;
        navigator
            .clipboard
            .writeText(currentURL)
            .then(() => {
                toast({
                    title: 'Copied!',
                    status: 'success',
                    duration: 1000,
                    position: 'top',
                    render: () => (
                        <Box
                            color='white'
                            p={3}
                            bg={'gray.dark'}
                            border={'1px solid gray.light'}
                            borderRadius={'8px'}>
                            Success
                        </Box>
                    ),
                    // containerStyle: {     border: '1px solid gray.light',     borderRadius:
                    // '8px', }
                });
            });
    }
    
    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box
                    borderRadius={"full"}
                        boxShadow={ "1px 1px 1px 1px black" }
                        p={'8px'}
                    >
                    {
                        thisUser?.imgAvatar ? (
                            <Avatar
                                name={thisUser?.name}
                                src={thisUser?.imgAvatar}
                                size={{
                                base: "md",
                                md: "xl"
                                } }
                            />
                        ) : (
                            <Avatar
                            name={thisUser?.name}
                            src={"https://bit.ly/broken-link"}
                            size={{
                            base: "md",
                            md: "xl"
                            } }
                        />
                        )
                    }
                </Box>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{thisUser?.username}</Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{thisUser?.name}</Text>
                        <Text
                            fontSize={"xs"}
                            bg={"gray.dark"}
                            color={"gray.light"}
                            p={1}
                            size={{
                            base: "sm"
                            } }
                            borderRadius={"full"}>akasha.net</Text>
                    </Flex>
                </Box>
            </Flex>

            <Text>Status: { thisUser?.status }</Text>
            
            <Text>Bio: { thisUser?.bio }</Text>
            
            { currentUser?._id === thisUser?._id ? (
                <Link as={ RouterLink } to='/update'>
                    <Button size={ "sm" }>Update</Button>
                </Link>
            ) : (
                <Button size={ "sm" } onClick={ () =>
                {
                    followUser(thisUser);
                } } isLoading={loading}>{ following ? "Unfollow" : "Follow" }</Button>
            ) }

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{thisUser?.followers.length} followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"}/>
                    </Box>
                    <Box className='icon-container'>
                        <Menu>
                            <MenuButton >
                                <CgMoreO size={24} cursor={"pointer"}/>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                                    <MenuItem bg={"gray.dark"}>Follow</MenuItem>
                                    <MenuItem bg={"gray.dark"}>Message</MenuItem>
                                    <MenuItem bg={"gray.dark"}>Block</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            <Flex w={'full'}>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid white"}
                    justifyContent={"center"}
                    pb={"3"}
                    cursor={"pointer"}>
                    <Text fontWeight={'bold'}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid gray"}
                    justifyContent={"center"}
                    pb={"3"}
                    cursor={"pointer"}>
                    <Text fontWeight={'bold'}>Replies</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid gray"}
                    justifyContent={"center"}
                    pb={"3"}
                    cursor={"pointer"}>
                    <Text fontWeight={'bold'}>Groups</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader
