'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../../atoms/authAtom'
import userAtom from '../../atoms/userAtom'
import useAuth from '../../hooks/useAuth'

export default function SignUp() {
    const [ showPassword,
        setShowPassword ] = useState( false );
    const setAuthScreen = useSetRecoilState( authScreenAtom );
    const setUser = useSetRecoilState( userAtom );
    const { handleSignup, handleLogin, loading, handleLogout } = useAuth();

    // This object must match the signup object.
    const [ inputs, setInputs ] = useState( {
        name: "",
        username: "",
        email: "",
        password: ""
    } );

    const toast = useToast();

    return (
        <Flex
            align={'center'}
            justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to join our community ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    px={8}
                    py={8} w={ {
                        base: "full", // Below, full width
                        sm: "400px", // Small or above
                    }}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input type="text" onChange={ ( e ) => setInputs( { ...inputs, name: e.target.value } ) }
                                        value={inputs.name}
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="username" isRequired>
                                    <FormLabel>UserName</FormLabel>
                                    <Input type="text" onChange={ ( e ) => setInputs( { ...inputs, username: e.target.value } ) }
                                        value={inputs.username}/>
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" onChange={ ( e ) => setInputs( { ...inputs, email: e.target.value } ) }
                                        value={inputs.email}/>
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword
                                    ? 'text'
                                    : 'password'} onChange={ ( e ) => setInputs( { ...inputs, password: e.target.value } ) }
                                    value={inputs.password}/>
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword
                                            ? <ViewIcon/>
                                            : <ViewOffIcon/>}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                color={'white'}
                                bg={useColorModeValue("gray.600", "gray.700")}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800")
                                } }
                                onClick={ () =>
                                {
                                    handleSignup( inputs );
                                }}
                            >
                            Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user?{' '}
                                <Link color={ 'blue.400' } onClick={ () => {setAuthScreen( "login" ); }}
                                >Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}