'use client'

import
{
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    // BoxProps,
    // FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Divider,
    Heading,
} from '@chakra-ui/react'
import
{
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi'
import Header from './Header'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { BellIcon, MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import { BsFillChatQuoteFill, BsPersonFillGear } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import userAtom from '../../atoms/userAtom'
import CreatePost from '../Post/CreatePost'
import Content from './Content'
import Logo from './Logo'
// import { IconType } from 'react-icons'

const SidebarContent = ( { open, setOpen, onClose, sidebarWidth, headerHeight, ...rest } ) =>
{
    const currentUser = useRecoilValue( userAtom );

    const LinkItems = [
        {
            name: 'Home',
            navlink: '/',
            icon: FiHome
        }, {
            name: 'Activity',
            navlink: '/activity',
            icon: FiTrendingUp
        }, {
            name: 'Explore',
            navlink: '/explore',
            icon: FiCompass
        }, {
            name: 'Chat',
            navlink: '/chat',
            icon: BsFillChatQuoteFill
        }, {
            name: 'Bookmarks',
            navlink: '/bookmarks',
            icon: FiStar
        }, {
            name: 'Notifications',
            navlink: '/notifications',
            icon: FiBell
        }, {
            name: 'Profile',
            navlink: `/u/${currentUser?.username}`,
            icon: BsPersonFillGear
        }, {
            name: 'Settings',
            navlink: `/settings`,
            icon: FiSettings
        },
        // {
        //     name: 'Create',
        //     navlink: ``,
        //     icon: CreatePost
        // }
    ];

    return (
        <Box
            transition="1s all ease"
            borderRight="1px"
            borderRightColor={ useColorModeValue( 'gray.200', 'gray.700' ) }
            w={ { base: `${ sidebarWidth }`, md: `${ sidebarWidth }` } }
            pos="fixed"
            h="full"
            maxW={ `${ sidebarWidth }` }
            // bg={ useColorModeValue( 'white', 'gray.900' ) }
            bg={ useColorModeValue( 'white', 'gray.dark' ) }

            { ...rest }>
            <Flex  alignItems="center" justifyContent="center" 
            height={`${headerHeight}`}
            bg={ useColorModeValue( 'gray.50', 'gray.dark' ) }
            borderBottomWidth="1px"
                borderBottomColor={ useColorModeValue( 'gray.200', 'gray.700' ) }
                gap={ 2 }
                p={2}
            >
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" >
                <RouterLink to='/'>
                    <Logo showName={true} w={16} size={'md'}/>
                </RouterLink>
                </Text>
                <CloseButton display={ { base: 'flex', md: 'none' } } onClick={ () => { setOpen( false ); } } position={'absolute'} top={0} right={0} p={1}/>
            </Flex>
            { LinkItems.map( ( link ) =>
            {``
                return (
                    link.navlink !== '' ? (
                            <RouterLink to={ `${ link.navlink }` } >
                            <NavItem
                            key={ link.name }
                            icon={ link.icon }
                            bg={ useColorModeValue( 'white', 'gray.dark' ) }
                            _hover={ {
                                backgroundColor: 'gray.light',
                                color: 'gray.100'
                            } }
                        >
                                <Flex
                                    flexDirection={ "row" }
                                    flex={ 1 }
                                    alignItems={ "center" }
                                    justifyContent={ "flex-start" }
                                    gap={ 5 }
                                    w={ "full" }>
                                    { link.name }
                                </Flex>
                        </NavItem>
                        </RouterLink>
                    ) : (
                        <NavItem key={ link.name } icon={ link.icon } _hover={ {
                            backgroundColor: 'gray.light',
                            color: 'gray.100'
                        } }>
                            <Flex
                                flexDirection={ "row" }
                                flex={ 1 }
                                alignItems={ "center" }
                                justifyContent={ "flex-start" }
                                gap={ 5 }
                                w={ "full" }>
                                { link.name }
                            </Flex>
                        </NavItem>
                    )
                );
            } ) }

            <CreatePost />


        </Box>
    )
}

const NavItem = ( { icon, children, sidebarWidth, ...rest } ) =>
{
    return (
        <Box
            as="a"
            href="#"
            style={ { textDecoration: 'none' } }
            _focus={ { boxShadow: 'none' } }>
            <Flex
                align="center"
                p="2"
                mx="2"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={ {
                    bg: 'cyan.400',
                    color: 'white',
                } }
                { ...rest }>
                { icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={ {
                            color: 'white',
                        } }
                        as={ icon }
                    />
                ) }
                { children }
            </Flex>
        </Box>
    )
}

const HeaderContent = ( { open, setOpen, onOpen, headerHeight, sidebarWidth, ...rest } ) =>
{
    return <Header onOpen={ onOpen } open={ open } setOpen={ setOpen } headerHeight={ headerHeight } sidebarWidth={ sidebarWidth } />;
}

const Sidebar = ( { open, setOpen, isOpen, onOpen, onClose, sidebarWidth, headerHeight } ) =>
{
    return ( <>
        {/*Fullscreen view*/ }
        <SidebarContent open={ open } setOpen={ setOpen } display={ { base: `${ open ? 'block' : 'none' }`, md: 'block' } } headerHeight={ headerHeight } sidebarWidth={ `${ sidebarWidth }` } />

    </>
    );
}

const Nav = ( { children } ) =>
{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ open, setOpen ] = useState( isOpen || false );
    const headerHeight = 16;
    const sidebarWidth = 40;
    return (
        <Box
            bg={ useColorModeValue( 'white', 'gray.dark' ) }
            // border={ '1px solid white' }
            position={ 'relative' }
            overflow={ 'hidden' }
            pos="fixed"
            h="full"
            w="full"
        >
            {/*Sidebar*/ }
            <Sidebar
                open={ open }
                setOpen={ setOpen }
                isOpen={ isOpen }
                onOpen={ onOpen }
                onClose={ onClose }
                sidebarWidth={ sidebarWidth }
                headerHeight={headerHeight}
            />

            {/*Header*/ }
            <HeaderContent
                open={ open }
                setOpen={ setOpen }
                onOpen={ onOpen }
                headerHeight={ headerHeight }
                sidebarWidth={ sidebarWidth }
                maxW={ '100vw' }
                maxH={ '100vh' }
                pos="fixed"
                h="full"
            />
            
            {/*Content*/ }
            <Box
                // ml={ { base: `${ sidebarWidth }`, md: `${ sidebarWidth }` } }
                ml={ { base: `${ open ? sidebarWidth : '0' }`, md: sidebarWidth } }
                h={ "100%" }
                pb={20}
            // border={ '1px solid blue' }
            >
                {/* Content */ }
                <Content>{ children }</Content>
            </Box>
        </Box>
    )
}

export default Nav