import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAutomationFetchPrivate from '../hooks/useAutomationFetchPrivate';
import Header from '../components/Header';
import { Badge, Container, Row } from 'react-bootstrap';
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
        return <div>Loading...</div>;
    }
    
    const formattedCpf = formatCpf(user.cpf);
    const formattedPhone = formatPhone(user.phone);
    const formattedCnpj = formatCnpj(user.cnpj);
    const formattedExpireDate = new Date(user.documentExpirationDate).toLocaleDateString('pt-BR');
    const formattedCep = formatCep(user.zipCode);
    const formattedRegistrationDate = new Date(user.registrationDate).toLocaleDateString('pt-BR');

    const basicInfoStack = (
        <Stack className="mb-3">
            <h3>Informações Básicas:</h3>
            <LabelledField label="Nome:" value={user.name} />
            <LabelledField label="CPF:" value={formattedCpf} />
            <LabelledField label="E-mail:" value={user.email} />
            <LabelledField label="Celular:" value={formattedPhone} />
            <LabelledField label="Agência:" value={user.tradingName} />
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

    const status = (
        <Badge bg={badgeVariation}>
            {userStatus}
        </Badge>
    )

    const miscInfoStack = (
        <Stack className="mb-3">
            <h3>Outras Informações:</h3>
            <LabelledField label="Data de cadastro:" value={formattedRegistrationDate} />
            <LabelledField label="Situação do cadastro:" value={status} />
        </Stack>
    )

    return (
        <>
        <Header/>
        <Container fluid>
            <div className="shadow-sm p-3 bg-body-tertiary rounded">
                {basicInfoStack}
                {addressStack}
                {bankingInfoStack}
                {miscInfoStack}
            </div>
        </Container>
        </>
    );
};

export default UserDetails;
