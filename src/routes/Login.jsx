import { useRef, useState, useEffect } from 'react';
import automationFetch from '../axios/config.js'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import useAuth from '../hooks/useAuth.jsx';

import logo from '../assets/login.svg';
import { Alert, Col, FloatingLabel, Row } from 'react-bootstrap';
import { REGISTER_PATH } from '../paths.jsx';


const LOGIN_URL = '/users/login'

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            const userCpf = response?.data?.cpf;
            const isFirstLogin = response?.data?.firstLogin;
            const changePassword = response?.data?.changePassword;

            setAuth({ user, pwd, roles, accessToken, refreshToken, userCpf, isFirstLogin, changePassword });
            setUser('');
            setPwd('');

            if (isFirstLogin) {
                from = "/first_login";
            }

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
        setLoading(false);
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Container>
                <Alert ref={errRef} variant="danger"
                className={`text-center ${errMsg === "" ? "visually-hidden" : ""}`}>
                    {errMsg}
                </Alert>
                <Row className="align-items-center" xs={1} md={2}>
                    <Col className="py-4 d-none d-sm-block">
                        <div className="text-center"><Image src={logo} fluid/></div>
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
                            <Button
                             type="submit"
                             className="mb-3 w-100"
                             disabled={isLoading}>
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </Form>
                        <Row xs={2}>
                            <Col sm={7}>
                                <Link to='/recovery' className="link-secondary text-decoration-none">Esqueci minha senha</Link>
                            </Col>
                            <Col className="text-end" sm={5}>
                                <Link to={REGISTER_PATH} className="link-primary text-decoration-none">Cadastrar-se</Link>
                            </Col>
                        </Row>


                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <p className="text-center text-muted">Ao clicar em continuar,  você concorda com nossos <a href="https://payturismo.com.br/termos-de-uso/">Termos de Serviço</a> e <a href="https://payturismo.com.br/politica-de-privacidade-2/">Política de Privacidade</a>.</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login