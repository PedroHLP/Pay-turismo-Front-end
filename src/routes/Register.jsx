import { Container, Form, Button,  Row, Col, FloatingLabel, Image, Tab, Tabs, InputGroup } from "react-bootstrap";

import image from '../assets/sign_up.svg';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Register = () => {

    const AUTH_KEY = '2123ccb8ca2bc44b390a1e1046a448bf';
    const BASE_URL = 'http://webservice.kinghost.net/web_cep.php';

    const [error, setError] = useState(null)
    const [isSearching, setSearching] = useState(false)

    const [basicInfo, setBasicInfo] = useState({
        cpf: '',
        name: '',
        email: '',
        phone: '',
        cnpjCadastur: '',
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
    });

    const [activeTab, setActiveTab] = useState(0); // Estado para gerenciar a aba ativa

    const isFirstTab = activeTab === 0;
    const isLastTab = activeTab === 2;

    const handleNextTab = () => {
        setActiveTab((prevTab) => (isLastTab ? prevTab : prevTab + 1));
    }

    const handlePrevTab = () => {
        setActiveTab((prevTab) => (isFirstTab ? prevTab : prevTab - 1));
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    const handleChange = (setter, fieldName, value) => {
        setter(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const handleAccept = (setter, fieldName, value) => {
        setter(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const getCepAddress = async (cep) => {
        const urlParameters = `auth=${AUTH_KEY}&formato=json&cep=${cep}`;
        const urlWithParams = `${BASE_URL}?${urlParameters}`;
        setSearching(true)
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
        setSearching(false)
    }
    
    const handleButtonClick = () => {
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
                        onClick={handleButtonClick}
                        disabled={isSearching}
                    >
                      {isSearching ? 'Buscando...' : <FaMagnifyingGlass /> }
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

    return (
        <>
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Container>
                <Row className="align-items-center" xs={1} md={2}>
                    <Col className="py-4">
                        <div className="text-center"><Image src={image} width={300}/></div>
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
                                    >
                                        {isLastTab ? 'Enviar' : 'Próximo'}
                                    </Button>
                                </Col>
                            </Row>
                            <Link to='/login' className="link-secondary text-decoration-none">Entrar</Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
        </>
    )
}

export default Register