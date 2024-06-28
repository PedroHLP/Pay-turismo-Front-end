import { useState, useEffect } from "react";
import useAutomationFetchPrivate from "../hooks/useAutomationFetchPrivate";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button, InputGroup, Row, Alert, Col } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const FIRST_PWD_URL = "/users/first-password";

const FirstLogin = () => {
    const { auth } = useAuth();

    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [matchPassword, setMatchPassword] = useState("");
    const [isPasswordMatching, setIsPasswordMatching] = useState(false);

    const [isAgreementChecked, setIsAgreementChecked] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const automationFetchPrivate = useAutomationFetchPrivate();

    const navigate = useNavigate();
    const location = useLocation();

    const agreement = (
        <>Eu li e concordo com os <a href="https://payturismo.com.br/termos-de-uso/">Termos de Serviço</a> e a <a href="https://payturismo.com.br/politica-de-privacidade-2/">Política de Privacidade</a>.</>
    )

    useEffect(() => {
        if (!auth.isFirstLogin) {
            navigate('/', { state: { from: location }, replace: true })
        }
    }, [location])

    useEffect(() => {
        const isPwdValid = PWD_REGEX.test(password);
        setIsPasswordValid(isPwdValid);
        
        let isPasswordMatching = matchPassword === password;
        
        if (!isPwdValid) 
            isPasswordMatching = false;
        
        setIsPasswordMatching(isPasswordMatching);
    }, [password, matchPassword])

    useEffect(() => {
        setError("");
    }, [isPasswordValid, isPasswordMatching])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid || !isPasswordMatching || !isAgreementChecked)
            return;

        try {
            const formData = new FormData();
            formData.append("cpf", auth.user);
            formData.append("firstPassword", password);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            };

            const response = await automationFetchPrivate.put(FIRST_PWD_URL, formData, config);

            if (response.status === 200) {
                setSuccess(true);
                navigate('/', { state: { from: location }, replace: true })
            } else {
                setError("Falha ao atualizar a senha");
            }
        } catch (error) {
            if (error.response) {
                console.error('Erro na solicitação:', error);
                setError("Falha ao atualizar a senha");
            } else {
                console.error('Erro na solicitação:', error);
                setError('Sem resposta do servidor');
                navigate('/login', { state: { from: location }, replace: true })
            }
        }
    }

    return (
        <>
        <Container fluid>
            <Row className="justify-content-center">
                <div className="col-md-8 mt-5">
                    <Alert variant="danger" className={`text-center ${error === "" ? "visually-hidden" : ""}`}>
                        {error}
                    </Alert>
                    <div className="shadow-sm p-3 bg-body-tertiary rounded">
                    <p className="text-center text-primary-emphasis">Por favor, atualize sua senha e concorde com os Termos e Condições e a Política de Privacidade.</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="password">Senha:</Form.Label>
                            <InputGroup>
                                <Form.Control type="password" id="password" onChange={(e) => setPassword(e.target.value)} required/>
                                <InputGroup.Text className={isPasswordValid ? "text-success" : "visually-hidden"}>
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
                                <Form.Control type="password" id="confirm" onChange={(e) => setMatchPassword(e.target.value)} required/>
                                <InputGroup.Text className={isPasswordMatching ? "text-success" : "visually-hidden"}>
                                    <FaCheckDouble/>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check 
                                type="checkbox"
                                checked={isAgreementChecked}
                                onChange={(e) => setIsAgreementChecked(e.target.checked)}
                                label={agreement}
                            />
                        </Form.Group>
                        <Button type="submit" className="my-3 w-100" disabled={isPasswordValid && isPasswordMatching && isAgreementChecked? '' : 'disabled'}>
                            Cadastrar
                        </Button>
                    </Form>
                    </div>                    
                </div>
            </Row>
        </Container>
        </>
    )
}

export default FirstLogin