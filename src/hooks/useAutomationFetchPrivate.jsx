import { automationFetchPrivate } from "../axios/config";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAutomationFetchPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    // ===== Validacao token expirado sem consultar backend 11-10-2023
    const token = auth.accessToken; // Substitua pelo seu token JWT
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
    // Verifique se o token expirou
    const tokenExpirationTime = decodedToken.exp * 1000; // A data de expiração é em segundos, então multiplicamos por 1000 para obter milissegundos
    const currentTime = Date.now(); // Obtém a hora atual em milissegundos    
    // =================================

    useEffect(() => {

        const requestIntercept = automationFetchPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = automationFetchPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                //console.log(error?.response?.status)
                const prevRequest = error?.config;
                if (error?.response?.status === undefined && !prevRequest?.sent) { // bloqueado pelo CORS ou sem comunicacao
                    // testa se o token expirou comparando com a data atual
                    if (tokenExpirationTime < currentTime) {
                        //console.log("O token JWT expirou.");
                        prevRequest.sent = true;
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return automationFetchPrivate(prevRequest);
                    } else {
                        //console.log("O token JWT ainda é válido.");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            automationFetchPrivate.interceptors.request.eject(requestIntercept);
            automationFetchPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return automationFetchPrivate;
}

export default useAutomationFetchPrivate;