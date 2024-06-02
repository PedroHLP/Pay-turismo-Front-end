import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { INSPECTIONS_ADD_PATH } from '../paths';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaEye, FaPencil, FaTrash, FaXmark } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import useAutomationFetchPrivate from '../hooks/useAutomationFetchPrivate';

const INSPECTIONS_URL = '/inspections/all';

const InspectionList = () => {

    const [inspections, setInspections] = useState([]);
    const automationFetchPrivate = useAutomationFetchPrivate();

    const navigate = useNavigate();
    const location = useLocation();

    const getInspections = async () => {
        try {
    
            const response = await automationFetchPrivate.get(INSPECTIONS_URL);
            const data = response.data;
        
            setInspections(data);
    
        } catch (error) {
            console.log(error);
            navigate('/login', { state: { from: location }, replace: true })
        }
    }
    
    useEffect(() => {
        getInspections();
    }, []);

    const actions = (
        <Row className="text-center">
            <Col>
                <Link to={INSPECTIONS_ADD_PATH} className="link-dark">
                    <FaEye />
                </Link>
            </Col>
            <Col>
                <Link to={INSPECTIONS_ADD_PATH} className="link-dark">
                    <FaPencil />
                </Link>
            </Col>
            <Col>
                <Link to={INSPECTIONS_ADD_PATH} className="link-dark">
                    <FaTrash />
                </Link>
            </Col>
        </Row>
    )

    const inspectionsTableRows = inspections.map((inspection) => (
        <tr key={inspection.id} value={inspection.id}>
        <td>{inspection.id}</td>
        <td>{inspection.nome}</td>
        <td>{inspection.id_agendamento}</td>
        <td>{inspection.timeout}</td>
        <td>{inspection.id_escopo}</td>
        <td className="text-center">{inspection.ativa ? (<FaCheck className="text-success"/>) : (<FaXmark className="text-danger"/>)}</td>
        <td>{actions}</td>
        </tr>
    ))

    return (
        <>
        <Header/>
        <Container fluid>
            <Row className="justify-content-center">
                <div className="col-md-11">
                    <div className="px-5 py-3 border border-secondary bg-light">
                        <Row>
                            <Col>
                                <h3>Inspeções</h3>
                            </Col>
                            <Col className="text-end">
                                <Button as={Link} to={INSPECTIONS_ADD_PATH}>Novo</Button>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            {inspectionsTableRows.length === 0 ? (
                                <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                </div>
                            ) : (
                                <Table striped bordered hover>
                                <thead className="text-center">
                                    <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Agendamento</th>
                                    <th>Timeout</th>
                                    <th>Escopo</th>
                                    <th>Ativo</th>
                                    <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspectionsTableRows}
                                </tbody>
                                </Table>
                            )}
                        </Row>
                    </div>
                </div>
            </Row>
        </Container>
        <Footer/>
        </>
    )

}

export default InspectionList