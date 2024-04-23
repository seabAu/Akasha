import { Box, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'

const DotText = ({leftText, rightText, fontSize}) => {
    return (
        <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={fontSize ? fontSize : "sm"}>{leftText ? leftText : ''}</Text>
            <Box Box w={0.5} h={0.5} bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"} fontSize={fontSize ? fontSize : "sm"}>{rightText ? rightText : ''}</Text>
        </Flex>
    )
}

export default DotText
