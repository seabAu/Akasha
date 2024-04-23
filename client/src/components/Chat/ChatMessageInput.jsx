import { Box, Flex, Image, Input, InputGroup, InputRightElement, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoSendSharp } from 'react-icons/io5';
import useChat from '../../hooks/useChat';
import { BsFillImageFill } from 'react-icons/bs';
import { useRef } from 'react';
import usePreviewImg from '../../hooks/usePreviewImg';

const ChatMessageInput = ( { setMessages } ) =>
{
    const [ messageText, setMessageText ] = useState( "" );
    const [ messageImg, setMessageImg ] = useState( "" );
    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg();
    const { loading, handleSendMessage } = useChat();
    const imageRef = useRef( null );
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isSending, setIsSending ] = useState( false );

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();

        // Prevent spam.
        if ( isSending ) return;

        setIsSending( true );

        const inputs = {
            text: messageText,
            img: imgUrl
        };

        handleSendMessage( inputs, setMessages );

        // Clear the inputs.
        setMessageText( "" );
        setImgUrl( null );
        e.target.value = "";

        setIsSending( false );
    }

    return (
        <Flex flexDir={ 'column' }>
                {
                    imgUrl && (<Flex borderRadius={'1em'} border={"1px solid"} borderColor={"gray.light"}>
                
                    <Box w={ 'full' } h={ '200px' } p={2}>
                                    <Image src={ imgUrl } alt="" maxH={'100%'} />
                                    <Text fontSize={ "xs" } width={ 36 } textAlign={ "right" } color={ "gray.light" } onClick={ ( e ) =>
                                    {
                                        e.preventDefault();
                                        setImgUrl( null );
                                    }}>X</Text>
                                </Box>
                    </Flex>
                    )
                }
            <Flex gap={ 2 } alignItems={ "center" } >
                <form onSubmit={ handleSubmit } style={ { flex: 95 } }>
                    <InputGroup>
                        <Input w={ 'full' } placeholder={ 'Type a message' } value={ messageText } onChange={ ( e ) =>
                        {
                            setMessageText( e.target.value );
                        } } />
                        <InputRightElement onClick={ handleSubmit }>
                            <IoSendSharp color={ 'green.500' } />
                        </InputRightElement>
                    </InputGroup>
                </form>
                <Flex flex={ 5 } cursor={ 'pointer' } style={ { flex: 5 } }>
                    <BsFillImageFill size={ 20 } onClick={ () => imageRef.current.click() } />
                    <Input type={ 'file' } hidden ref={ imageRef } onChange={ ( e ) => { handleImageChange( e ); } } />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default ChatMessageInput
