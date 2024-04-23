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
    Link
} from '@chakra-ui/react'
import {useState} from 'react'
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
import {useSetRecoilState} from 'recoil'
import authScreenAtom from '../../atoms/authAtom'
import userAtom from '../../atoms/userAtom'
import useShowToast from '../../hooks/useShowToast'
import useAuth from '../../hooks/useAuth'

export default function Login() {
    const setAuthScreen = useSetRecoilState(authScreenAtom);

    const [showPassword,
        setShowPassword] = useState(false)
    const { handleLogin, loading } = useAuth();

    // This object must match the signup object.
    const [ inputs, setInputs ] = useState( {
        username: "",
        password: ""
    } );

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();

    return (
        <Flex align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Log In
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    px={8}
                    py={8}
                    w={{
                        base: "full", // Below, full width sm: "400px", // Small or above 
                    } }>
                    <Stack spacing={4}>
                        <FormControl id="username" isRequired>
                            <FormLabel>UserName</FormLabel>
                            <Input type="text"  onChange={ ( e ) => setInputs( { ...inputs, username: e.target.value } ) }
                                        value={inputs.username}/>
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword
                                    ? 'text'
                                    : 'password'}  onChange={ ( e ) => setInputs( { ...inputs, password: e.target.value } ) }
                                    value={ inputs.password }
                                />
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
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={'white'}
                                _hover={{
                                bg: useColorModeValue("gray.700", "gray.800")
                                } }
                                isLoading={loading}
                                onClick={() => {
                                handleLogin(inputs);
                            }}>
                                Login
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Need an account? {' '}
                                <Link
                                    color={'blue.400'}
                                    onClick={() => {
                                    setAuthScreen("signup");
                                }}>Sign Up</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}