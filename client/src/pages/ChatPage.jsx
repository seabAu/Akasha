import { SearchIcon } from '@chakra-ui/icons'
import
    {
        Box,
        Button,
        Flex,
        Input,
        Skeleton,
        SkeletonCircle,
        Text,
        useColorModeValue
    } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Chat from '../components/Chat/Chat';
import { GiConversation } from 'react-icons/gi';
import ChatMessageContainer from '../components/Chat/ChatMessageContainer';
import ChatUser from '../components/Chat/ChatUser';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chatsAtom, selectedChatAtom } from '../atoms/chatsAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';

const ChatPage = () =>
{
    const [ chats, setChats ] = useRecoilState( chatsAtom );
    const currentUser = useRecoilValue( userAtom ); // Logged in user
    const [ selectedChat, setSelectedChat ] = useRecoilState( selectedChatAtom ); // Currently active chat conversation.
    const [ searchText, setSearchText ] = useState( "" );
    const [ loadingChats, setLoadingChats ] = useState( true );
    const [ awaitSearchingUser, setAwaitSearchingUser ] = useState( false );
    const showToast = useShowToast();

    // Fetch the onlineUsers via the socket.io context provider hook.
    const { socket, onlineUsers } = useSocket();
    
    useEffect(() => {
        socket.on( "messagesSeen", ( { chatId } ) =>
        {
            setChats( ( prev ) =>
            {
                const updatedChats = prev.map( ( chat ) =>
                {
                    if ( chat._id === chatId )
                    {
                        return {
                            ...chat,
                            lastMessage: {
                                ...chat.lastMessage,
                                seen: true
                            }
                        }
                    }
                    else
                    {
                        return chat;
                    }
                } );

                return updatedChats;
            } )
        } );
        
    }, [socket, setChats]);

    useEffect(() => {
        
        const getChats = async () =>
        {
            setLoadingChats( true );
            try {
                const res = await fetch( "/api/chats/user" );
                const data = await res.json();

                if ( data.error )
                {
                    // Error
                    showToast( "Error", data.error, "error" );
                    return;
                }
                else
                {
                    // Success
                    console.log( "ChatPage -> getChats() -> data = ", data );
                    showToast( "Success", data.message, "success" );
                    setChats( data.data );
                }
            } catch (error) {
                showToast( "Error", error.message, "error" );
            } finally {
                setLoadingChats( false );
            }
        }

        // Fetch chats for the signed in user. 
        getChats();
    }, [setChats]);

    const handleChatSearch = async(e) =>
    {
        e.preventDefault();
        setAwaitSearchingUser( true );
        try {
            const res = await fetch( `/api/users/profile/${searchText}`);
            const data = await res.json();
            const searchedUser = data.user;

            // console.log( "handleChatSearch -> data: ", data );

            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
            } else {
                // Success
                showToast( "Success", data.message, "success" );
                // console.log( "handleChatSearch -> success -> searchedUser: ", searchedUser );

                // If user is trying to message themselves.
                const messagingYourself = ( searchedUser._id === currentUser._id );
                if ( messagingYourself )
                {
                    showToast( "Error", "You cannot message yourself", "error" );
                    return;
                }

                // If user is already in a conversation with the searched user.
                const chatExists = chats.find( chat => chat.users[ 0 ]._id === searchedUser._id );
                if ( chatExists )
                {
                    setSelectedChat( {
                        _id: chatExists._id,
                        userId: searchedUser._id,
                        userAvatar: searchedUser.imgAvatar,
                        username: searchedUser.username,
                        mock: chatExists.mock
                    } );

                    return; // Return, don't need to do anything else. 
                }

                // No existing chat between you and the searchedUser; have to create one.
                // Make a fake chat UI element for a new chat. It is temporary and does not stick if you do not send any messages after all.
                // console.log( searchedUser.imgAvatar );
                const mockChat = {
                    mock: true,
                    lastMessage: {
                        text: "",
                        senderId: ""
                    },
                    _id: Date.now(),
                    users: [
                        {
                            _id: searchedUser._id,
                            username: searchedUser.username,
                            userAvatar: searchedUser.imgAvatar,
                        },
                        // {
                        //     _id: currentUser._id,
                        //     username: currentUser.username,
                        //     userAvatar: currentUser.imgAvatar
                        // }
                    ]
                };

                setChats( ( prev ) => [ ...prev, mockChat ] );
                // setSelectedChat( {
                //     _id: chats.find( chat => chat.users[ 0 ]._id === searchedUser._id )._id,
                //     userId: searchedUser._id,
                //     userAvatar: searchedUser.imgAvatar,
                //     username: searchedUser.username,
                //     mock: chat.mock
                // } );

            }
        } catch ( error ) {
            console.error( "Error in handleChatSearch: ", error );
        } finally {
            // console.log( "handleChatSearch -> finally -> chats: ", chats );
            setAwaitSearchingUser( false );
        }
    }

    return (
        <Box
            // position={ "absolute" }
            w={ {
                base: "100%",
                md: "100%",
                xl: "1200px"
            } }
            minH={ {
                base: "100%",
                md: 'max-content',
                lg: "100%"
            } }
            // border={ "1px solid red" }
            // left={ '50%' }
            // transform={ "translateX(-50%)" }
            // p={ 4 }
            >
            {/* Chat window */ }
            <Flex
                gap={ 4 }
                flexDirection={ {
                    base: "column",
                    md: "row"
                } }
                maxW={ {
                    sm: "400px",
                    md: "full"
                } }
                mx={ "auto" }>
                <Flex
                    flex={ 30 }
                    // border={"1px solid green"}
                    gap={ 2 }
                    flexDirection={ "column" }
                    maxW={ {
                        sm: "250px",
                        md: "full"
                    } }
                    mx={ 'auto' }>
                    <Text fontWeight={ 700 } color={ useColorModeValue( "gray.600", "gray.400" ) }>
                        Your Conversations
                    </Text>
                    <form onSubmit={handleChatSearch}>
                        <Flex alignItems={ 'center' } gap={ 2 }>
                            <Input placeholder={ 'Search for a user' } onChange={(e)=>{setSearchText(e.target.value);}} value={searchText} />
                            <Button size={ "sm" } onClick={handleChatSearch} isLoading={awaitSearchingUser}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>

                    {
                        loadingChats ? (
                            [ 0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11 ].map( ( _, i ) =>
                            {
                                /* Avatar skeleton */
                                return (
                                    <Flex key={ `chat-${ i }` } gap={ 4 } alignItems={ 'center' } p={ 1 }>
                                        <Box>
                                            <SkeletonCircle size={ "10" } />
                                        </Box>
                                        <Flex w={ 'full' } flexDirection={ 'column' } gap={ 3 }>
                                            <Skeleton h={ `10px` } w={ `80px` } />
                                            <Skeleton h={ `8px` } w={ `90%` } />
                                        </Flex>
                                    </Flex>
                                );
                            } )
                        ) : (
                            chats && chats.map( ( chat, index ) =>
                            {
                                // console.log( "Chat: ", chat, "\n", "onlineUsers = ", onlineUsers );
                                // See if the participants other than the logged-in-user's key are online.
                                
                                let otherUsers = chat.users.filter(
                                    ( user ) => user._id.toString() !== currentUser._id.toString()
                                );
                                let isOnline = false;
                                if ( otherUsers.length > 0 )
                                {
                                    isOnline = onlineUsers.includes( otherUsers[ 0 ]._id );
                                }
                                return (
                                    <ChatUser key={ `chat-${ chat._id }` } chat={chat} isOnline={isOnline}/>
                                );
                            })
                        )
                    }
                </Flex>
                { !selectedChat._id && (

                    <Flex
                        flex={ 70 }
                        borderRadius={ "md" }
                        p={ 2 }
                        flexDir={ "column" }
                        alignItems={ "center" }
                        justifyContent={ 'center' }
                        height={ "400px" }
                    >
                        <GiConversation size={ 100 } />
                        <Text fontSize={ 20 }>Select a conversation to start messaging</Text>
                    </Flex>
                ) }
                {
                    selectedChat._id && (

                        <Flex
                            flex={ 70 }
                        // border={ "1px solid blue" }
                        >
                            <ChatMessageContainer />
                        </Flex>
                    )
                }

            </Flex>
        </Box>
    )
}

export default ChatPage
