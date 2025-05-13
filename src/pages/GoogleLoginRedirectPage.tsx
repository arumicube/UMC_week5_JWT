import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const GoogleLoginRedirectPage = () => {
    const { setItem: setAccessToken } = useLocalStorage("accessToken");
    const { setItem: setRefreshToken } = useLocalStorage("refreshToken");
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");

        if (accessToken) {
            setAccessToken(accessToken);   
            setRefreshToken(refreshToken || "");
            navigate("/my"); 
        }
    }, []);

    return <div />;
};
export default GoogleLoginRedirectPage;