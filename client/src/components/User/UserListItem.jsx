import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useUserFollow } from "../../hooks/useUser";

const UserListItem = ({ thisUser }) => {
	const { followUser, following, loading } = useUserFollow(thisUser);

    return (
        thisUser ?
            ( <Flex gap={ 1 } maxW={'100%'} justifyContent={ "space-between" } alignItems={ "center" } overflow={'hidden'} _hover={ {
                bg: following ? "white" : "blue.400",
                opacity: ".8",
            } }
            p={1} w={"100%"}>
                {/* left side */ }
                <Flex gap={ 2 } as={ Link } to={ `${ thisUser?.username }` }>
                    <Avatar size={'sm'} src={ thisUser?.imgAvatar } />
                    <Box>
                        <Text fontSize={ "10px" } fontWeight={ "bold" } maxW={'16ch'} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                            { thisUser?.username }
                        </Text>
                        <Text color={ "gray.light" } fontSize={ "10px" } maxW={'16ch'} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                            { thisUser?.name }
                        </Text>
                    </Box>
                </Flex>
                {/* right side */ }
                <Button
                    p={ 2 }
                    m={ 0 }
                    h={ 5 }
                    fontSize={'10px'}
                    color={ following ? "black" : "white" }
                    bg={ following ? "white" : "blue.400" }
                    onClick={ () =>
                    {
                        console.log( "Following this user: ", thisUser, "following = ", following );
                        followUser( thisUser );
                    }}
                    isLoading={ loading }
                    _hover={ {
                        color: following ? "black" : "white",
                        opacity: ".8",
                    } }
                >
                    { following ? "Unfollow" : "Follow" }
                </Button>
            </Flex> ) : ( <></> )
    );
};

export default UserListItem;
