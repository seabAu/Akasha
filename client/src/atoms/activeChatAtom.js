import { atom } from "recoil";

const activeChatAtom = atom( {
    key: 'activeChatAtom',
    default: []
} );

export default activeChatAtom;
