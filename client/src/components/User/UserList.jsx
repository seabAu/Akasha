import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UserListItem from './UserListItem';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useShowToast from '../../hooks/useShowToast';

const UserList = () =>
{
    const CurrentUser = useRecoilValue(userAtom); // Logged in user
    const [ loading, setLoading ] = useState( true );
    const [ userList, setUserList ] = useState( [] );
    const showToast = useShowToast();

    // Need to find all users that are not the current user, as well as not already one of current user's followers.
    useEffect( () =>
    {
        // Get all posts for THIS user.
        // console.log( "UserList -> getSuggestedUsers -> CurrentUser = ", CurrentUser );
    
        const getSuggestedUsers = async () =>
        {
            setLoading( true );
            try
            {
                const res = await fetch( `/api/users/suggested` );
                const data = await res.json();
    
                // console.log( "getSuggestedUsers -> data: ", data );
                if ( data.error )
                {
                    // Error
					showToast("Error", data.error, "error");
                    // setUserList( [] );
					return;
                }
                else
                {
                    // Success
					showToast("Error", data.error, "error");
                    setUserList( data.users );
                    // console.log( "getSuggestedUsers.success -> userList: ", data.users );
                }
            } catch ( error )
            {
                showToast( "Error", error.message, "error" );
                // setUserList( [] );
                // console.error( "Error in getSuggestedUsers: ", error );
            } finally
            {
                // console.log( "getSuggestedUsers.finally -> userList: ", userList );
                setLoading( false );
            }
        };
    
        getSuggestedUsers();
    }, [] );
    
    const truncate = ( text, length ) =>
        {
            if ( text.length > length ) return text.substring( 0, length ) + "...";
            else return text;
        }
    return (
        <>
            <Text mb={ 4 } fontWeight={ "bold" } fontSize={14} textAlign={'center'} verticalAlign={'center'}>
                Meet new people
            </Text>
            <Flex flexDirection={ 'column' } gap={ 4 } w={'100%'}>
                { loading && userList.length === 0 ? ( [ ...Array( 5 ) ].map( ( _, index ) =>
                {
                    return (
                        <Flex key={ `chat-${ index }` } gap={ 1 } alignItems={ 'center' } p={ 0 } borderRadius={ "md" }>
                            {/*Avatar skeleton*/ }
                            <Box>
                                <SkeletonCircle size={ "10" } />
                            </Box>
                            <Flex w={ 'full' } flexDirection={ 'column' } gap={ 3 }>
                                <Skeleton h={ `8px` } w={ `80px` } />
                                <Skeleton h={ `8px` } w={ `90px` } />
                            </Flex>
                        </Flex>
                    )
                } ) ) : (
                    userList?.map( ( user, index ) =>
                    {
                        // console.log( "UserList: User = ", user );
                        return (
                            <UserListItem key={ `user-list-item-${ user._id }` } thisUser={ user } />
                        );
                    })
                ) }
            </Flex>
        </>
    );
}

export default UserList
