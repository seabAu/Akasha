import {Avatar, Box, Flex, Image, Text} from '@chakra-ui/react'
import React, {useState} from 'react'
import {Bs3Circle, BsThreeDots} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import ActionIcons from '../components/Page/ActionIcons'
import DotText from '../components/DotText'
import UsernameTag from '../components/User/UsernameTag'

// This is the view for a specific post. 
const UserPost = ( { post } ) =>
{
    const {
        userId = '',
        postId = '',
        likes = 0,
        replies = 0,
        postImg,
        postTitle = '',
        postContent = '',
        postDate,
        postLink,
        comments = [],
    } = post;

    const [liked,
        setLiked] = useState(false);

    return (
        <Link to={postLink}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} name={`usernamehere`} src={`/assets/user.svg`}/>
                    <Box w={"1px"} h={"full"} mg={"gray.light"} my={4}></Box>

                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size={"xs"}
                            name={`Mr. Bean`}
                            src={`https://bit.ly/dan-abramov`}
                            pos={"absolute"}
                            top={"-1px"}
                            left={"15px"}
                            padding={"2px"}/>
                        <Avatar
                            size={"xs"}
                            name={`Mr. Bean`}
                            src={`https://bit.ly/sage-adebayo`}
                            pos={"absolute"}
                            bottom={"-4px"}
                            right={"0px"}
                            padding={"2px"}/>
                        <Avatar
                            size={"xs"}
                            name={`Mr. Bean`}
                            src={`https://bit.ly/prosper-baba`}
                            pos={"absolute"}
                            bottom={"-4px"}
                            left={"4px"}
                            padding={"2px"}/>

                    </Box>
                </Flex>

                <Flex flex={1} flexDirection={"column"} gap={2}>

                    <Flex justifyContent={ "space-between" } w={ "full" }>
                        <UsernameTag username={`${'usernamehere'}`} isVerified={true} />

                        <Flex gap={4} alignItems={"center"}>
                            <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                            <Box className='hover-dark'>
                                <BsThreeDots/>
                            </Box>
                        </Flex>
                    </Flex>

                    {/* Post text */}
                    <Text fontSize={ "sm" }>{ postContent }</Text>
                    
                    {/* Post Image */}
                    <Box
                        borderRadius={6}
                        overflow={"hidden"}
                        border={`1px solid ${ 'gray.light'}`}
                        borderColor={'gray.light'}>
                        {postImg && <Image src={postImg} w={'full'}></Image>}
                    </Box>

                    {/* Actions */}
                    <Flex gap={3} my={1}>
                        <ActionIcons
                            liked={liked}
                            setLiked={() => {
                            setLiked(!liked);
                        }}/>
                    </Flex>

                    {/* Interaction counters */}
                    <DotText leftText={`${replies + (liked ? 1 : 0)} Replies`} rightText={`${likes + (liked ? 1 : 0)} likes`} fontSize={"xs"}/>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost
