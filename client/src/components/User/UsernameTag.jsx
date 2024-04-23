import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

const UsernameTag = ( {username, isVerified} ) => {
    return (
        <Flex w={'full'} alignItems={'center'}>
            <Text fontSize={"sm"} fontWeight={"bold"}>{`${username}`}</Text>
            { isVerified && <Image src='/assets/verified.png' w={4} h={4} ml={1}></Image> }
        </Flex>
    )
}

export default UsernameTag
