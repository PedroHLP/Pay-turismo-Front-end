import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import { Badge, Col, Form, Row, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import useAutomationFetchPrivate from '../hooks/useAutomationFetchPrivate';
import { formatCnpj } from '../functions/formatUtils';

const USERS_URL = '/users/all';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const automationFetchPrivate = useAutomationFetchPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const getUsers = async () => {
        try {
            const config = {
                showAdmin: false,
            }
            const response = await automationFetchPrivate.get(USERS_URL, config);
            let data = response.data;
    
            setUsers(data);
        } catch (error) {
            console.log(error);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }
    
    useEffect(() => {
        getUsers();
    }, [location]);

    const filteredUsers = users.filter(user => {
        const formattedCnpj = formatCnpj(user.cnpj);
        const unformattedCnpj = user.cnpj && user.cnpj.replace(/[^\d]/g, '');

        if (!searchTerm) {
            return true;
        }

        const nameMatch = user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase());

        const tradingNameMatch = user.tradingName && user.tradingName.toLowerCase().includes(searchTerm.toLowerCase());
    
        const emailMatch = user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
        const cnpjMatch = (
            (user.cnpj && formattedCnpj.includes(searchTerm)) ||
            (user.cnpj && unformattedCnpj.includes(searchTerm))
        );
    
        return nameMatch || tradingNameMatch || emailMatch || cnpjMatch;
    });
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    return (
        <>
            <Header />
            <Container fluid>
                <Row className="justify-content-center">
                    <div className="col-md-11">
                        <div className="shadow-sm p-3 bg-body-tertiary rounded">
                            <Row className="text-center">
                                <Col>
                                    <h3>Usuários</h3>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="mb-3">
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pesquisar... (Nome, Agência, CNPJ, E-mail)"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                {users.length === 0 ? (
                                    <div className="d-flex justify-content-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <Table responsive>
                                        <thead className="text-center">
                                            <tr>
                                                <th>Nome</th>
                                                <th>Agência</th>
                                                <th>CNPJ</th>
                                                <th>E-mail</th>
                                                <th>Data Criação</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.tradingName}</td>
                                                    <td>{user.cnpj ? formatCnpj(user.cnpj) : ''}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('pt-BR') : ''}</td>
                                                    <td className="text-center">
                                                        <Badge bg={getBadgeVariation(user.registrationStatus)}>{getUserStatus(user.registrationStatus)}</Badge>
                                                    </td>
                                                    <td className="text-center">
                                                        <Link to={`/users/${user.id}`} className="link-dark">
                                                            <FaEye />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Row>
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    )
}

// Utility functions to get badge variation and user status
const getBadgeVariation = (registrationStatus) => {
    switch (registrationStatus) {
        case "PENDING":
            return "secondary";
        case "VERIFIED":
            return "warning";
        case "APPROVED":
            return "success";
        case "REJECTED":
            return "danger";
        default:
            return "secondary";
    }
}

const getUserStatus = (registrationStatus) => {
    switch (registrationStatus) {
        case "PENDING":
            return "Identificação Facial";
        case "VERIFIED":
            return "Verificar Documentos";
        case "APPROVED":
            return "OK";
        case "REJECTED":
            return "Negado";
        default:
            return "";
    }
}

export default UserList;
