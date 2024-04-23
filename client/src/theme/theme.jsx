import { extendTheme } from '@chakra-ui/react';

const lightTheme = extendTheme({
    colors: {
        primary: '#7FC2C2',
        secondary: '#E1774B',
        tertiary: '#F4DB60',
    },
    config: {
        initialColorMode: 'light',
    },
});

const darkTheme = extendTheme({
    colors: {
        primary: '#000000',
        secondary: '#989C94',
        tertiary: '#C21515',
    },
    config: {
        initialColorMode: 'dark',
    },
});

const purpleTheme = extendTheme({
    colors: {
        primary: '#b00b45',
        secondary: '#800845',
        tertiary: '#567882',
    },
    config: {
        initialColorMode: 'light',
    },
});

export default { lightTheme, darkTheme, purpleTheme };