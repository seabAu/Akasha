import {Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure} from '@chakra-ui/react'
import {AddIcon} from '@chakra-ui/icons';
import React, { useRef, useState } from 'react'
import usePreviewImg from '../../hooks/usePreviewImg';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useShowToast from '../../hooks/useShowToast';
import postsAtom from '../../atoms/postsAtom';

const MAX_CHAR = 512;

const ReplyPost = ({post}) => {
    const [ loading, setLoading ] = useState( false );
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg();
    const [ text, setText ] = useState( "" );
	const [ awaitReply, setAwaitReply ] = useState( false ); // To signal wait for load for replying.
    const imageRef = useRef( null );
    const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    
    // Fetch current user for the message post fetch.
    const currentUser = useRecoilValue( userAtom );

    const [ remainingCharacters, setRemainingCharacters ] = useState( MAX_CHAR );


    const handleSubmit = async () =>
        {
            if ( !currentUser )
            {
                showToast( "Error", "Please login to reply.", "error" );
                return;
            }
    
		    if ( awaitReply )
            {
                // Already in the process of doing this, return.
                showToast( "Error", "Please try again in a few seconds.", "error" );
                return;
            }
    
            setAwaitReply( true );
    
            try {
                // Fetch request
                // TODO :: Upgrade this to allow replies to be the POST schema type, for endless chaining conversations.

                // const res = await fetch(`/api/posts/reply`, {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify( {
                //         userId: currentUser._id,
                //         text: text,
                //         img: imgUrl
                //     } )
                // });
    
                const res = await fetch(`/api/posts/reply/${post._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify( {
                        userId: currentUser._id,
                        text: text,
                        img: imgUrl
                    } )
                });
    
                const data = await res.json();
                // console.log( "ReplyPost -> Data: ", data, "\n", "Post: ", data.post );
                
                if (data.error) {
                    // Error
                    showToast( "Error", data.error, "error" );
                } else {
                    // Success
                    showToast( "Success", data.message, "success" );

					const updatedPosts = posts.map((p) => {
                        if ( p._id === post._id )
                        {
                            // console.log( "Replies merge: replies = ", p.replies, "\n", "data.post.replies = ", data.post.replies );
							return { ...p, replies: data.post.replies };
						}
						return p;
					});
					setPosts(updatedPosts);
                }
    
            } catch (error) {
                console.error("Error in handleSubmit: ", error);
            } finally
            {
                // Set await-loading flag to false.
                setAwaitReply( false );

                // Close modal.
                onClose();

                // Reset inputs.
                setText( "" );
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
            setText( truncatedText );
            setRemainingCharacters( 0 );
        }
        else
        {
            setRemainingCharacters( MAX_CHAR - inputText.length );
            setText( inputText );
        }

    }

    return ( <>

        <ReplyIcon onClick={onOpen} />
        
        <Modal isOpen={ isOpen } onClose={ onClose }
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        >
            <ModalOverlay />
            <ModalContent bg={useColorModeValue('white', 'gray.dark')}>
                <ModalHeader>Reply</ModalHeader>
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
                        <Textarea placeholder='Type your message here' onChange={ handleTextChange } value={ text } />
                        <Text fontSize={ "xs" } fontWeight="bold" textAlign={ "right" } m={ 1 } color={ "gray.500" }>{`${remainingCharacters}/${MAX_CHAR}`}</Text>
                        <Input ref={initialRef} type="file" hidden ref={ imageRef } onChange={ ( e ) => { handleImageChange( e ); } } />

                    </FormControl>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={ 3 } onClick={ () => { onClose(); 
                // Reset inputs.
                setText( "" );
                        setImgUrl( null );
                    } }>
                        Close
                    </Button>
                    <Button variant='ghost' onClick={ () => { handleSubmit(); }} isLoading={loading}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    );
}

const ReplyIcon = ( {onClick} ) =>
{
    return (
        <svg
			aria-label='Comment'
			color=''
			fill=''
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
			onClick={onClick}
		>
            <title>Reply</title>
            <path
                d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
                fill='none'
                stroke='currentColor'
                strokeLinejoin='round'
                strokeWidth='2'
            ></path>
        </svg>
    );
}

export default ReplyPost;