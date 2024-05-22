import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { chatsAtom, selectedChatAtom } from '../atoms/chatsAtom';

// To avoid duplicating code for fetching a given user's data. 
const useChat = () => {
    const showToast = useShowToast();
    const selectedChat = useRecoilValue( selectedChatAtom );
    const setChats = useSetRecoilState( chatsAtom );
    const currentUser = useRecoilValue( userAtom );
    const [ loading, setLoading ] = useState( true );

    const handleSendMessage = async( inputs, setMessages ) => {
        // console.log( "getUser -> username = ", username );
        setLoading( true );
        const { text, img } = inputs;
        try {
            const res = await fetch( `/api/chats/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( {
                    text: text,
                    img: img,
                    receiverId: selectedChat.userId
                } )
            } );
            const data = await res.json();

            // console.log( "handleSendMessage -> data: ", data );

            if ( data.error ) {
                // Error
                showToast( "Error", data.error, "error" );
            } else {
                // Success
                //// showToast( "Success", data.message, "success" );
                // setUser( data.user );
                // console.log( "handleSendMessage -> success -> data.user: ", user );

                setMessages( ( messages ) => [ ...messages, data.data ] );
                setChats( ( prev ) => {
                    const updatedChats = prev.map( chat => {
                        if ( chat._id === selectedChat._id ) {
                            // Is selected chat, update it.
                            return {
                                ...chat,
                                text: text,
                                senderId: data.senderId
                            }
                        }

                        // Otherwise, return chat unchanged.
                        return chat;
                    } );

                    return updatedChats;
                } )
            }
        } catch ( error ) {
            console.error( "Error in getUser: ", error );
        } finally {
            // console.log( "handleSendMessage -> finally -> user: ", user );
            setLoading( false );
        }
    };


    return ( { loading, handleSendMessage } );
}

export default useChat;
