import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { selectedChatAtom } from '../../atoms/chatsAtom';
import userAtom from '../../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { BsCheck2All } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ( { message, isOwnMessage } ) =>
{
    const selectedChat = useRecoilValue( selectedChatAtom );
    const currentUser = useRecoilValue( userAtom );
    const [ imgLoaded, setImgLoaded ] = useState( false );
    // If message sent by the current user, orient the avatar on the right of the message. 

    // console.log( message, isOwnMessage );
    return (
        <>
            {
                <Flex gap={ 2 } alignSelf={ `${ isOwnMessage ? 'flex-end' : 'flex-start' }` } flexDirection={ `${ isOwnMessage ? 'row' : 'row-reverse' }` }>

                    <Flex maxW={ "350px" } px={ 3 } py={ 1 } borderRadius={ "md" } bg={ `${ isOwnMessage ? 'blue.800' : 'red.800' }` } wordBreak={ 'break-word' }>

                        <Flex w={ '100%' } flexDirection={ 'column' }>

                            <Flex flexDirection={ 'row' }>

                                {/*Message timestamp.*/ }
                                <Text color={ "tan" } fontSize={ 'xs' }>{ formatDistanceToNow( new Date( message.createdAt ) ) } ago</Text>

                                {/*Checkmark for whether or not this message has been seen by the user.*/ }
                                <Box
                                    alignSelf={ "flex-end" }
                                    ml={ 1 }
                                    color={ message.seen ? "blue.400" : "" }
                                    fontWeight={ "bold" }
                                >
                                    <BsCheck2All size={ 16 } />
                                </Box>

                            </Flex>
                            
                            <Flex flexDirection={ 'column' }>
                                
                                {/*Message text.*/ }
                                {
                                    message.text && (
                                        <Text color={ "white" } py={ 1 }>{ message.text }</Text>
                                    )
                                }

                                {/*Message media.*/ }
                                {
                                    message.img && (
                                        <Flex mt={ 5 } w={ "200px" }>
                                            <Image src={ `${ message.img }` } alt={ 'Message image' } borderRadius={ 4 } />
                                        </Flex>
                                    )
                                }

                            </Flex>
                        </Flex>

                    </Flex>

                    <Avatar src={
                        `${ isOwnMessage ? currentUser.imgAvatar : selectedChat.userAvatar }`
                    } w={ "7" } h={ "7" } />
                </Flex>
            }
        </>
    )
}

export default ChatMessage
