import { Box, Button, Flex, Heading, Spinner, Text, useColorMode } from "@chakra-ui/react";
import useAuth from '../hooks/useAuth'
import useShowToast from "../hooks/useShowToast";
import { useUser } from "../hooks/useUser";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";

const SettingsPage = () =>
{
    const { colorMode, toggleColorMode } = useColorMode();
	const { user, fetchingUser } = useGetUserProfile(); // Use a custom hook to fetch the user data and set the state. Returns a loading param to make sure we don't jump ahead of the process.
    const currentUser = useRecoilValue( userAtom );
    const navigate = useNavigate();
    const showToast = useShowToast();
    const { handleUpdate, handleLogout, handleDelete, loading } = useAuth();
    const { handleAccountFreeze } = useUser();

    const freezeAccount = async () =>
    {
        if ( !window.confirm( "Are you sure you want to freeze your account?" ) ) return;

        try
        {
            const res = await fetch( "/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            } );
            const data = await res.json();

            if ( data.error )
            {
                return showToast( "Error", data.error, "error" );
            }
            if ( data.success )
            {
                await handleLogout();
                showToast( "Success", "Your account has been frozen", "success" );
            }
        } catch ( error )
        {
            showToast( "Error", error.message, "error" );
        }
    };

    console.log( "currentUser = ", currentUser );

    return (
        ( !currentUser ) ? (
            ( fetchingUser ) ? (
                <Flex justifyContent={ 'center' }>
                    <Spinner size='xl' />
                </Flex>
            ) : (
                <Flex>User not found.</Flex>
            )
        ) : (
            <>
                <Flex flexDir={ "row" } alignItems={ 'center' } justifyContent={ 'center' } >
                    <Heading fontSize={ '24' } my={ 1 } fontWeight={ "bold" }>
                        Your Settings
                    </Heading>
                </Flex>

                <Flex flexDir={ "column" } px={ 2 } gap={ 10 }>

                    {/*Freeze account*/ }
                    <Flex w={ '90em' } flexDir={ "column" } maxW={ '100%' } >
                        <Flex flexDir={ "row" } alignItems={ 'center' } justifyContent={ 'flex-start' } w={ "100%" } gap={4}>
                            <Heading size={ 'md' } my={ 1 } fontWeight={ "bold" }>
                                Freeze Your Account
                            </Heading>
                            <Text bg={'gray.dark'} border={'1px solid black'} px={2} py={1} borderRadius={'full'}>{`${currentUser.isFrozen ? 'Frozen' : 'Not Frozen'}`}</Text>
                        </Flex>
                        <Flex flexDir={ "row" } gap={ 2 }>
                            <Flex w={ '10em' } alignItems={ 'center' } justifyContent={ 'center' } borderRight={ '1px solid grey' }>
                                <Button size={ "sm" } colorScheme='red' onClick={ () => { handleAccountFreeze(); } }>
                                    Freeze
                                </Button>
                            </Flex>
                            <Flex w={ '90em' }>
                                <Text my={ 1 } fontSize={ '16' }>
                                    This will block other users from viewing your account, posts, and details, and your account will be suspended until the next time you log in. You can unfreeze your account anytime by logging in.
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/*Private account*/ }
                    <Flex w={ '90em' } flexDir={ "column" } maxW={ '100%' } >
                        <Flex flexDir={ "row" } alignItems={ 'center' } justifyContent={ 'flex-start' } w={ "100%" } gap={4}>
                            <Heading size={ 'md' } my={ 1 } fontWeight={ "bold" }>
                                Private Your Account
                            </Heading>
                            <Text bg={'gray.dark'} border={'1px solid black'} px={2} py={1} borderRadius={'full'}>{`${currentUser.isPrivate ? 'Private' : 'Not Private'}`}</Text>
                        </Flex>
                        <Flex flexDir={ "row" } gap={ 2 }>
                            <Flex w={ '10em' } alignItems={ 'center' } justifyContent={ 'center' } borderRight={ '1px solid grey' }>
                                    <Button size={ "sm" } colorScheme='red' onClick={ ( e ) =>
                                    {
                                        e.preventDefault();
                                        if ( !window.confirm( "Are you sure?" ) ) return;

                                        console.log( "currentUser.isPrivate = ", currentUser.isPrivate,  "\n\n\n", "currentUser = ", currentUser, "\n\n\n", "user = ", user );
                                        handleUpdate(
                                            e,
                                            currentUser._id,
                                            {
                                                isPrivate: !( currentUser.isPrivate ) 
                                            } );
                                    } }>
                                    Private
                                </Button>
                            </Flex>
                            <Flex w={ '90em' }>
                                <Text my={ 1 } fontSize={ '16' }>
                                    This will make your account invisible to others, but not frozen. You may still post with this enabled if you wish to simply share private posts via URL.
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/*Delete account*/ }
                    <Flex w={ '90em' } flexDir={ "column" } maxW={ '100%' } >
                        <Flex flexDir={ "row" } alignItems={ 'center' } justifyContent={ 'flex-start' } w={ "100%" }>
                            <Heading size={ 'md' } my={ 1 } fontWeight={ "bold" }>
                                Delete Your Account
                            </Heading>
                        </Flex>
                        <Flex flexDir={ "row" } gap={ 2 }>
                            <Flex w={ '10em' } alignItems={ 'center' } justifyContent={ 'center' } borderRight={ '1px solid grey' }>
                                    <Button size={ "sm" } colorScheme='red'
                                        onClick={
                                            (e) => { handleDelete( currentUser._id ); }
                                        }
                                        bg={ 'red' }
                                        _hover={ { bg: 'yellow' } }
                                    >
                                    Delete
                                </Button>
                            </Flex>
                            <Flex w={ '90em' }>
                                <Text my={ 1 } fontSize={ '16' }>
                                    WARNING: This will delete your account and every one of your posts. This process is not reversible!
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    
                    
                </Flex>
            </>
        )
    );
};

export default SettingsPage;


{
    /*
    <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
        <FormLabel htmlFor='isPrivate'>isPrivate:</FormLabel>
        <Switch id='isPrivate' onChange={( e ) =>
                {
                    e.preventDefault();
                    if ( !window.confirm( "Are you sure?" ) ) return;

                    console.log( "currentUser.isPrivate = ", currentUser.isPrivate,  "\n\n\n", "currentUser = ", currentUser, "\n\n\n", "user = ", user );
                    handleUpdate(
                        e,
                        currentUser._id,
                        {
                            isPrivate: !( currentUser.isPrivate ) 
                        } );
                } } isChecked={currentUser.isPrivate ? true : false} />
    </FormControl>
    */
    }