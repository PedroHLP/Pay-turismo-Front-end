import { useRef, useState, useEffect } from 'react';
import automationFetch from '../axios/config.js'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import useAuth from '../hooks/useAuth.jsx';

import logo from '../assets/login.svg';
import { Col, FloatingLabel, Row } from 'react-bootstrap';


const LOGIN_URL = '/automations/login'

const Login = () => {
    const { setAuth } = useAuth(); 

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                login: user,
                password: pwd,
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            };

            const response = await automationFetch.post(LOGIN_URL, requestData, config);
            const accessToken = response?.data?.token;
            const roles = response?.data?.role;
            const refreshToken = response?.data?.refreshToken;

            setAuth({ user, pwd, roles, accessToken, refreshToken })
            setUser('');
            setPwd('');

            navigate(from, { replace: true });

        } catch (error) {
            if (error.response) {
                // Resposta da API com um código de erro (exemplo: 400, 401, 403, etc.)
                if (error.response.status === 400) {
                    // Tratar erro de autenticação (usuário ou senha incorretos)
                    setErrMsg('Usuário ou senha incorretos');
                } else if (error.response.status === 403) {
                    // Tratar erro de permissão (usuário não tem permissão)
                    setErrMsg('Acesso não autorizado');
                } else {
                    // Outros erros da API
                    setErrMsg('Erro na solicitação: ' + error.response.status);
                }
            } else if (error.request) {
                // A solicitação foi feita, mas não houve resposta da API (por exemplo, CORS bloqueado)
                setErrMsg('Sem resposta do servidor');
            } else {
                // Erro desconhecido
                setErrMsg('Erro desconhecido: ' + error.message);
            }

            errRef.current.focus();
        }
    }


    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Container>
                <p ref={errRef} className="text-danger text-center" aria-live="assertive">{errMsg}</p>
                <Row className="align-items-center" xs={1} md={2}>
                    <Col className="py-4">
                        <div className="text-center"><Image src={logo} width={300}/></div>
                    </Col>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Usuário">
                                    <Form.Control type="text" id="username" ref={userRef} autoComplete='off'
                                    placeholder="Usuário" onChange={(e) => setUser(e.target.value)} required/>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Senha">
                                    <Form.Control type="password" id="password" placeholder="Senha" 
                                    onChange={(e) => setPwd(e.target.value)} required/>
                                </FloatingLabel>
                            </Form.Group>
                            <Button type="submit" className="mb-3 w-100">Entrar</Button>
                        </Form>
                        <Link to='/recovery' className="text-secondary">Esqueci minha senha</Link>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login