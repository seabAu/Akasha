import {
    Avatar,
    AvatarBadge,
    Box,
    Flex,
    Image,
    Stack,
    Text,
    WrapItem,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";

const Chat = ({isOnline = true}) => {

    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={"1"}
            _hover={{
            cursor: "pointer",
            bg: useColorModeValue("gray.600", "gray.dark"),
            color: "white"
        }}
            bg={"gray.dark"}
            borderRadius={"md"}>
            <WrapItem>
                <Avatar
                    size={{
                    base: "xs",
                    sm: "sm",
                    md: "md"
                }}
                    src={`https://bit.ly/broken-link`}>
                    {isOnline
                        ? <AvatarBadge boxSize='1em' bg='green.500'/>
                        : ""}
                </Avatar>
            </WrapItem>

            <Stack direction={"column"} fontSize={"sm"}>
                <Text fontWeight='700' display={ "flex" } alignItems={ "center" }>
                    USERNAME
                    <Image src='/assets/verified.png' w={4} h={4} ml={1}/>
                </Text>
                <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>Message text bla bla bla bla</Text>
            </Stack>
        </Flex>
    );
};

export default Chat;