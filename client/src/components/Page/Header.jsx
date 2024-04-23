import
{
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Center,
    Flex,
    HStack,
    Heading,
    IconButton,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Portal,
    Spacer,
    Text,
    VStack,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useAuth from '../../hooks/useAuth';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { RxAvatar } from 'react-icons/rx';
import { CgMoreO, CgProfile } from 'react-icons/cg';
import { FiChevronDown, FiLogOut, FiMenu } from 'react-icons/fi';
import { BellIcon, MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import CreatePost from '../Post/CreatePost';
import Logo from './Logo';

const Header = ( { open, setOpen, onOpen, headerHeight = 16, sidebarWidth = 40, ...rest } ) =>
{
    const { colorMode, toggleColorMode } = useColorMode();
    const currentUser = useRecoilValue( userAtom );
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const renderLoggedInIcon = () =>
    {
        return (
            <MenuButton
                as={ Button }
                rounded={ 'full' }
                variant={ 'link' }
                size={ 24 }
                cursor={ 'pointer' }
                minW={ 0 }
            >
                <HStack>
                    <Avatar
                        size={ 'sm' }
                        src={ currentUser.imgAvatar }
                    />
                    <VStack
                        display={ { base: 'none', md: 'flex' } }
                        alignItems="flex-start"
                        spacing="1px"
                        ml="2">
                        <Text fontSize="sm">{ currentUser.username }</Text>
                        <Text fontSize="xs" color="gray.600">
                            Admin
                        </Text>
                    </VStack>
                    <Box display={ { base: 'none', md: 'flex' } }>
                        <FiChevronDown />
                    </Box>
                </HStack>
            </MenuButton>
        );
    }

    const renderOptionsDropdown = () =>
    {
        return (
            <ButtonGroup gap='2' alignItems={ 'center' }>
                { currentUser
                    ? ( <>
                        <Box className=''>
                            <Menu >
                                { renderLoggedInIcon() }
                                <Portal>
                                    <MenuList bg={ useColorModeValue( 'white', 'gray.dark' ) } alignItems={ 'center' }>

                                        <br />
                                        <Center>
                                            <Avatar
                                                size={ '2xl' }
                                                src={ 'https://avatars.dicebear.com/api/male/username.svg' } />
                                        </Center>
                                        <br />
                                        <Center>
                                            <p>{ currentUser.username }</p>
                                        </Center>
                                        <br />
                                        <MenuDivider />

                                        <RouterLink to={ `/chat` } >
                                            <MenuItem
                                                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                                _hover={ {
                                                    backgroundColor: 'gray.light',
                                                    color: 'gray.100'
                                                } }>

                                                <Flex
                                                    flexDirection={ "row" }
                                                    flex={ 1 }
                                                    alignItems={ "center" }
                                                    justifyContent={ "flex-start" }
                                                    gap={ 4 }
                                                    w={ "full" }>
                                                    <BsFillChatQuoteFill />Chat
                                                </Flex>

                                            </MenuItem>
                                        </RouterLink>
                                        <RouterLink to={ `/u/${ currentUser.username }` } >
                                            <MenuItem
                                                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                                _hover={ {
                                                    backgroundColor: 'gray.light',
                                                    color: 'gray.100'
                                                } }>

                                                <Flex
                                                    flexDirection={ "row" }
                                                    flex={ 1 }
                                                    alignItems={ "center" }
                                                    justifyContent={ "flex-start" }
                                                    gap={ 4 }
                                                    w={ "full" }>
                                                    <CgProfile />Profile
                                                </Flex>

                                            </MenuItem>
                                        </RouterLink>

                                        <RouterLink to={ `/notifications` } >
                                            <MenuItem
                                                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                                _hover={ {
                                                    backgroundColor: 'gray.light',
                                                    color: 'gray.100'
                                                } }>
                                                <Flex
                                                    flexDirection={ "row" }
                                                    flex={ 1 }
                                                    alignItems={ "center" }
                                                    justifyContent={ "flex-start" }
                                                    gap={ 4 }
                                                    w={ "full" }>
                                                    <BellIcon />Notifications
                                                </Flex>
                                            </MenuItem>
                                        </RouterLink>

                                        <RouterLink to={ `/update` } >
                                            <MenuItem
                                                bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                                _hover={ {
                                                    backgroundColor: 'gray.light',
                                                    color: 'gray.100'
                                                } }>

                                                <Flex
                                                    flexDirection={ "row" }
                                                    flex={ 1 }
                                                    alignItems={ "center" }
                                                    justifyContent={ "flex-start" }
                                                    gap={ 4 }
                                                    w={ "full" }>
                                                    <SettingsIcon />Settings
                                                </Flex>

                                            </MenuItem>
                                        </RouterLink>

                                        <MenuItem
                                            bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                            _hover={ {
                                                backgroundColor: 'gray.light',
                                                color: 'gray.100'
                                            } }>
                                            <Flex
                                                flexDirection={ "row" }
                                                flex={ 1 }
                                                alignItems={ "center" }
                                                justifyContent={ "flex-start" }
                                                gap={ 4 }
                                                w={ "full" } onClick={ toggleColorMode }>

                                                { colorMode === 'light'
                                                    ? <MoonIcon />
                                                    : <SunIcon /> } { `${ colorMode === 'light' ? 'Dark' : 'Light' } Mode` }

                                            </Flex>
                                        </MenuItem>

                                        <MenuItem
                                            bg={ useColorModeValue( 'white', 'gray.dark' ) }
                                            _hover={ {
                                                backgroundColor: 'gray.light',
                                                color: 'gray.100'
                                            } }>
                                            <Flex
                                                flexDirection={ "row" }
                                                flex={ 1 }
                                                alignItems={ "center" }
                                                justifyContent={ "flex-start" }
                                                gap={ 4 }
                                                w={ "full" } onClick={ handleLogout }>
                                                <FiLogOut />Logout
                                            </Flex>
                                        </MenuItem>

                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Box> </>
                    )
                    : (
                        <Button colorScheme='teal' onClick={ ( e ) =>
                        {
                            e.preventDefault();
                            navigate( '/auth' );
                        } }>Sign In</Button > ) }
            </ButtonGroup>
        );
    }

    return (
        <Flex
            // justifyContent={ "space-between" }
            mt={ 0 } mb={ 0 }
            right={ 0 }
            gap='2'
            ml={ { base: `${ open ? sidebarWidth : '0' }`, md: sidebarWidth } }
            px={ { base: 2, md: 2 } }
            height={ `${ headerHeight }` }
            alignItems="center"
            // transition="1s margin ease"
            // bg={ useColorModeValue( 'white', 'gray.900' ) }
            bg={ useColorModeValue( 'gray.50', 'gray.dark' ) }
            borderBottomWidth="1px"
            borderBottomColor={ useColorModeValue( 'gray.200', 'gray.700' ) }
            justifyContent={ { base: 'space-between', md: 'flex-end' } } { ...rest }
        >

            <IconButton
                display={ { base: 'flex', md: 'none' } }
                onClick={ () =>
                {
                    console.log( 'onOpen :: open = ', open ); onOpen();
                    setOpen( !open );
                } }
                variant="outline"
                aria-label="open menu"
                icon={ <FiMenu /> }
            />

            {
                /*
                
                !open ? (
                <Box p='2'>
                    <RouterLink to='/'>
                        <Logo showName={true} w={16} size={'md'} />
                    </RouterLink>
                </Box>
                ) : (
                        <></>
                )
                */
            }
            <Spacer />

            { renderOptionsDropdown() }
        </Flex>
    );
}

export default Header
