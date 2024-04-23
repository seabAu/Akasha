import { atom } from "recoil";

// Fetch whatever user we have in localstorage.
const userAtom = atom( {
    key: 'userAtom',
    default: JSON.parse( localStorage.getItem( 'user' ) )
} );

export default userAtom;
