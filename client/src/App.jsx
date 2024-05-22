import { useEffect, useState } from 'react'
import { Box, Button, Container } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom.js';

// PAGES
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UpdateProfilePage from './pages/UpdateProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ActivityPage from './pages/ActivityPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UserStoragePage from './pages/UserStoragePage.jsx';

// COMPONENTS
// import Logout from './components/Auth/Logout.jsx';
// import Header from './components/Page/Header';
// import Sidebar from './components/Page/Sidebar.jsx';
import Nav from './components/Page/Nav.jsx';

// STYLES
import './App.css'

// HOOKS
import useShowToast from './hooks/useShowToast.js';
import useAuth from './hooks/useAuth.js';

function App ()
{
    // See if we have a user stored in localStorage.
    const user = useRecoilValue( userAtom );
    const [ currentUser, setCurrentUser ] = useRecoilState( userAtom );
    const showToast = useShowToast();
    const { pathname } = useLocation();
    const { handleLogout } = useAuth();
    // console.log( "App.jsx -> pathname: ", pathname );

    // Check if the saved session token is still valid. If it isn't, or there isn't one, delete cookies and perform a full logout. 
    const auth = async () =>
    {
        console.log( "Auth in app.jsx :: ", user, user.token );
        if ( user )
        {
            if ( user.token )
            {
                // We have a token stored.
                try
                {
                    // Fetch request
                    const res = await fetch( "/api/users/auth", {
                        method: "GET",
                        headers: {
                            "x-auth-token": user.token,
                            "Content-Type": "application/json"
                        }
                    } );
    
                    console.log( "Auth response: ", res );

                    const data = await res.json();
                    console.log( "Auth :: data = ", data );
        
                    if ( data.error )
                    {
                        // Error
                        showToast( "Error", data.error, "error" );
                        console.log( "Error in auth: ", data.error );
                    } else
                    {
                        // Success
                        showToast( "Success", data.message, "success" );
        
                        const user = data.user;
        
                        // Set current user info. On success, we receive back the active user's details.
                        console.log( "Auth :: user = ", user );
        
                        // Save to localStorage.
                        // localStorage.setItem( "user", JSON.stringify( user ) );
        
                        // Update state.
                        // setCurrentUser( user );
                    }
        
                } catch ( error )
                {
                    console.error( "Error in AuthToken: ", error );
                } finally
                {
                    // setLoading( false );
                }
            }
            else
            {
                // No token stored, wipe the saved data (likely stale)
                console.log( "Auth in app.jsx :: no token stored :: ", user );

                // Remove user.
                localStorage.removeItem( "user" );

                // Set state.
                setCurrentUser( null );
            }
        }
    }

    useEffect(() => {
        // Run stored token through auth checks and make sure access is confirmed.
        auth();
        console.log( "App.js :: User data = ", user );
    }, [user]);

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
