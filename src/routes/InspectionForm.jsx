import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRef, useState } from 'react';
import useAutomationFetchPrivate from "../hooks/useAutomationFetchPrivate";
import { InputGroup, Row, Col, ListGroup, Tooltip, OverlayTrigger, Accordion } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";

const INSPECTIONS_URL = '/inspections/new';

const InspectionForm = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [folder, setFolder] = useState('');
    const [schedule, setSchedule] = useState(0);
    const [multiple, setMultiple] = useState(0);
    const [agent, setAgent] = useState(0);
    const [collection, setCollection] = useState(0);    
    const [timeout, setTimeout] = useState('');
    const [active, setActive] = useState(true);
    const [selectedScopes, setSelectedScopes] = useState([]);

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');

    const automationFetchPrivate = useAutomationFetchPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [success, setSuccess] = useState(false);

    const renderTimeoutTooltip = (props) => (
        <Tooltip id="timeout-tooltip" {...props}>
          O tempo que a inspeção terá até responder 
          com sucesso antes de dar um alerta/erro. Em microsegundos
        </Tooltip>
      );

    // abaixo é um trigger para remover todos caracteres nao numericos
    const handleChange = event => {
        const result = event.target.value.replace(/\D/g, '');

        setTimeout(result);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                "nome": name,
                "descricao": description,
                "pastaExecucao": folder,
                "idEscopo": 0,
                "idAgendamento": schedule,
                "multiplaExecucao": multiple,
                "idAgent": agent,
                "idAcervoAgent": collection,
                "timeout": timeout,
                "ativa": active
            };

            const config = {
                withCredentials: true
            };

            const response = await automationFetchPrivate.post(INSPECTIONS_URL, requestData, config);

            if (response.status === 201) {
                setSuccess(true);
            } else {
                setErrMsg('Falha ao incluir Inspeção');
                errRef.current.focus();
                console.log(response);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setErrMsg('Inspeção já existente!');
                    errRef.current.focus();
                } else {
                    console.error('Erro na solicitação:', error);
                    setErrMsg('Falha ao incluir Inspeção');
                    errRef.current.focus();
                }
            } else {
                console.error('Erro na solicitação:', error);
                setErrMsg('Sem resposta do servidor');
                errRef.current.focus();
                navigate('/login', { state: { from: location }, replace: true })
            }
        }
    }

    const handleScopeChange = (id) => {
        const selectedIndex = selectedScopes.indexOf(id);
        if (selectedIndex === -1) {
            setSelectedScopes([...selectedScopes, id]);
        } else {
            const updatedSelection = [...selectedScopes];
            updatedSelection.splice(selectedIndex, 1);
            setSelectedScopes(updatedSelection);
        }
    };

    const handleScheduleChange = (e) => {
        const selectedScheduleId = parseInt(e.target.value);
        setSchedule(selectedScheduleId);
    };

    const handleAgentChange = (e) => {
        const selectedAgentId = parseInt(e.target.value);
        setAgent(selectedAgentId);
    };

    const handleAgentCollectionChange = (e) => {
        const selectedAgentCollectionId = parseInt(e.target.value);
        setCollection(selectedAgentCollectionId);
    };

// ---------- START PLACEHOLDERS ----------
    const scopesPlaceholder = [{
        id: 1, 
        name: 'Contjet'
    },{
        id: 2, 
        name: 'Gethsêmani Morumbi'
    },{
        id: 3, 
        name: 'Gethsêmani Anhanguera'
    },{
        id: 4, 
        name: 'Arquitetura Humana'
    },{
        id: 5, 
        name: 'W3L'
    },{
        id: 6, 
        name: 'ALL Informática'
    },{
        id: 7, 
        name: 'The Boring Company'
    },{
        id: 8, 
        name: 'AAAAAAAAAAAAAAA'
    },{
        id: 9, 
        name: 'Behaviour Interactive'
    },{
        id: 10, 
        name: 'SpaceX'
    },{
        id: 11, 
        name: 'DELL'
    },{
        id: 12, 
        name: 'Valve'
    },{
        id: 13, 
        name: 'Capcom'
    }];

    const schedulesPlaceholder = [{
        id: 5, 
        name: 'todos os dias ao meio-dia'
    },{
        id: 6, 
        name: 'apenas dias utéis às 07:00'
    },{
        id: 13, 
        name: 'quinzenal à meia-noite'
    },{
        id: 2, 
        name: 'a cada dois dias às 15:00'
    }];

    const agentsPlaceholder = [{
        id: 15, 
        name: 'JUCESP'
    },{
        id: 4, 
        name: 'web scrapper #2'
    },{
        id: 10, 
        name: '007'
    },{
        id: 18, 
        name: 'limpa temp'
    }];

    const agentsColletionsPlaceholder = [{
        id: 40, 
        name: 'Acervo 1'
    },{
        id: 23, 
        name: 'Acervo 2'
    },{
        id: 311, 
        name: 'Acervo 3'
    },{
        id: 43, 
        name: 'Acervo 4'
    }];
