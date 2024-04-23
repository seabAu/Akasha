import
{
    Avatar,
    AvatarBadge,
    Box,
    Flex,
    Image,
    Stack,
    Text,
    WrapItem,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { BsCheck2All, BsCheckAll, BsFillImageFill } from "react-icons/bs";
import { selectedChatAtom } from "../../atoms/chatsAtom";
import { useState } from "react";

// UI for the individual selectable chat records in the left sidebar of the chat page.
const ChatUser = ( { chat, isOnline } ) =>
{

    const currentUser = useRecoilValue( userAtom ); // Logged in user
    const [ selectedChat, setSelectedChat ] = useRecoilState( selectedChatAtom );
    const [ otherUsers, setOtherUsers ] = useState( chat.users.filter(
        ( user ) => user._id.toString() !== currentUser._id.toString()
    ) );
    // const otherUsers = chat.users.filter(
    //     ( user ) => user._id.toString() !== currentUser._id.toString()
    // );
    const lastMessage = chat.lastMessage ? chat.lastMessage : '';

    const colorMode = useColorMode(); // Chakra UI hook for conditionally setting the color mode.
    // console.log( chat, "otherUsers: ", otherUsers );

    const truncate = ( text, length ) =>
    {
        if ( text.length > length ) return text.substring( 0, length ) + "...";
        else return text;
    }
    // remove the current user from the participants array

    return otherUsers && otherUsers.length > 0 && (
        <Flex
            gap={ 4 }
            alignItems={ "center" }
            p={ "1" }
            _hover={ {
                cursor: "pointer",
                bg: useColorModeValue( "gray.dark", "gray.700" ),
                color: "white"
            } }
            borderRadius={ "md" }
            onClick={ () =>
            {
                const user = otherUsers[ 0 ];
                if ( user )
                {
                    setSelectedChat( {
                        _id: chat._id,
                        userId: user._id,
                        userAvatar: user.imgAvatar,
                        username: user.username,
                        mock: chat.mock
                    } )
                }
            } }
            bg={
                selectedChat?._id === chat._id ?
                    (
                        ( colorMode === "light" ? 'gray.200' : 'gray.dark' )
                    ) : ""
            }
            color={
                selectedChat?._id === chat._id ?
                    (
                        ( colorMode === "light" ? 'black' : 'white' )
                    ) : "" }
        >
            <WrapItem>
                <Avatar
                    size={ {
                        base: "xs",
                        sm: "sm",
                        md: "md"
                    } }
                    src={ `${ ( otherUsers && otherUsers.length > 0 ) ? ( otherUsers[ 0 ].imgAvatar ) : ( 'https://bit.ly/broken-link' ) }` }>
                    { isOnline
                        ? <AvatarBadge boxSize='1em' bg='green.500' />
                        : "" }
                </Avatar>
            </WrapItem>

            <Stack direction={ "column" } fontSize={ "sm" }>
                <Text fontWeight='700' display={ "flex" } alignItems={ "center" }>
                    { otherUsers[ 0 ].username }
                    <Image src='/assets/verified.png' w={ 4 } h={ 4 } ml={ 1 } />
                </Text>
                <Text fontSize={ "xs" } display={ "flex" } alignItems={ "center" } gap={ 1 }>
                    {
                        currentUser._id !== lastMessage.senderId ? (
                            <Box color={ lastMessage.seen ? "blue.400" : "green.400" }>
                                <BsCheck2All size={ 16 } />
                        </Box>
                        ): (
                            ""
                        )
                    }
                    {
                        lastMessage.text.length > 18
                            ? lastMessage.text.substring( 0, 18 ) + "..."
                            : lastMessage.text || <BsFillImageFill size={ 16 } />
                    }
                </Text>
            </Stack>
        </Flex>
    );
};

export default ChatUser;