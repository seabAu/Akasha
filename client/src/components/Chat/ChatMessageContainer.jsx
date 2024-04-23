import React from 'react'
import { useEffect, useRef, useState } from "react";
import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';
import ChatMessage from './ChatMessage';
import ChatMessageInput from './ChatMessageInput';
import { chatsAtom, selectedChatAtom } from '../../atoms/chatsAtom';
import useShowToast from '../../hooks/useShowToast';
import { useSocket } from '../../context/SocketContext';
const ChatMessageContainer = () => {
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [messages, setMessages] = useState([]);
	const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    // const [ selectedChat, setSelectedChat ] = useRecoilState( selectedChatAtom ); // Currently active chat conversation.
    const selectedChat = useRecoilValue( selectedChatAtom ); // Currently active chat conversation.
    const setChats = useSetRecoilState( chatsAtom );


    const { socket } = useSocket();
    
    // Ref for binding to the latest message to keep scrolling to latest message.
    const messageRef = useRef( null );

    // Listen for updates from the socket for the messages list.
    useEffect( () =>
    {
        socket?.on( "newMessage", ( message ) =>
        {
            // console.log( "newMessage: ", message );

            // Add the new message to the local cached list.
            if ( selectedChat._id === message.chatId )
            {
                setMessages( ( prev ) => [ ...prev, message ] );
            }

            // Update user chat card details.
            setChats( ( prev ) =>
            {
                const updatedChats = prev.map( ( chat ) =>
                {
                    if ( chat._id === selectedChat._id )
                    {
                        // Is the selected chat - update the last message of this chat.
                        return {
                            ...chat,
                            lastMessage: {
                                text: message.text,
                                senderId: message.senderId
                            }
                        };
                    }
                    else
                    {
                        return chat;
                    }
                } );
                return updatedChats;
            } );
        } );

        // Halt listening for the message on unmount. 
        return () => socket.off( "newMessage" );
    }, [socket, selectedChat]);

    // Handle isSeen boolean flagging.
    useEffect( () =>
    {
        const lastMessageIsFromOtherUser = messages.length && messages[ messages.length - 1 ].sender !== currentUser._id;
        if ( lastMessageIsFromOtherUser )
        {
            socket.emit( "markMessageSeen", {
                chatId: selectedChat._id,
                userId: selectedChat.userId
            } );
        }

        // Response from socket server.
        socket.on( "messagesSeen", ( { chatId } ) =>
        {
            if ( selectedChat._id === chatId )
            {
                setMessages( ( prev ) =>
                {
                    const updatedMessages = prev.map( ( message ) =>
                    {
                        if ( !message.seen )
                        {
                            return {
                                ...message,
                                seen: true
                            }
                        }
                        else
                        {
                            return message;
                        }
                    } );

                    return updatedMessages;
                } )
            }
        } );
    }, [ socket, selectedChat, messages, currentUser._id ] );
        

    useEffect( () =>
    {
        // Get messages for a given chat. Requires a chat to be selected. 
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);
            try
            {
                // If the selected chat is a mock chat, don't worry about all this. 
                // console.log( "selectedChat = ", selectedChat );
				if (selectedChat.mock) return;
				const res = await fetch(`/api/chats/user/${selectedChat.userId}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
                }
                // console.log( "ChatMessageContainer -> getMessages -> data = ", data );
				setMessages(data.data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [selectedChat.userId, selectedChat.mock]);


    // Listen for updates from the socket for the messages list.
    useEffect( () =>
    {
        messageRef.current?.scrollIntoView( { behavior: "smooth" } );
    }, [messages]);
    
	return (
		<Flex
			flex='70'
			bg={useColorModeValue("gray.200", "gray.dark")}
			borderRadius={"md"}
			p={2}
			flexDirection={"column"}
		>
			{/* Message header */}
			<Flex w={"full"} h={12} alignItems={"center"} gap={2}>
				<Avatar src={`${ ( selectedChat ) ? ( selectedChat.userAvatar ) : ( 'https://bit.ly/broken-link' ) }`} size={"sm"} />
				<Text display={"flex"} alignItems={"center"}>
					{selectedChat.username}<Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
			</Flex>

			<Divider />

			{/* Message history */}
			<Flex flexDir={"column"} gap={4} my={4} px={2} height={"100%"} maxH={'100%'} overflowY={"auto"}>
				{loadingMessages &&
					[ ...Array( 5 ) ].map( ( message, index ) =>
                        {
                            return (
                                <Flex
                                    key={ `message-${ index }` }
                                    gap={2}
                                direction={ "row" }
                                alignItems={ 'center' }
                                p={ 1 }
                                borderRadius={ 'md' }
                                alignSelf={index % 2 === 0 ? 'flex-start' : 'flex-end'}
                                >
                                    { index % 2 === 0 && <SkeletonCircle size={ 7 } /> }
                                    <Flex flexDirection={ 'column' } gap={ 2 }>
                                        <Skeleton h={'8px'} w={'250px'} />
                                        <Skeleton h={'8px'} w={'250px'} />
                                        <Skeleton h={'8px'} w={'250px'} />
                                    </Flex>
                                </Flex>
                            )
                    } ) }
                
                    {!loadingMessages &&
                    messages.map( ( message ) =>
                    {
                        // console.log( "message: ", message );
                        return (
                            <Flex
                                key={ message._id }
                                direction={ "column" }
                                // Get last message index and set the ref to it. 
                                ref={messages.length - 1 === messages.indexOf(message) ? messageRef : null}
                            >
                                <ChatMessage message={ message } isOwnMessage={ currentUser._id === message.senderId } />
                            </Flex>
                        );
                    })}
            </Flex>
            
            <ChatMessageInput setMessages={setMessages} />

		</Flex>
	);
}

export default ChatMessageContainer
