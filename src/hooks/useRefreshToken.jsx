import automationFetch from "../axios/config";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const REFRESH_URL = '/users/refresh';

    const { setAuth } = useAuth();
    const { auth } = useAuth();

    const refresh = async () => {

        const config = {
            params: {
                refreshToken: auth.refreshToken,
            },
            headers: {
                Authorization: `Bearer ${auth.refreshToken}`, 
            },
            withCredentials: true, 
        };

        try {
            const response = await automationFetch.get(REFRESH_URL, config);
            setAuth(prev => {
                //console.log("Token Anterior" + JSON.stringify(prev));
                //console.log("Novo Token" + response.data.refreshToken);
                return { ...prev, accessToken: response.data.refreshToken }
            });
            return response.data.refreshToken;

        } catch (error) {
            console.log(error);
        }
    }
    return refresh;
}

export default useRefreshToken;


