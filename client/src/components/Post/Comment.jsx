import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import ActionIcons from '../Page/ActionIcons';
import { BsThreeDots } from 'react-icons/bs';
import DotText from '../DotText';

const Comment = ( { reply, lastReply } ) =>
{
    // console.log( "Comment: reply = ", reply );
    return (
        <>
            {
                reply && (

                    <Flex gap={ 4 } py={ 2 } my={ 2 } w={ "full" }>

                        <Avatar size={ "md" } name={ `${ reply.username }` } src={ `${ reply?.userAvatar }` } />

                        <Flex gap={ 1 } w={ "full" } flexDirection={ "column" }>

                            <Flex w={ "full" } justifyContent={ 'space-between' } alignItems={ "center" }>

                                <Text fontSize={ 'sm' } fontWeight={ 'bold' }>{ reply.username }</Text>

                                <Flex gap={ 2 } alignItems={ "center" }>
                                    <Text fontSize={ "sm" } color={ "gray.light" }>{ `${ reply?.createdAt }` }</Text>
                                    <Box className='hover-dark'>
                                        <BsThreeDots />
                                    </Box>
                                </Flex>

                            </Flex>

                            <Text>{ reply.text }</Text>

                            <Flex flexDirection={ {
                                base: 'column',
                                sm: 'row',
                            } } justifyContent={ 'space-between' } >

                                <ActionIcons />

                            </Flex>
                        </Flex>

                    </Flex>

                )
            }
            { !lastReply ? <Divider mt={ 4 } /> : null }
        </>
    )
}

export default Comment
