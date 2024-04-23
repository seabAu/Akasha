import React from 'react';
import SignUp from '../components/Auth/SignUp';
import Login from '../components/Auth/Login';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';

const AuthPage = () =>
{
    // Setter function
    const authScreenState = useRecoilValue( authScreenAtom );
    // const [ value, setValue ] = useState( "login" );
    return (
        <>
            {authScreenState === "login" ? <Login /> : <SignUp />}
        </>
    )
}

export default AuthPage
