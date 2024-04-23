// This is used with Recoil React to decide whether our auth page displays login or signup UI.

import { atom } from "recoil";

const authScreenAtom = atom( {
    key: 'authScreenAtom',
    default: "login"
} );

export default authScreenAtom;
