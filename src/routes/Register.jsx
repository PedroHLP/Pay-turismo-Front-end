import { Container, Form, Button,  Row, Col, FloatingLabel, Image, Tab, Tabs } from "react-bootstrap";

import image from '../assets/sign_up.svg';
import { Link } from "react-router-dom";
import { useState } from "react";
import InputMask from 'react-input-mask';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users/register';


const Register = () => {
    const [activeTab, setActiveTab] = useState(0); // Estado para gerenciar a aba ativa

    const handleNextTab = () => {
        setActiveTab((prevTab) => (prevTab === 2 ? 0 : prevTab + 1));
    }

    const handlePrevTab = () => {
        setActiveTab((prevTab) => (prevTab === 0 ? 2 - 1 : prevTab - 1));
    }

    const basicInfoTab = (
        <Tab eventKey='0' title="Informações Básicas" key='0' disabled>
            <Form.Group className="mb-3">
                <FloatingLabel label="CPF">
                <Form.Control
                    as={InputMask}
                    mask="999.999.999-99"
                    type="text"
                    id="cpf"
                    autoComplete='off'
                    placeholder="CPF"
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
                        as={InputMask}
                        mask="(99) 99999-9999"
                        type="text"
                        id="phone"
                        autoComplete='off'
                        placeholder="Celular"
                        required
                    />
                </FloatingLabel>
            </Form.Group>
        </Tab>
    )

    const addressTab = (
        <Tab eventKey='1' title="Endereço" key='1' disabled>
            <Form.Group className="mb-3">
                <FloatingLabel label="CEP">
                    <Form.Control 
                        as={InputMask}
                        mask="99999-999"
                        type="text"
                        id="cep"
                        autoComplete='off'
                        placeholder="CEP"
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
                    <Form.Control type="number" id="number" autoComplete='off'
                    placeholder="Number" required/>
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
        <Tab eventKey='2' title="Documentos" key='2' disabled>
            <Form.Group className="mb-3">
                <Form.Label>Foto com documento</Form.Label>
                <Form.Control
                    type="file"
                    id="documentPhoto"
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
                    id="residenceProof"
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Comprovante do Cadastur</Form.Label>
                <Form.Control
                    type="file"
                    id="cadasturProof"
                    required
                />
            </Form.Group>
        </Tab>
    )

    const formTabs = (
        <Tabs className="mb-3" activeKey={activeTab} fill>
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
                        <Form>
                            {formTabs}
                            <Row className="mb-3" xs={activeTab === 0 ? 1 : 2}>
                                <Col>
                                    <Button
                                        className={activeTab === 0 ? "visually-hidden" : 'w-100'}
                                        variant="secondary"
                                        onClick={handlePrevTab}
                                    >
                                    Anterior
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type={activeTab === 2 ? 'submit' : 'button'}
                                        className="w-100"
                                        onClick={handleNextTab}
                                    >
                                    {activeTab === 2 ? 'Enviar' : 'Próximo'}
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