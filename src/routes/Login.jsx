import { useRef, useState, useEffect } from 'react';
import automationFetch from '../axios/config.js'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import useAuth from '../hooks/useAuth.jsx';

import logo from '../assets/logo.webp';


const LOGIN_URL = '/automations/login'

const Login = () => {
    const { setAuth } = useAuth();  // Setar valor para Context 07Nov23 

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    //const [success, setSuccess] = useState(false); // 08-11-2023

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

            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));


            const accessToken = response?.data?.token;
            const roles = response?.data?.role;
            const refreshToken = response?.data?.refreshToken;

            setAuth({ user, pwd, roles, accessToken, refreshToken })
            setUser('');
            setPwd('');
            //setSuccess(true); // 08-11-2023

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
        <Container className="mt-5">
            <div className="row d-flex justify-content-center">
                <div className="col-md-6">
                    <div className="px-5 py-5 border border-dark bg-light">
                        <div className="text-center"><Image src={logo} width={225}/></div>
                        
                        <p ref={errRef} className="text-danger text-center" aria-live="assertive">{errMsg}</p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="username">Usuário:</Form.Label>
                                <Form.Control type="text" id="username" ref={userRef} autoComplete='off'
                                onChange={(e) => setUser(e.target.value)} value={user} required/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="password">Senha:</Form.Label>
                                <Form.Control type="password" id="password" 
                                onChange={(e) => setPwd(e.target.value)} value={pwd} required/>
                            </Form.Group>
                            <Button type="submit" className="mb-4 w-100">Logar</Button>
                        </Form>
                        <Link to='/recovery' className="text-secondary">Esqueci minha senha</Link>
                    </div>
                </div>
            </div>
        </Container>
        
        // <section className='section_login'>

        //     <img src={logo} alt="logo_login" className='logo_login' />

        //     <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        //     <h3>Login</h3>
        //     <form className='form_login' onSubmit={handleSubmit}>
        //         <label className='label_login' htmlFor="username">Usuário:</label>
        //         <input className='input_login'
        //             type="text"
        //             id="username"
        //             ref={userRef}
        //             autoComplete='off'
        //             onChange={(e) => setUser(e.target.value)}
        //             value={user}
        //             required
        //         />

        //         <label className='label_login' htmlFor="password">Senha:</label>
        //         <input className='input_login'
        //             type="password"
        //             id="password"
        //             onChange={(e) => setPwd(e.target.value)}
        //             value={pwd}
        //             required
        //         />
        //         <button className='button_login'>Logar</button>
        //         <p>
        //             <br />
        //             <span className="line">
        //                 <Link to='/recovery'>Esqueci minnha senha</Link>
        //             </span>
        //         </p>
        //     </form>
        // </section>
    )
}

export default Login