'use client'

import
    {
        Button,
        Flex,
        FormControl,
        FormLabel,
        Heading,
        Input,
        Stack,
        useColorModeValue,
        HStack,
        Avatar,
        AvatarBadge,
        IconButton,
        Center,
        Checkbox,
        Textarea,
        Img,
        Image
    } from '@chakra-ui/react'

import { SmallCloseIcon } from '@chakra-ui/icons'
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useEffect, useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const UpdateProfilePage = () =>
{
    const showToast = useShowToast();
    const navigate = useNavigate();

    const [ updating,
        setUpdating ] = useState( false );
    const [ imgTarget,
        setImgTarget ] = useState( "avatar" );
    const [ user,
        setUser ] = useRecoilState( userAtom );

    // Destructure one of multiple exports of usePreviewImg.
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const { handleUpdate, currentUser, loading } = useAuth();

    const avatarFileRef = useRef( null );
    const bgFileRef = useRef( null );

    const [ inputs,
        setInputs ] = useState( {
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            password: "",
            imgAvatar: user.imgAvatar,
            imgBackground: user.imgBackground,
            isVisible: user.isVisible,
            isFrozen: user.isFrozen,
            isPrivate: user.isPrivate,
            isVerified: user.isVerified,
        } );

    useEffect( () =>
    {
        console.log( "UpdateProfilePage => user: ", user, " :: ", "inputs: ", inputs, " :: ", "imgUrl = ", imgUrl );
    }, [ inputs, imgUrl ] );

    useEffect( () =>
    {
        if ( imgTarget === "avatar" )
            inputs.imgAvatar = imgUrl;
        else if ( imgTarget === "bg" )
            inputs.imgBackground = imgUrl;
    }, [ imgUrl ] );

    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        handleUpdate( e, user._id, inputs );

        /*
        setUpdating( true );
        try
        {
            // Fetch request
            // console.log(inputs);
            const res = await fetch( `api/users/update/${ user.id }`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( {
                    ...inputs
                } )
            } );

            const data = await res.json();

            console.log( data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
            }
            else
            {
                // Success
                const updatedUser = data.user;
                console.log( updatedUser );

                showToast( "Success", data.message, "success" );

                // Clear localStorage.
                localStorage.setItem( 'user', JSON.stringify( updatedUser ) );

                // Set state.
                setUser( updatedUser );

            }
        } catch ( error )
        {
            showToast( "Error", error, "error" );
            console.error( "Error in handleSubmit: ", error );
            setUpdating( false );
        } finally
        {
            setUpdating( false );
        }
        */
    }

    const getUser = async () =>
    {
        try
        {
            // Fetch request
            const res = await fetch( `/api/users/profile/${ user.username }`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( inputs )
            } );

            const data = await res.json();
            console.log( data );

            if ( data.error )
            {
                // Error
                showToast( "Error", data.error, "error" );
            } else
            {
                // Success
                showToast( "Success", data.message, "success" );

                const user = data.user;

                // Set current user info. On success, we receive back the active user's details.
                console.log( data.user );

                // Save to localStorage.
                localStorage.setItem( "user", JSON.stringify( data.user ) );

                // Update state.
                setUser( data.user );
            }

        } catch ( error )
        {
            console.error( "Error in getUser: ", error );
        }
    }

    return (
        <form onSubmit={ handleSubmit }>
            <Flex align={ "center" } justify={ "center" } my={ 6 }>
                <Stack
                    spacing={ 8 }
                    w={ "full" }
                    maxW={ "xl" }
                    bg={ useColorModeValue( "white", "gray.dark" ) }
                    rounded={ "xl" }
                    boxShadow={ "lg" }
                    p={ 6 }>
                    <Heading
                        lineHeight={ 1.1 }
                        fontSize={ {
                            base: "2xl",
                            sm: "3xl"
                        } }>
                        Update Profile
                    </Heading>

                    <FormControl id='imgAvatar'>
                        <Stack direction={ [ "column", "row" ] } spacing={ 6 }>
                            <Center>
                                <Avatar
                                    size='xl'
                                    boxShadow={ "md" }
                                    src={ imgUrl === null ? user.imgAvatar
                                        : imgUrl } />
                            </Center>
                            <Center w='full'>
                                <Button
                                    w='full'
                                    onClick={ () =>
                                    {
                                        setImgTarget( "avatar" );
                                        avatarFileRef
                                            .current
                                            .click();
                                    } }>
                                    Change Avatar
                                </Button>
                                <Input
                                    type='file'
                                    hidden
                                    ref={ avatarFileRef }
                                    onChange={ ( e ) =>
                                    {
                                        handleImageChange( e );
                                        // console.log("File onchange :: imgUrl = ", imgUrl);
                                    } } />
                            </Center>

                            {/*
                            <Center w='full'>
                                <Button
                                    w='full'
                                    onClick={() => {
                                    setImgTarget("bg");
                                    bgFileRef
                                        .current
                                        .click();
                                }}>
                                    Change Background
                                </Button>
                                <Input
                                    type='file'
                                    hidden
                                    ref={bgFileRef}
                                    onChange={(e) => {
                                    handleImageChange(e);
                                    console.log("File onchange :: imgUrl = ", imgUrl);
                                }}/>
                            </Center>
                            */}

                        </Stack>
                    </FormControl>

                    <FormControl id='name'>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder='Name'
                            value={ inputs.name }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                name: e.target.value
                            } ) }
                            _placeholder={ {
                                color: "gray.500"
                            } }
                            type='text' />
                    </FormControl>

                    <FormControl id='username'>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder='Username'
                            value={ inputs.username }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                username: e.target.value
                            } ) }
                            _placeholder={ {
                                color: "gray.500"
                            } }
                            type='text' />
                    </FormControl>

                    <FormControl id='email'>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder='your-email@example.com'
                            value={ inputs.email }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                email: e.target.value
                            } ) }
                            _placeholder={ {
                                color: "gray.500"
                            } }
                            type='email' />
                    </FormControl>

                    <FormControl id='bio'>
                        <FormLabel>Bio</FormLabel>
                        <Textarea
                            placeholder='Your bio.'
                            value={ inputs.bio }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                bio: e.target.value
                            } ) }
                            _placeholder={ {
                                color: "gray.500"
                            } }
                            size='sm'
                            resize={ 'vertical' } />
                    </FormControl>

                    <FormControl id='status'>
                        <FormLabel>Status</FormLabel>
                        <Textarea
                            placeholder='Your status message.'
                            value={ inputs.status }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                status: e.target.value
                            } ) }
                            _placeholder={ {
                                color: "gray.500"
                            } }
                            size='sm'
                            resize={ 'vertical' } />
                    </FormControl>

                    <FormControl id='password'>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder='password'
                            value={ inputs.password }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                password: e.target.value
                            } ) }
                            _placeholder={ {
                                color: "gray.500"
                            } }
                            type='password' />
                    </FormControl>

                    <FormControl id='isVisible'>
                        <FormLabel>Visible</FormLabel>
                        <Checkbox
                            isChecked={ user.isVisible }
                            onChange={ ( e ) => setInputs( {
                                ...inputs,
                                isVisible: e.target.checked
                            } ) }></Checkbox>
                    </FormControl>

                    <Stack spacing={ 6 } direction={ [ "column", "row" ] }>
                        <Button
                            bg={ "red.400" }
                            color={ "white" }
                            w='full'
                            _hover={ {
                                bg: "red.500"
                            } }
                            onClick={ () =>
                            {
                                navigate( -1 );
                            } }
                        >
                            Cancel
                        </Button>
                        <Button
                            bg={ "green.400" }
                            color={ "white" }
                            w='full'
                            _hover={ {
                                bg: "green.500"
                            } }
                            type='submit'
                            isLoading={ updating }>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}

export default UpdateProfilePage;