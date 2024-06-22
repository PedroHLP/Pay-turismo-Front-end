import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Badge, Button, Col, Row, Table } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaEye, FaPencil, FaTrash, FaXmark } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import useAutomationFetchPrivate from '../hooks/useAutomationFetchPrivate';
import { IMaskInput } from 'react-imask';

const USERS_URL = '/users/all';

const UserList = () => {

    const [users, setUsers] = useState([]);
    const automationFetchPrivate = useAutomationFetchPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const getUsers = async () => {
        try {
    
            const response = await automationFetchPrivate.get(USERS_URL);
            const data = response.data;
        
            setUsers(data);
    
        } catch (error) {
            console.log(error);
            navigate('/login', { state: { from: location }, replace: true })
        }
    }
    
    useEffect(() => {
        getUsers();
    }, [location]);

    const actions = (
        <Row className="text-center">
            <Col>
                <Link to="#" className="link-dark">
                    <FaEye />
                </Link>
            </Col>
        </Row>
    )

    function formatCnpj(cnpj) {
        if (!cnpj) return '';
    
        const cnpjRegex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
        const formattedCnpj = cnpj.replace(cnpjRegex, '$1.$2.$3/$4-$5');
        return formattedCnpj;
    }

    const usersTableRows = users.map((user) => {
        const formattedCnpj = formatCnpj(user.cnpj);

        const formattedDate = new Date(user.registrationDate).toLocaleDateString('pt-BR');

        let badgeVariation = "", userStatus = "";
        switch (user.registrationStatus){
            case "PENDING":
                badgeVariation = "secondary";
                userStatus = "Identificação Facial";
                break;
            case "VERIFIED":
                badgeVariation = "warning";
                userStatus = "Verificar Documentos";
                break;
            case "APPROVED":
                badgeVariation = "success";
                userStatus = "OK";
                break;
            case "REJECTED":
                badgeVariation = "danger";
                userStatus = "Negado";
                break;
        }
    
        return (
            <tr key={user.id} value={user.id}>
                <td>{user.name}</td>
                <td>{user.tradingName}</td>
                <td>{formattedCnpj}</td>
                <td>{user.email}</td>
                <td>{formattedDate}</td>
                <td className="text-center"><Badge bg={badgeVariation}>{userStatus}</Badge></td>
                <td>{actions}</td>
            </tr>
        );
    });

    return (
        <>
        <Header/>
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
                        <Row>
                            {usersTableRows.length === 0 ? (
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
                                    {usersTableRows}
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

export default UserList