import {useSessionManager} from "../utils/sessionManager";

export const UseNavBar = () => {
    const sessionManager = useSessionManager();

    const logout = () => sessionManager.logout();

    return { user: sessionManager.currentUser, logout };
};