import { Container, Form, Button,  Row, Col, FloatingLabel, Image, Tab, Tabs, InputGroup } from "react-bootstrap";

import signUp from '../assets/sign_up.svg';
import mailSent from '../assets/mail.svg';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { FaMagnifyingGlass } from "react-icons/fa6";
import automationFetch from "../axios/config";

const Register = () => {

    const REGISTER_URL = '/users/new'
    const AUTH_KEY = '2123ccb8ca2bc44b390a1e1046a448bf'
    const BASE_URL = 'http://webservice.kinghost.net/web_cep.php'
    
    const [activeTab, setActiveTab] = useState(0)
    const [error, setError] = useState('')
    const [isSearchingCep, setSearchingCep] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const [isRegistering, setRegistering] = useState(false)

    const isFirstTab = activeTab === 0
    const isLastTab = activeTab === 2

    const [basicInfo, setBasicInfo] = useState({
        cpf: '',
        name: '',
        email: '',
        phone: '',
        cadasturCnpj: '',
        expireDate: '',
        tradeName: ''
    })

    const [address, setAddress] = useState({
        cep: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        country: ''
    })

    const [documents, setDocuments] = useState({
        documentPhoto: null,
        identitySelfie: null,
        residenceProof: null,
        cadasturProof: null
    })

    const handleNextTab = () => {
        setActiveTab((prevTab) => (isLastTab ? prevTab : prevTab + 1));
    }

    const handlePrevTab = () => {
        setActiveTab((prevTab) => (isFirstTab ? prevTab : prevTab - 1));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setRegistering(true)
        
        try {
            const requestData = {
                name: basicInfo.name,
                login: "johndoe",
                password: "securepassword123",
                userRole: "USER",
                cpf: basicInfo.cpf,
                email: basicInfo.email,
                phone: basicInfo.phone,
                tradingName: basicInfo.tradeName,
                cnpj: basicInfo.cadasturCnpj,
                documentExpirationDate: basicInfo.expireDate,
                zipCode: address.cep,
                address: address.address,
                number: address.number,
                complement: address.complement,
                city: address.city,
                state: address.state,
                country: address.country,
                registrationStatus: "pending",
                notes: "No additional notes."
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }

            console.log(requestData)

            const response = await automationFetch.post(REGISTER_URL, requestData, config);

            if (response.status === 201) {
                setSuccess(true)
            } else {
                setError('Falha ao incluir Inspeção');
            }

        } catch (error) {
            if (error.response) {
                // Resposta da API com um código de erro (exemplo: 400, 401, 403, etc.)
                if (error.response.status === 400) {
                    // Tratar erro de autenticação (usuário ou senha incorretos)
                    setError('Usuário ou senha incorretos');
                } else if (error.response.status === 403) {
                    // Tratar erro de permissão (usuário não tem permissão)
                    setError('Acesso não autorizado');
                } else {
                    // Outros erros da API
                    setError('Erro na solicitação: ' + error.response.status);
                }
            } else if (error.request) {
                // A solicitação foi feita, mas não houve resposta da API (por exemplo, CORS bloqueado)
                setError('Sem resposta do servidor');
            } else {
                // Erro desconhecido
                setError('Erro desconhecido: ' + error.message);
            }
        }
        setRegistering(false)
    }

    const handleChange = (setter, fieldName, value) => {
        setter(prevState => ({
            ...prevState,
            [fieldName]: value
        }))
    }

    const handleAccept = (setter, fieldName, value) => {
        if (fieldName === 'expireDate' && value.length === 10) {
            const parts = value.split('/')
            const day = parseInt(parts[0], 10)
            const month = parseInt(parts[1], 10) -1
            const year = parseInt(parts[2], 10)
            const date = new Date(year, month, day)
            const mysqlDate = date.toISOString().split('T')[0]
            value = mysqlDate
        }

        setter(prevState => ({
            ...prevState,
            [fieldName]: value
        }))
    }

    const getCepAddress = async (cep) => {
        const urlParameters = `auth=${AUTH_KEY}&formato=json&cep=${cep}`;
        const urlWithParams = `${BASE_URL}?${urlParameters}`;
        setSearchingCep(true)
        try {
            const response = await fetch(urlWithParams);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            if (data.resultado === '0') {
                throw new Error('CEP not found');
            }
            setAddress({
                cep: cep,
                address: data.tipo_logradouro + " " + data.logradouro,
                city: data.cidade,
                state: data.uf,
                country: 'Brasil'
            })
        } catch (error) {
            setError(error.message);
        }
        setSearchingCep(false)
    }
    
    const handleCepButtonClick = () => {
        getCepAddress(address.cep)
    }

    const basicInfoTab = (
        <Tab eventKey={0} title="Informações Básicas" key={0}>
            <Form.Group className="mb-3">
                <FloatingLabel label="CPF">
                <Form.Control
                    as={IMaskInput}
                    mask="000.000.000-00"
                    unmask={true}
                    type="text"
                    name="cpf"
                    autoComplete='off'
                    placeholder="CPF"
                    onAccept={(value) => handleAccept(setBasicInfo, "cpf", value)}
                    required
                />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Nome">
                    <Form.Control
                        type="text"
                        name="name"
                        autoComplete='off'
                        placeholder="Nome"
                        onChange={(e) => handleChange(setBasicInfo, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Email">
                    <Form.Control 
                        type="email"
                        name="email"
                        autoComplete='off'
                        placeholder="Email"
                        onChange={(e) => handleChange(setBasicInfo, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Celular">
                    <Form.Control 
                        as={IMaskInput}
                        mask="(00) 00000-0000"
                        unmask={true}
                        type="text"
                        name="phone"
                        autoComplete='off'
                        placeholder="Celular"
                        onAccept={(value) => handleAccept(setBasicInfo, "phone", value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="CNPJ Cadastur">
                <Form.Control
                    as={IMaskInput}
                    mask="00.000.000/0000-00"
                    unmask={true}
                    type="text"
                    name="cadasturCnpj"
                    autoComplete='off'
                    placeholder="CNPJ"
                    onAccept={(value) => handleAccept(setBasicInfo, "cadasturCnpj", value)}
                    required
                />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Vencimento">
                <Form.Control
                    as={IMaskInput}
                    mask="00/00/0000"
                    unmask={false}
                    type="text"
                    name="expireDate"
                    autoComplete='off'
                    placeholder="Vencimento"
                    onAccept={(value) => handleAccept(setBasicInfo, "expireDate", value)}
                    required
                />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Nome Fantasia Agência">
                <Form.Control
                    type="text"
                    name="tradeName"
                    autoComplete='off'
                    placeholder="Nome Fantasia Agencia"
                    onChange={(e) => handleChange(setBasicInfo, e.target.name, e.target.value)}
                    required
                />
                </FloatingLabel>
            </Form.Group>
        </Tab>
    )

    const addressTab = (
        <Tab eventKey={1} title="Endereço" key={1}>
            <Form.Group className="mb-3">
                <InputGroup>
                    <FloatingLabel label="CEP">
                        <Form.Control
                            as={IMaskInput}
                            mask="00000-000"
                            unmask={true}
                            type="text"
                            name="cep"
                            autoComplete='off'
                            placeholder="CEP"
                            onAccept={(value) => handleAccept(setAddress, "cep", value)}
                            required
                        />
                    </FloatingLabel>
                    <Button
                        variant="outline-secondary"
                        onClick={handleCepButtonClick}
                        disabled={isSearchingCep}
                    >
                      {isSearchingCep ? 'Buscando...' : <FaMagnifyingGlass /> }
                    </Button>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Endereço">
                    <Form.Control
                        type="text"
                        name="address"
                        autoComplete='off'
                        placeholder="Endereço"
                        value={address.address}
                        onChange={(e) => handleChange(setAddress, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Número">
                    <Form.Control
                        as={IMaskInput}
                        mask={Number}
                        type="text"
                        name="number"
                        autoComplete='off'
                        placeholder="Number"
                        onAccept={(value) => handleAccept(setAddress, "number", value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Complemento">
                    <Form.Control
                        type="text"
                        name="complement"
                        autoComplete='off'
                        placeholder="Complemento"
                        onChange={(e) => handleChange(setAddress, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Cidade">
                    <Form.Control
                        type="text"
                        name="city"
                        autoComplete='off'
                        placeholder="Cidade"
                        value={address.city}
                        onChange={(e) => handleChange(setAddress, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Estado">
                    <Form.Control
                        type="text"
                        name="state"
                        autoComplete='off'
                        placeholder="Estado"
                        value={address.state}
                        onChange={(e) => handleChange(setAddress, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="País">
                    <Form.Control
                        type="text"
                        name="country"
                        autoComplete='off'
                        placeholder="País"
                        value={address.country}
                        onChange={(e) => handleChange(setAddress, e.target.name, e.target.value)}
                        required
                    />
                </FloatingLabel>
            </Form.Group>
        </Tab>
    )

    const documentsTab = (
        <Tab eventKey={2} title="Documentos" key={2}>
            <Form.Group className="mb-3">
                <Form.Label>Foto com documento</Form.Label>
                <Form.Control
                    type="file"
                    name="documentPhoto"
                    // onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Selfie com identificação</Form.Label>
                <Form.Control
                    type="file"
                    name="identitySelfie"
                    // onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comprovante de residência</Form.Label>
                <Form.Control
                    type="file"
                    name="residenceProof"
                    // onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comprovante do Cadastur</Form.Label>
                <Form.Control
                    type="file"
                    name="cadasturProof"
                    // onChange={handleChange}
                    required
                />
            </Form.Group>
        </Tab>
    )

    const formTabs = (
        <Tabs
            className="mb-3" 
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(parseInt(k, 10))}
            fill
        >
            {basicInfoTab}
            {addressTab}
            {documentsTab}
        </Tabs>
    )

    useEffect(() => {
        setError('');
    }, [basicInfo, address, activeTab, isSuccess])

    return (
        <>
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Container>
                <p className="text-danger text-center" aria-live="assertive">{error}</p>
                {isSuccess ? (
                    <div>
                        <Row>
                            <div className="text-center"><Image src={mailSent} width={200}/></div>
                        </Row>
                        <Row>
                            <div className="text-center my-5">
                                <div className="fs-5">
                                    Um e-mail foi enviado para <span className="fw-bold text-primary fs-5">{basicInfo.email}</span>, abra-o para dar continuidade com verificação de identidade.
                                </div>
                                <div className="my-3">
                                    <Link to='/login' className="link-secondary">Voltar para a tela de login</Link>
                                </div>
                            </div>
                        </Row>
                    </div>
                ) : (
                    <Row className="align-items-center" xs={1} md={2}>
                        <Col className="py-4">
                            <div className="text-center"><Image src={signUp} width={300}/></div>
                        </Col>
                        <Col>
                            <Form onSubmit={handleSubmit}>
                                {formTabs}
                                <Row className="mb-3" xs={isFirstTab ? 1 : 2}>
                                    <Col>
                                        <Button
                                            className={isFirstTab ? "visually-hidden" : 'w-100'}
                                            variant="secondary"
                                            onClick={handlePrevTab}
                                        >
                                        Anterior
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            type={isLastTab ? 'submit' : 'button'}
                                            className="w-100"
                                            onClick={handleNextTab}
                                            disabled={isRegistering}
                                        >
                                            {isRegistering ?
                                                <span className="spinner-border" role="status"></span> : 
                                                isLastTab ? 'Enviar' : "Próximo" }
                                        </Button>
                                    </Col>
                                </Row>
                                <Link to='/login' className="link-secondary text-decoration-none">Entrar</Link>
                            </Form>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
        </>
    )
}

export default Register