// ---------- END PLACEHOLDERS ----------

    const scopesListItems = scopesPlaceholder.map((scope) => (
        <ListGroup.Item key={scope.id}>
            <Form.Check 
            inline 
            type='checkbox'
            onChange={() => handleScopeChange(scope.id)}
            checked={selectedScopes.includes(scope.id)}
            />
            {scope.name}
        </ListGroup.Item>
    ))

    const schedulesSelectOptions = schedulesPlaceholder.map((schedule) => (
        <option key={schedule.id} value={schedule.id}>{schedule.name}</option>
    ))

    const agentsSelectOptions = agentsPlaceholder.map((agent) => (
        <option key={agent.id} value={agent.id}>{agent.name}</option>
    ))

    const agentsColletionsSelectOptions = agentsColletionsPlaceholder.map((agentCollection) => (
        <option key={agentCollection.id} value={agentCollection.id}>{agentCollection.name}</option>
    ))
    
    const selectedScopeNames = selectedScopes.map(id =>
        scopesPlaceholder.find(scope => scope.id === id)?.name
    )

    return (
        <>
        <Header/>
        <Container fluid>
            <Row className="justify-content-center">
                <div className="col-md-8">
                    <div className="px-5 py-3 border border-secondary bg-light">
                        {success ? (
                            <div className="text-center text-success">
                                <FaCheckCircle size={50}/>
                                <h5 className="my-3">Inspeção inserida com sucesso!</h5>
                                <Button className="btn-secondary" as={Link} to='#'>Voltar</Button>
                            </div>
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                <div className="text-center">
                                    <h3>Inspeções</h3>
                                    <hr/>
                                </div>
                                <p ref={errRef} className="text-danger text-center" aria-live="assertive">{errMsg}</p>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="name">Nome:</Form.Label>
                                    <Form.Control required type="text" id="name" onChange={(e) => setName(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="description">Descrição:</Form.Label>
                                    <Form.Control required type="text" id="description" onChange={(e) => setDescription(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="folder">Pasta de Execução:</Form.Label>
                                    <Form.Control required type="text" id="folder" onChange={(e) => setFolder(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="scope">Escopos:</Form.Label>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                            {selectedScopeNames.length > 0
                                                ? selectedScopeNames.join(', ')
                                                : 'Selecionar...'}
                                            </Accordion.Header>
                                            <Accordion.Body className="p-1">
                                                <ListGroup variant="flush">
                                                    {scopesListItems}
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Col xs={6}>
                                    <Form.Label htmlFor="multiple">Multipla Execução:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Check className="align-middle" id="multiple" onChange={(e) => setMultiple(e.target.checked)}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="schedule">Agendamento:</Form.Label>
                                    <Form.Select id="schedule" onChange={handleScheduleChange} value={schedule}>
                                        {schedulesSelectOptions}
                                    </Form.Select>  
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="agent">Agente:</Form.Label>
                                    <Form.Select id="agent" onChange={handleAgentChange} value={agent}>
                                        {agentsSelectOptions}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="agent-collection">Acervo Agente:</Form.Label>
                                    <Form.Select id="agent-collection" onChange={handleAgentCollectionChange} value={collection}>
                                        {agentsColletionsSelectOptions}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTimeoutTooltip}
                                        >
                                        <Form.Label htmlFor="timeout">
                                            Timeout:
                                            <IoMdInformationCircle className="mx-1"/>
                                        </Form.Label>
                                    </OverlayTrigger>
                                    <InputGroup>
                                        <Form.Control
                                        type="text"
                                        id="timeout"
                                        value={timeout}
                                        onChange={handleChange}/>
                                        <InputGroup.Text>ms</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Col xs={2}>
                                        <Form.Label htmlFor="active">Ativo:</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Check 
                                        id="active" 
                                        checked={active}
                                        onChange={(e) => setActive(e.target.checked)}/>
                                    </Col>
                                </Form.Group>
                                <Button type="submit" className="my-3 w-100">Salvar</Button>
                            </Form>
                        )}
                    </div>
                </div>
            </Row>
        </Container>
        <Footer/>
        </>
    )

}

export default InspectionForm