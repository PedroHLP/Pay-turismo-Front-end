import { Container, Form, Button,  Row, Col, FloatingLabel, Image, Tab, Tabs } from "react-bootstrap";

import image from '../assets/sign_up.svg';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users/register';


const Register = () => {
    const [activeTab, setActiveTab] = useState(0); // Estado para gerenciar a aba ativa

    const isFirstTab = activeTab === 0;
    const isLastTab = activeTab === 2;

    const handleNextTab = () => {
        setActiveTab((prevTab) => (isLastTab ? prevTab : prevTab + 1));
    }

    const handlePrevTab = () => {
        setActiveTab((prevTab) => (isFirstTab ? prevTab : prevTab - 1));
    }
    

    const basicInfoTab = (
        <Tab eventKey={0} title="Informações Básicas" key={0}>
            <Form.Group className="mb-3">
            <FloatingLabel label="CPF">
            <Form.Control
                as={IMaskInput}
                mask="000.000.000-00"
                unmask={true} // Remover a máscara do valor
                type="text"
                id="cpf"
                autoComplete='off'
                placeholder="CPF"
                // DO NOT USE onChange TO HANDLE CHANGES!
                // USE onAccept INSTEAD
                onAccept={
                    (value) => console.log(value)
                }
                required
            />
            </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Nome">
                    <Form.Control type="text" id="username" autoComplete='off'
                    placeholder="Nome" required/>
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Email">
                    <Form.Control 
                        type="email"
                        id="email"
                        autoComplete='off'
                        placeholder="Email"
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Celular">
                    <Form.Control 
                        as={IMaskInput}
                        mask="(00) 00000-0000"
                        unmask={true} // Remover a máscara do valor
                        type="text"
                        id="phone"
                        autoComplete='off'
                        placeholder="Celular"
                        // DO NOT USE onChange TO HANDLE CHANGES!
                        // USE onAccept INSTEAD
                        onAccept={
                            (value) => console.log(value)
                        }
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
                    id="cnpj"
                    autoComplete='off'
                    placeholder="CNPJ"
                    // DO NOT USE onChange TO HANDLE CHANGES!
                    // USE onAccept INSTEAD
                    onAccept={
                        (value) => console.log(value)
                    }
                    required
                />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Vencimento">
                <Form.Control
                    as={IMaskInput}
                    mask="00/00/0000"
                    unmask={false} // Manter a máscara no valor
                    type="text"
                    id="expiration"
                    autoComplete='off'
                    placeholder="Vencimento"
                    // DO NOT USE onChange TO HANDLE CHANGES!
                    // USE onAccept INSTEAD
                    onAccept={
                        (value) => console.log(value)
                    }
                    required
                />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Nome Fantasia Agência">
                <Form.Control
                    type="text"
                    id="trade-name"
                    autoComplete='off'
                    placeholder="Nome Fantasia Agencia"
                    required
                />
                </FloatingLabel>
            </Form.Group>
        </Tab>
    )

    const addressTab = (
        <Tab eventKey={1} title="Endereço" key={1}>
            <Form.Group className="mb-3">
                <FloatingLabel label="CEP">
                    <Form.Control 
                        as={IMaskInput}
                        mask="00000-000"
                        unmask={true}
                        type="text"
                        id="cep"
                        autoComplete='off'
                        placeholder="CEP"
                        // DO NOT USE onChange TO HANDLE CHANGES!
                        // USE onAccept INSTEAD
                        onAccept={
                            (value) => console.log(value)
                        }
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Endereço">
                    <Form.Control
                        type="text"
                        id="address"
                        autoComplete='off'
                        placeholder="Endereço"
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
                        id="number"
                        autoComplete='off'
                        placeholder="Number"
                        // DO NOT USE onChange TO HANDLE CHANGES!
                        // USE onAccept INSTEAD
                        onAccept={
                            (value) => console.log(value)
                        }
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Complemento">
                    <Form.Control
                        type="text"
                        id="complement"
                        autoComplete='off'
                        placeholder="Complemento"
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Cidade">
                    <Form.Control
                        type="text"
                        id="city"
                        autoComplete='off'
                        placeholder="Cidade"
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="Estado">
                    <Form.Control
                        type="text"
                        id="state"
                        autoComplete='off'
                        placeholder="Estado"
                        required
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel label="País">
                    <Form.Control
                        type="text"
                        id="country"
                        autoComplete='off'
                        placeholder="País"
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
                    id="document-photo"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Selfie com identificação</Form.Label>
                <Form.Control
                    type="file"
                    id="selfie"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comprovante de residência</Form.Label>
                <Form.Control
                    type="file"
                    id="residence-proof"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comprovante do Cadastur</Form.Label>
                <Form.Control
                    type="file"
                    id="cadastur-proof"
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

    const handleSubmit = async (e) => {
        console.log("Heyyyy")
    }

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