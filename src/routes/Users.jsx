import { useState, useEffect } from "react";
import useAutomationFetchPrivate from "../hooks/useAutomationFetchPrivate";

import axios from "axios";

import { useNavigate, useLocation } from "react-router-dom";


const Users = () => {
    const [users, setUsers] = useState();
    const USERS_URL = '/users/all';
    const automationFetchPrivate = useAutomationFetchPrivate();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {

                const config = {
                    // headers: {
                    //     Authorization: `Bearer ${auth.accessToken}`,
                    //     "Content-Type": "application/json",
                    // },
                    signal: controller.signal,
                    withCredentials: true
                };

                const response = await automationFetchPrivate.get(USERS_URL, config); // o cabecalho ja esta sendo tratado em useAutomationFetchPrivate

                //console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                if(err instanceof axios.Cancel){
                    console.error(err); // capturar erro de controller.abort();
                } else {
                    navigate('/login', { state: { from: location }, replace: true })
                }
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }

    }, [])

    return (
        <article>
            <h2>Lista de Usuários</h2>
            {users?.length ? (
                <ul>
                    {users.map((userData, i) => (
                        <li key={i}>
                            <strong>ID:</strong> {i + 1}<br />
                            <strong>Login:</strong> {userData.user.login}<br />
                            <strong>Role:</strong> {userData.user.role}<br />
                            {/* Outros campos do usuário aqui */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Não há usuários para exibir</p>
            )}
            <br />
        </article>
    );

};

export default Users