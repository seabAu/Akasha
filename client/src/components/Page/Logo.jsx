import
{
    Avatar,
    Flex,
    Heading,
    Image,
    useColorMode,
} from '@chakra-ui/react'
import React from 'react'
const Logo = ( props ) =>
{
    const {
        showName = false,
        w = 16,
        size='md'
    } = props;

    const { colorMode, toggleColorMode } = useColorMode();
    return (
        
        <Flex
        flexDirection={ 'row' }
        justifyContent={ "space-between" }
        mt={ 0 }
        mb={ 0 }
        alignItems='center'
        px={ '0px' }
        gap='1'
    >
            <Image
                cursor={ "pointer" }
                alt='logo'
                w={ w }
                src={ colorMode === 'dark'
                    ? '/assets/Akasha-Logo-Petals.svg'
                    : '/assets/Akasha-Logo-Petals-3.svg' } />
            {
                showName && (
                    <Heading size={size}>Akasha</Heading>
                )
            }
    </Flex>
    )
}

export default Logo
