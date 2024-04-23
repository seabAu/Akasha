import { useState } from 'react'
import { Box, Button, Container } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom.js';

// PAGES
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UpdateProfilePage from './pages/UpdateProfilePage.jsx';

// COMPONENTS
import Logout from './components/Auth/Logout.jsx';
import Header from './components/Page/Header';

// DATA
import posts from './demoposts.js';

// STYLES
import './App.css'
import ChatPage from './pages/ChatPage.jsx';
import Nav from './components/Page/Nav.jsx';
import Sidebar from './components/Page/Sidebar.jsx';
import ActivityPage from './pages/ActivityPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UserStoragePage from './pages/UserStoragePage.jsx';

function App ()
{
    // See if we have a user stored in localStorage.
    const user = useRecoilValue( userAtom );
    const { pathname } = useLocation();
    // console.log( "App.jsx -> pathname: ", pathname );

    return (
            <Nav maxW={ pathname === '/' ? '100vw' : '100vw' } maxH={ '100vh' } h={ "100vh" } position={'absolute'}>
                <Routes>
                    <Route path="*" component={HomePage} />
                    <Route
                        path='/'
                        element={ user
                            ? <HomePage />
                            : <Navigate to="/auth" /> } />

                    <Route
                        path='/auth'
                        element={ ( !user )
                            ? <AuthPage />
                            : <Navigate to="/" /> } />

                    <Route
                        path='/activity'
                        element={ user
                            ? <ActivityPage />
                            : <Navigate to='/auth' /> } />

                    <Route
                        path='/bookmarks'
                        element={ user
                            ? <UserStoragePage />
                            : <Navigate to='/auth' /> } />

                    <Route
                        path='/notifications'
                        element={ user
                            ? <NotificationsPage />
                            : <Navigate to='/auth' /> } />

                            <Route
                                path='/explore'
                                element={ user
                                    ? <ExplorePage />
                                    : <Navigate to='/auth' /> } />


                    <Route
                        path='/update'
                        element={ user
                            ? <UpdateProfilePage />
                            : <Navigate to='/auth' /> } />
        
                    <Route
                        path='/settings'
                        element={ user
                            ? <SettingsPage />
                            : <Navigate to='/auth' /> } />
        
                    <Route path="/u/:username" element={ < UserPage /> } />
                    <Route path="/u/:username/t/:pid" element={ < PostPage /> } exact />

                    <Route
                        path="/chat"
                        element={ user
                            ? <ChatPage />
                            : <Navigate to={ "/auth" } /> }
                        exact />
                </Routes>

            </Nav>
    )
}

export default App
