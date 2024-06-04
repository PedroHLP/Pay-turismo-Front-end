import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { FaCheck, FaCheckCircle, FaCheckDouble } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Container, Form, Button, InputGroup, Row } from "react-bootstrap";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/automations/register';


const Register = () => {
    const errRef = useRef();

    const { auth } = useAuth();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // checa se o usuário é valido toda vez que o valor de user altera
    useEffect(() => {
        const isUserValid = USER_REGEX.test(user);
        setValidName(isUserValid);
    }, [user])

    // valida as senhas
    useEffect(() => {
        const isPasswordValid = PWD_REGEX.test(pwd);
        setValidPwd(isPasswordValid);
        
        let isPasswordMatching = matchPwd === pwd;
        
        if (!isPasswordValid) 
            isPasswordMatching = false;
        
        setValidMatch(isPasswordMatching);
    }, [pwd, matchPwd])

    // limpa a mensagem de erro ao enviar form se validar uma das condições
    useEffect(() => {
        setErrMsg('');
    }, [validName, validPwd, validMatch])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // por mais que o botão esteja bloqueado, verificar se tudo bate
        if (!validName || !validPwd || !validMatch)
            return;

        setSuccess(true);
    }

    return (
        <>
        <Container fluid>
            <Row className="justify-content-center">
                <div className="col-md-8">
                    <div className="px-5 py-3 border border-secondary bg-light">
                        {success ? (
                            <div className="text-center text-success">
                                <FaCheckCircle size={50}/>
                                <h5 className="mt-2">Cadastro realizado com sucesso!</h5>
                            </div>
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                <div className="text-center">
                                    <h3>Novo usuário</h3>
                                    <hr/>
                                </div>
                                <p className="text-center text-danger" aria-live="assertive">{errMsg}</p>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="user">Usuário:</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="text" id="name" onChange={(e) => setUser(e.target.value)} required/>
                                        <InputGroup.Text className={validName ? "text-success" : "visually-hidden"}>
                                            <FaCheck/>
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <Form.Text>
                                        Deve conter 4 a 24 caracteres, começar com uma letra, podendo conter letras, números, underscores e/ou ífens. Não pode conter caracteres especiais.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="password">Senha:</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="password" id="password" onChange={(e) => setPwd(e.target.value)} required/>
                                        <InputGroup.Text className={validPwd ? "text-success" : "visually-hidden"}>
                                            <FaCheck/>
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <Form.Text>
                                        Deve conter de 8 a 24 caracteres, letras maiúsculas e minúsculas, um número e um caracter especial ao menos.<br />
                                        Caracteres especiais permitidos:
                                        <span className="ms-1">!</span>
                                        <span className="ms-1">@</span>
                                        <span className="ms-1">#</span>
                                        <span className="ms-1">$</span>
                                        <span className="ms-1">%</span>
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="confirm">Confirme a senha:</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="password" id="confirm" onChange={(e) => setMatchPwd(e.target.value)} required/>
                                        <InputGroup.Text className={validMatch ? "text-success" : "visually-hidden"}>
                                            <FaCheckDouble/>
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Button type="submit" className="my-3 w-100" disabled={validName && validPwd && validMatch ? '' : 'disabled'}>Cadastrar</Button>
                            </Form>
                        )}
                    </div>
                </div>
            </Row>
        </Container>
        </>
    )
}

export default Register