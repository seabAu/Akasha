import { Box, Flex } from '@chakra-ui/react';
import React from 'react'

const Content = ({children}) => {
	return (
        <Flex
            w={ "100%" }
            alignItems={ 'flex-start' }
            overflow={ 'auto' }
            h={ "100%" }
        >
            <Box flexGrow={ 1 }
                w={ "100%" }
                h={ "100%" }
                maxH={ 'full' }
                minH={ '100%' }
                overflow={ 'auto' }
            >
                {children}
			</Box>
		</Flex>
	);
}

export default Content
