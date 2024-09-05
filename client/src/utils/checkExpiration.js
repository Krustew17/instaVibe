import { jwtDecode } from "jwt-decode";

export default function checkTokenExpirationNow(
    token,
    setSessionExpiredVisible,
    dispatch,
    logoutAction
) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
        setSessionExpiredVisible(true);
        dispatch(logoutAction());
        return true;
    }

    return false;
}
