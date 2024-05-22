import {Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure} from '@chakra-ui/react'
import {AddIcon} from '@chakra-ui/icons';
import React, { useRef, useState } from 'react'
import usePreviewImg from '../../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import useShowToast from '../../hooks/useShowToast';
import userAtom from '../../atoms/userAtom';
import postsAtom from '../../atoms/postsAtom';

const MAX_CHAR = 512;

const CreatePost = () => {
    const [ loading, setLoading ] = useState( false );
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg();
    const [ postText, setPostText ] = useState( "" );
    const imageRef = useRef( null );
    const showToast = useShowToast();
	const user = useRecoilValue(userAtom);
    
    // Fetch current user for the message post fetch.
    const currentUser = useRecoilValue( userAtom );
	const [posts, setPosts] = useRecoilState(postsAtom);

    // console.log( "CurrentUser: ", currentUser );

    const [ remainingCharacters, setRemainingCharacters ] = useState( MAX_CHAR );

    const handleCreatePost = async () =>
        {
            if ( !currentUser )
            {
                showToast( "Error", "Please login to create post.", "error" );
                return;
            }
    
            if ( loading ) return;
    
            setLoading( true );
            try {
                // Fetch request
                const res = await fetch(`/api/posts/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify( {
                        userId: currentUser._id || currentUser.id,
                        text: postText,
                        img: imgUrl
                    } )
                });
    
                const data = await res.json();
                
                if (data.error) {
                    // Error
                    showToast( "Error", data.error, "error" );
                } else {
                    // Success
                    showToast( "Success", data.message, "success" );

                    console.log( "data: ", data.post );
                    if ( currentUser.username === user.username )
                    {
                        setPosts( [ data.post, ...posts ] );
                    }
                }
    
            } catch (error) {
                console.error("Error in handleCreatePost: ", error);
            } finally
            {
                setLoading( false );
                onClose();
                console.log( "CreatePost -> posts = ", posts );

                // Reset inputs.
                setPostText( "" );
                setImgUrl( null );
            }
        }
    


    const handleTextChange = (e) =>
    {
        const inputText = e.target.value;
        // console.log( inputText );

        if ( inputText.length > MAX_CHAR )
        {
            const truncatedText = inputText.slice( 0, MAX_CHAR );
            setPostText( truncatedText );
            setRemainingCharacters( 0 );
        }
        else
        {
            setRemainingCharacters( MAX_CHAR - inputText.length );
            setPostText( inputText );
        }

    }

    return ( <>

        <Flex
            flexDirection={"row"}
            flex={1} p={2}
            alignItems={"center"}
            justifyContent={ "flex-start" }
            borderRadius={'full'}
            gap={5}
            position={ "absolute" }
			bottom={10}
			left={5}
			right={5}
            _hover={ {
                backgroundColor: 'gray.light',
                color: 'gray.100'
            } }
            bg={ useColorModeValue( "gray.300", "gray.dark" ) }
            cursor={'pointer'}
			onClick={onOpen}
            size={ { base: "sm", sm: "md" } }
        >
            <AddIcon/>Create
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={useColorModeValue('white', 'gray.dark')}>
                <ModalHeader>Create Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={ 6 }>
                    
                    { imgUrl && (
                        <Flex mt={ 5 } w={ "full" } position={ "relative" }>
                            <Image src={ imgUrl } alt='Selected image' />
                            <CloseButton bg={ 'gray.800' }
                                position={ "absolute" }
                                top={ 2 }
                                right={2}
                                onClick={ () => { setImgUrl( null ); }}
                            />
                        </Flex>
                    )}
                    <FormControl>
                        <BsFillImageFill style={ { marginBottom: "10px", marginLeft: "5px", cursor: "pointer" } }
                        size={16} onClick={()=>{imageRef.current.click()}} />
                        <Textarea placeholder='Type your message here' onChange={ handleTextChange } value={ postText } />
                        <Text fontSize={ "xs" } fontWeight="bold" textAlign={ "right" } m={ 1 } color={ "gray.500" }>{`${remainingCharacters}/${MAX_CHAR}`}</Text>
                        <Input type="file" hidden ref={ imageRef } onChange={ ( e ) => { handleImageChange( e ); } } />
                        

                    </FormControl>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost' onClick={ () => { handleCreatePost(); }} isLoading={loading}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    );
}

export default CreatePost;