import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

// Define a useSocket hook for using the context provider.
// Calling this hook will provide the socket. 
export const useSocket = () =>
{
    return useContext( SocketContext );
}

// We use this to wrap the application in a socket.io context provider.
export const SocketContextProvider = ( { children } ) =>
{
    const [ socket, setSocket ] = useState( null );
    const user = useRecoilValue( userAtom );
    const [ onlineUsers, setOnlineUsers ] = useState( [] );

    useEffect( () =>
    {
        const socket = io( "http://localhost:5000", {
            query: {
                userId: user?._id
            }
        } );

        setSocket( socket );

        // Socket.on listens for events, both client and server side.
        socket.on( "getOnlineUsers", ( users ) =>
        {
            setOnlineUsers( users );
        } );

        // On unmount:
        return () => socket && socket.close();
    }, [ user?._id ] );

    console.log( "SocketContextProvider -> socket.on(getOnlineUsers) -> onlineUsers = ", onlineUsers );

    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            { children }
        </SocketContext.Provider>
    );
}
