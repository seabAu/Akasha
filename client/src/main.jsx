import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import {ChakraProvider, ColorModeScript, extendTheme} from '@chakra-ui/react'
import {mode} from '@chakra-ui/theme-tools'

import App from './App.jsx'

import './index.css'
import {RecoilRoot} from 'recoil';
import { SocketContextProvider } from './context/SocketContext.jsx';

// Set styling based on dark/light mode.
const styles = {
    global: (props) => ({
        body: {
            // Each one is a linear list for each color mode.
            color: mode('gray.800', 'whiteAlpha.900', '#800845')(props),
            bg: mode('gray.100', '#101010', '#800845')(props)
        }
    })
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true
};

const colors = {
    gray: {
        light: '#616161',
        dark: '#1e1e1e',
        purple: '#800845'
    }
}

const theme = extendTheme({config, styles, colors});

// 3. Pass the `theme` prop to the `ChakraProvider`
ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        // Note: React.StrictMode renders every component twice while in development mode.
        <React.StrictMode>
            <RecoilRoot>
                <Router>
                    <ChakraProvider theme={theme}>
                        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
                        <SocketContextProvider>
                            <App/>
                        </SocketContextProvider>
                    </ChakraProvider>
                </Router>
            </RecoilRoot>
        </React.StrictMode>
    );