import {Button, Flex, Text, useColorModeValue} from '@chakra-ui/react'
import React from 'react'
import {FiLogOut} from "react-icons/fi";
import useAuth from '../../hooks/useAuth'

const Logout = () => {
    const { handleLogout } = useAuth();

    return (
        <Flex
            flexDirection={"row"}
            flex={1}
            alignItems={"center"}
            justifyContent={"flex-start"}
            gap={5}
            w={"full"} onClick={handleLogout}>
            <FiLogOut/>Logout
        </Flex>
    )
}

export default Logout
