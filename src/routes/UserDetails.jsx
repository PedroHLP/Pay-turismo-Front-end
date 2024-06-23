import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAutomationFetchPrivate from '../hooks/useAutomationFetchPrivate';
import Header from '../components/Header';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import LabelledField from '../components/LabelledField';
import getBank from '../functions/getBank';
import { formatCep, formatCnpj, formatCpf, formatPhone } from '../functions/formatUtils';

const UserDetails = () => {
    const { id } = useParams();
    const USER_URL = "/users/one/" + id;
    const [user, setUser] = useState(null);
    const [bankName, setBankName] = useState("");

    const automationFetchPrivate = useAutomationFetchPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const getUser = async () => {
        try {

            const response = await automationFetchPrivate.get(USER_URL);
            const data = response.data;

            setUser(data);
            if (data.bank) {
                const bankFullName = await getBank(data.bank);
                setBankName(`${data.bank} - ${bankFullName}` || `${data.bank} - Banco não encontrado`);
            }

        } catch (error) {
            console.log(error);
            navigate('/login', { state: { from: location }, replace: true })
        }
    }

    useEffect(() => {
        getUser();
    }, [id]);

    if (!user) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    const formattedCpf = formatCpf(user.cpf);
    const formattedPhone = formatPhone(user.phone);
    const formattedCnpj = formatCnpj(user.cnpj);
    const formattedExpireDate = new Date(user.documentExpirationDate).toLocaleDateString('pt-BR');
    const formattedCep = formatCep(user.zipCode);
    const formattedRegistrationDate = new Date(user.registrationDate).toLocaleDateString('pt-BR');
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

    const openDocument = (document, extension) => {
        if (!document) return;
    
        let documentDataUri = "";
    
        if (extension === "pdf") {
            documentDataUri = `data:application/pdf;base64,${document}`;
        } else {
            documentDataUri = `data:image/jpeg;base64,${document}`;
        }
    
        const byteCharacters = atob(document);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: extension === "pdf" ? "application/pdf" : "image/jpeg" });
    
        const blobUrl = URL.createObjectURL(blob);
    
        window.open(blobUrl, '_blank');
    
        URL.revokeObjectURL(blobUrl);
    };
    

    const status = (
        <Badge bg={badgeVariation}>
            {userStatus}
        </Badge>
    )

    const basicInfoStack = (
        <Stack className="mb-3">
            <h3>Informações Básicas:</h3>
            <LabelledField label="CPF:" value={formattedCpf} />
            <LabelledField label="E-mail:" value={user.email} />
            <LabelledField label="Celular:" value={formattedPhone} />
            <LabelledField label="CNPJ:" value={formattedCnpj} />
            <LabelledField label="Vencimento:" value={formattedExpireDate} />
        </Stack>
    )

    const addressStack = (
        <Stack className="mb-3">
            <h3>Endereço:</h3>
            <LabelledField label="CEP:" value={formattedCep} />
            <LabelledField label="Endereço:" value={user.address} />
            <LabelledField label="Número:" value={user.number} />
            <LabelledField label="Complemento:" value={user.complement} />
            <LabelledField label="Cidade:" value={user.city} />
            <LabelledField label="Estado:" value={user.state} />
            <LabelledField label="País:" value={user.country} />
        </Stack>
    )

    const bankingInfoStack = (
        <Stack className="mb-3">
            <h3>Informações Bancárias:</h3>
            <LabelledField label="Banco:" value={bankName} />
            <LabelledField label="Agência:" value={user.agency} />
            <LabelledField label="Conta:" value={user.account} />
        </Stack>
    )

    const miscInfoStack = (
        <Stack className="mb-3">
            <h3>Outras Informações:</h3>
            <LabelledField label="Data de cadastro:" value={formattedRegistrationDate} />
            <LabelledField label="Situação do cadastro:" value={status} />
        </Stack>
    )

    const documentsStack = (
        <Stack className="mb-3">
            <h3>Documentos:</h3>
            <div className="mb-1">
                <Button size="sm" onClick={() => openDocument(user.documents.documentPhoto, user.documents.documentPhotoExtension)}>
                    Foto do documento
                </Button>
            </div>
            <div className="mb-1">
                <Button size="sm" onClick={() => openDocument(user.documents.identificationSelfie, user.documents.identificationSelfieExtension)}>
                    Selfie com identificação
                </Button>
            </div>
            <div className="mb-1">
                <Button size="sm" onClick={() => openDocument(user.documents.residenceProof, user.documents.residenceProofExtension)}>
                    Comprovante de residência
                </Button>
            </div>
            <div className="mb-1">
                <Button size="sm" onClick={() => openDocument(user.documents.cadasturProof, user.documents.cadasturProofExtension)}>
                    Certificado Cadastur
                </Button>
            </div>
            <div className="mb-1">
                <Button size="sm" onClick={() => openDocument(user.documents.bankingProof, user.documents.bankingProofExtension)}>
                    Comprovante Bancário
                </Button>
            </div>
        </Stack>
    )

    return (
        <>
            <Header />
            <Container fluid>
                <div className="shadow-sm px-5 py-2 bg-body-tertiary rounded">
                    <Row>
                        <div>
                            <h3 className="text-center">{user.tradingName}</h3>
                            <h5 className="text-center">{user.name}</h5>
                        </div>
                        <hr/>
                        <Col>
                            {basicInfoStack}
                            {addressStack}
                        </Col>
                        <Col>
                            {bankingInfoStack}
                            {miscInfoStack}
                            {documentsStack}
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
};

export default UserDetails;
