import {
  Container,
  Form,
  Button,
  Row,
  Col,
  FloatingLabel,
  Image,
  Tab,
  Tabs,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";

import signUp from "../assets/sign_up.svg";
import mailSent from "../assets/mail.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import automationFetch from "../axios/config";
import SearchCity from "../components/SearchCity";
import getBank from "../functions/getBank";

const Register = () => {
  const REGISTER_URL = "/users/new";
  const CPF_EXIST_URL = "/users/existsByCpf";
  const CNPJ_EXIST_URL = "/users/existsByCnpj";
  const EMAIL_EXIST_URL = "/users/existsByEmail";
  const PHONE_EXIST_URL = "/users/existsByPhone";
  const BANK_BR_URL = "https://brasilapi.com.br/api/banks/v1/";

  const [activeTab, setActiveTab] = useState(1);
  const [error, setError] = useState("");
  const [isSearching, setSearching] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isRegistering, setRegistering] = useState(false);

  const [isCpfValid, setCpfValid] = useState(false);
  const [cpfExists, setCpfExists] = useState(false);
  const [cpfError, setCpfError] = useState("");

  const [isEmailValid, setEmailValid] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [phoneExists, setPhoneExists] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const [isCnpjValid, setCnpjValid] = useState(false);
  const [cnpjExists, setCnpjExists] = useState(false);
  const [cnpjError, setCnpjError] = useState("");

  const [isExpired, setExpired] = useState(false);
  const [expiredError, setExpiredError] = useState("");

  const [bankName, setBankName] = useState("");

  const [isWithoutNumber, setIsWithoutNumber] = useState(false);

  const isFirstTab = activeTab === 0;
  const isLastTab = activeTab === 3;
  const ufs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const [basicInfo, setBasicInfo] = useState({
    cpf: "",
    name: "",
    email: "",
    phone: "",
    cadasturCnpj: "",
    expireDate: "",
    tradeName: "",
  });

  const [bankingInfo, setBankingInfo] = useState({
    agency: "",
    account: "",
    bank: "",
  });

  const [address, setAddress] = useState({
    cep: "",
    address: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    country: "Brasil",
  });

  const [documents, setDocuments] = useState({
    documentPhoto: null,
    identitySelfie: null,
    residenceProof: null,
    cadasturProof: null,
    bankingProof: null,
  });

  const handleNextTab = () => {
    if (validateTab()) {
      setActiveTab((prevTab) => (isLastTab ? prevTab : prevTab + 1));
    } else {
      setError('Preencha os campos corretamente');
    }
  };

  const handlePrevTab = () => {
    setActiveTab((prevTab) => (isFirstTab ? prevTab : prevTab - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCpfValid || !isEmailValid || !isCnpjValid) {
      return;
    } else if (cpfExists || emailExists || phoneExists || cnpjExists) {
      return;
    }

    setRegistering(true);

    const mySqlExpireDate = formatDateMySql(basicInfo.expireDate);

    try {
      const requestData = {
        name: basicInfo.name,
        login: basicInfo.cpf,
        cpf: basicInfo.cpf,
        email: basicInfo.email,
        phone: basicInfo.phone,
        tradingName: basicInfo.tradeName,
        cnpj: basicInfo.cadasturCnpj,
        documentExpirationDate: mySqlExpireDate,
        zipCode: address.cep,
        address: address.address,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        country: address.country,
        notes: "No additional notes.",
        bank: bankingInfo.bank,
        agency: bankingInfo.agency,
        account: bankingInfo.account,
      };

      const formData = new FormData();

      // Adiciona o JSON ao FormData uma vez, fora do loop
      formData.append(
        "userRequestDTO",
        new Blob([JSON.stringify(requestData)], { type: "application/json" }),
      ); // Modificação

      // O loop para adicionar os campos individualmente foi removido
      /*
            Object.entries(requestData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            */

      formData.append("documentPhoto", documents.documentPhoto);
      formData.append("identificationSelfie", documents.identitySelfie);
      formData.append("residenceProof", documents.residenceProof);
      formData.append("cadasturProof", documents.cadasturProof);
      formData.append("bankingProof", documents.bankingProof);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      const response = await automationFetch.post(
        REGISTER_URL,
        formData,
        config,
      );

      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError("Falha ao incluir Inspeção");
      }
    } catch (error) {
      if (error.response) {
        // Resposta da API com um código de erro (exemplo: 400, 401, 403, etc.)
        if (error.response.status === 400) {
          // Tratar erro de autenticação (usuário ou senha incorretos)
          setError("Usuário ou senha incorretos");
        } else if (error.response.status === 403) {
          // Tratar erro de permissão (usuário não tem permissão)
          setError("Acesso não autorizado");
        } else {
          // Outros erros da API
          setError("Erro na solicitação: " + error.response.status);
        }
      } else if (error.request) {
        // A solicitação foi feita, mas não houve resposta da API (por exemplo, CORS bloqueado)
        setError("Sem resposta do servidor");
      } else {
        // Erro desconhecido
        setError("Erro desconhecido: " + error.message);
      }
    }
    setRegistering(false);
  };

  const handleChange = (setter, fieldName, value) => {
    setter((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name } = event.target;
    const selectedFile = event.target.files[0];

    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
    const fileExtension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setError("Selecione uma extensão válida (.png, .jpg, .pdf)");
      event.target.value = null;
      return;
    }

    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > 1) {
      setError("O arquivo não pode ultrapassar 1 MB!");
      event.target.value = null;
      return;
    }

    setDocuments((prevState) => ({
      ...prevState,
      [name]: selectedFile,
    }));
  };

  const handleAccept = (setter, fieldName, value) => {
    setter((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        var number = ""

        setIsWithoutNumber(isChecked);
        if(isChecked) number = "S/N";
        
        setAddress((prevState) => ({
            ...prevState,
            ['number']: number,
        }));
    };

  const getCepAddress = async (cep) => {
    const urlWithParams = `https://viacep.com.br/ws/${cep}/json/`;
    setSearching(true);
    try {
      const response = await fetch(urlWithParams);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.resultado === "0") {
        throw new Error("CEP não encontrado");
      }
      setAddress({
        cep: cep,
        address: data.logradouro,
        number: "",
        complement: "",
        city: data.localidade,
        state: data.uf,
        country: "Brasil",
      });
    } catch (error) {
      setError(error.message);
    }
    setSearching(false);
  };

  const getBankName = async (bankNumber) => {
    setSearching(true);
    try {
      const bankFullName = await getBank(bankNumber);
      setBankName(bankFullName);
    } catch (error) {
      console.log(error)
    } finally {
      setSearching(false);
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === "cep" && value !== "") {
      getCepAddress(address.cep);
    } else if (name === "bank" && value !== "") {
      getBankName(bankingInfo.bank);
    }
  };

  const validateTab = () => {
    var currentTabInfo = "";
    switch (activeTab) {
      case 0:
        currentTabInfo = basicInfo;
        if (!isCpfValid || !isEmailValid || !isCnpjValid) {
          return false;
        } else if (
          cpfExists ||
          emailExists ||
          phoneExists ||
          cnpjExists ||
          isExpired
        ) {
          return false;
        }
        break;
      case 1:
        currentTabInfo = bankingInfo;
        break;
      case 2:
        currentTabInfo = address;
        break;
      case 3:
        currentTabInfo = documents;
        break;
    }

    const isAllFieldsFilled = Object.keys(currentTabInfo).every((key) => {
      if (key === "complement") {
        return true;
      }
      return currentTabInfo[key] !== "";
    });
    return isAllFieldsFilled;
  };

  const formatDateMySql = (unformattedDate) => {
    const parts = unformattedDate.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    const mysqlDate = date.toISOString().split("T")[0];
    return mysqlDate;
  };

  const checkExpiredDate = (dateString) => {
    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);

    const today = new Date();

    return date < today;
  };

  function validateCPF(cpf) {
    cpf = cpf.toString(); // Ensure cpf is treated as string
    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
      return false; // Invalid length or all characters are the same
    }

    // Validate CPF algorithm
    let sum = 0;
    let mod = 0;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }

    mod = (sum * 10) % 11;

    if (mod === 10 || mod === 11) {
      mod = 0;
    }

    if (mod !== parseInt(cpf.charAt(9))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }

    mod = (sum * 10) % 11;

    if (mod === 10 || mod === 11) {
      mod = 0;
    }

    if (mod !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  function validateCNPJ(cnpj) {
    cnpj = cnpj.toString().replace(/\D/g, ""); // Ensure cnpj is treated as string
    if (cnpj.length !== 14 || /^(.)\1+$/.test(cnpj)) {
      return false; // Invalid length or all characters are the same
    }

    // Validate CNPJ algorithm
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits.charAt(0))) {
      return false;
    }

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits.charAt(1))) {
      return false;
    }

    return true;
  }

  const checkCpf = async () => {
    try {
      const response = await automationFetch.get(CPF_EXIST_URL, {
        params: {
          cpf: basicInfo.cpf,
        },
      });
      const data = await response.data;
      setCpfExists(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const checkEmail = async () => {
    try {
      const response = await automationFetch.get(EMAIL_EXIST_URL, {
        params: {
          email: basicInfo.email,
        },
      });
      const data = await response.data;
      setEmailExists(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const checkPhone = async () => {
    try {
      const response = await automationFetch.get(PHONE_EXIST_URL, {
        params: {
          phone: basicInfo.phone,
        },
      });
      const data = await response.data;
      setPhoneExists(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const checkCnpj = async () => {
    try {
      const response = await automationFetch.get(CNPJ_EXIST_URL, {
        params: {
          cnpj: basicInfo.cadasturCnpj,
        },
      });
      const data = await response.data;
      setCnpjExists(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const basicInfoTab = (
    <Tab eventKey={0} title="Informações Básicas" key={0} disabled>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              CPF<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            as={IMaskInput}
            mask="000.000.000-00"
            unmask={true}
            type="text"
            name="cpf"
            autoComplete="off"
            placeholder="CPF"
            onComplete={(value) => handleAccept(setBasicInfo, "cpf", value)}
            onAccept={() => (basicInfo.cpf = "")}
            value={basicInfo.cpf}
            required
          />
        </FloatingLabel>
        <Form.Text className="text-danger fw-bold">{cpfError}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Nome<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            type="text"
            name="name"
            autoComplete="off"
            placeholder="Nome"
            onChange={(e) =>
              handleChange(setBasicInfo, e.target.name, e.target.value)
            }
            value={basicInfo.name}
            required
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              E-mail<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            type="email"
            name="email"
            autoComplete="off"
            placeholder="Email"
            onChange={(e) =>
              handleChange(setBasicInfo, e.target.name, e.target.value)
            }
            value={basicInfo.email}
            required
          />
        </FloatingLabel>
        <Form.Text className="text-danger fw-bold">{emailError}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Celular<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            as={IMaskInput}
            mask="(00) 00000-0000"
            unmask={true}
            type="text"
            name="phone"
            autoComplete="off"
            placeholder="Celular"
            onComplete={(value) => handleAccept(setBasicInfo, "phone", value)}
            onAccept={() => (basicInfo.phone = "")}
            value={basicInfo.phone}
            required
          />
        </FloatingLabel>
        <Form.Text className="text-danger fw-bold">{phoneError}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              CNPJ Cadastur<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            as={IMaskInput}
            mask="00.000.000/0000-00"
            unmask={true}
            type="text"
            name="cadasturCnpj"
            autoComplete="off"
            placeholder="CNPJ"
            onComplete={(value) =>
              handleAccept(setBasicInfo, "cadasturCnpj", value)
            }
            onAccept={() => (basicInfo.cadasturCnpj = "")}
            value={basicInfo.cadasturCnpj}
            required
          />
        </FloatingLabel>
        <Form.Text className="text-danger fw-bold">{cnpjError}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Vencimento<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            as={IMaskInput}
            mask="00/00/0000"
            unmask={false}
            type="text"
            name="expireDate"
            autoComplete="off"
            placeholder="Vencimento"
            onComplete={(value) =>
              handleAccept(setBasicInfo, "expireDate", value)
            }
            onAccept={() => (basicInfo.expireDate = "")}
            value={basicInfo.expireDate}
            required
          />
        </FloatingLabel>
        <Form.Text className="text-danger fw-bold">{expiredError}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Nome Fantasia Agência<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            type="text"
            name="tradeName"
            autoComplete="off"
            placeholder="Nome Fantasia Agencia"
            onChange={(e) =>
              handleChange(setBasicInfo, e.target.name, e.target.value)
            }
            value={basicInfo.tradeName}
            required
          />
        </FloatingLabel>
      </Form.Group>
    </Tab>
  );

  const bankingInfoTab = (
    <Tab eventKey={1} title="Dados Bancários" key={1} disabled>
      <div className="text-center mb-3">
        <Form.Text muted>
          <span>CPF: </span>
          <span className="ms-1 fw-bold">{basicInfo.cpf}</span>
        </Form.Text>
      </div>
      <Form.Group className="mb-3">
        <InputGroup>
          <FloatingLabel
            label={
              <span>
                Banco<span className="text-danger mx-1">*</span>
              </span>
            }
          >
            <Form.Control
              as={IMaskInput}
              mask={Number}
              type="text"
              name="bank"
              autoComplete="off"
              placeholder="Banco"
              onComplete={(value) =>
                handleAccept(setBankingInfo, "bank", value)
              }
              onBlur={(event) => handleBlur(event)}
              value={bankingInfo.bank}
              required
            />
          </FloatingLabel>
          <InputGroup.Text className={isSearching ? "" : "visually-hidden"}>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        </InputGroup>
        <Form.Text>{bankName}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Agência<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            type="text"
            name="agency"
            autoComplete="off"
            placeholder="Agência"
            onChange={(e) =>
              handleChange(setBankingInfo, e.target.name, e.target.value)
            }
            value={bankingInfo.agency}
            required
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Conta<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            type="text"
            name="account"
            autoComplete="off"
            placeholder="Conta"
            onChange={(e) =>
              handleChange(setBankingInfo, e.target.name, e.target.value)
            }
            value={bankingInfo.account}
            required
          />
        </FloatingLabel>
      </Form.Group>
    </Tab>
  );

  const handleCitySelect = (city) => {
    setAddress((prevState) => ({
      ...prevState,
      ['city']: city,
    }));
  };

  const addressTab = (
    <Tab eventKey={2} title="Endereço" key={2} disabled>
      <Form.Group className="mb-3">
        <InputGroup>
          <FloatingLabel
            label={
              <span>
                CEP<span className="text-danger mx-1">*</span>
              </span>
            }
          >
            <Form.Control
              as={IMaskInput}
              mask="00000-000"
              unmask={true}
              type="text"
              name="cep"
              autoComplete="off"
              placeholder="CEP"
              onComplete={(value) => handleAccept(setAddress, "cep", value)}
              onAccept={() => (address.cep = "")}
              onBlur={(event) => handleBlur(event)}
              value={address.cep}
              required
            />
          </FloatingLabel>
          <InputGroup.Text className={isSearching ? "" : "visually-hidden"}>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel
          label={
            <span>
              Endereço<span className="text-danger mx-1">*</span>
            </span>
          }
        >
          <Form.Control
            type="text"
            name="address"
            autoComplete="off"
            placeholder="Endereço"
            value={address.address}
            onChange={(e) =>
              handleChange(setAddress, e.target.name, e.target.value)
            }
            required
          />
        </FloatingLabel>
      </Form.Group>
    <Form.Group className="mb-3">
        <InputGroup>
            <FloatingLabel
                label={
                    <span>
                    Número<span className="text-danger mx-1">*</span>
                    </span>
                }
            >
                <Form.Control
                as={IMaskInput}
                mask={Number}
                type="text"
                name="number"
                autoComplete="off"
                placeholder="Number"
                onAccept={(value) => handleAccept(setAddress, "number", value)}
                value={address.number}
                disabled={isWithoutNumber}
                required
                />
            </FloatingLabel>
            <InputGroup.Text>
                <Form.Check 
                    type="checkbox"
                    label="S/N"
                    className="ms-1"
                    checked={isWithoutNumber}
                    onChange={(e) => handleCheckboxChange(e)}
                />
            </InputGroup.Text>
        </InputGroup>
    </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel label="Complemento">
          <Form.Control
            type="text"
            name="complement"
            autoComplete="off"
            placeholder="Complemento"
            onChange={(e) =>
              handleChange(setAddress, e.target.name, e.target.value)
            }
            value={address.complement}
          />
        </FloatingLabel>
      </Form.Group>
      <SearchCity onCitySelect={handleCitySelect} selectedCity={address.city} />
      <Form.Group className="mb-3">
        <FloatingLabel label="Estado">
          <Form.Select
            type="text"
            name="state"
            autoComplete="off"
            value={address.state}
            onChange={(e) =>
              handleChange(setAddress, e.target.name, e.target.value)
            }
            required
          >
            {ufs.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel label="País">
          <Form.Control
            type="text"
            name="country"
            autoComplete="off"
            placeholder="País"
            value={address.country}
            required
            disabled
          />
        </FloatingLabel>
      </Form.Group>
    </Tab>
  );

  const documentsTab = (
    <Tab eventKey={3} title="Documentos" key={3} disabled>
      <div className="text-center mb-3">
        <Form.Text muted>
          <span>Tipos de arquivos permitidos: </span>
          <span className="ms-1 fw-bold">.pdf</span>
          <span className="ms-1 fw-bold">.jpg</span>
          <span className="ms-1 fw-bold">.jpeg</span>
          <span className="ms-1 fw-bold">.png</span>
          <span className="ms-2">Tamanho máximo: </span>
          <span className="ms-1 fw-bold">1 MB</span>
        </Form.Text>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>
          Foto do documento (CNH ou RG){" "}
          <span className="text-danger mx-1">*</span>
        </Form.Label>
        <Form.Control
          type="file"
          name="documentPhoto"
          onChange={handleFileChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Selfie com identificação <span className="text-danger mx-1">*</span>
        </Form.Label>
        <Form.Control
          type="file"
          name="identitySelfie"
          onChange={handleFileChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Comprovante de residência <span className="text-danger mx-1">*</span>
        </Form.Label>
        <Form.Control
          type="file"
          name="residenceProof"
          onChange={handleFileChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Certificado Cadastur <span className="text-danger mx-1">*</span>
        </Form.Label>
        <Form.Control
          type="file"
          name="cadasturProof"
          onChange={handleFileChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Comprovante Bancário <span className="text-danger mx-1">*</span>
        </Form.Label>
        <Form.Control
          type="file"
          name="bankingProof"
          onChange={handleFileChange}
          required
        />
      </Form.Group>
    </Tab>
  );

  const formTabs = (
    <>
      <div className="text-center mb-3">
        <span className="text-danger mx-1">* Campos obrigatórios</span>
      </div>
      <Tabs className="mb-3" activeKey={activeTab} fill>
        {basicInfoTab}
        {bankingInfoTab}
        {addressTab}
        {documentsTab}
      </Tabs>
    </>
  );

  useEffect(() => {
    setError("");
  }, [basicInfo, bankingInfo, address, documents, activeTab, isSuccess]);

  useEffect(() => {
    if (basicInfo.cpf !== "") {
      const isValid = validateCPF(basicInfo.cpf);
      setCpfValid(isValid);
      if (isValid) {
        checkCpf(basicInfo.cpf);
        if (cpfExists) {
          setCpfError("CPF já cadastrado");
        } else {
          setCpfError("");
        }
      } else {
        setCpfError("CPF inválido");
      }
    }
  }, [basicInfo.cpf, cpfExists]);

  useEffect(() => {
    if (basicInfo.phone !== "") {
      checkPhone(basicInfo.phone);
      if (phoneExists) {
        setPhoneError("Celular já cadastrado");
      } else {
        setPhoneError("");
      }
    }
  }, [basicInfo.phone, phoneExists]);

  useEffect(() => {
    if (basicInfo.email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(basicInfo.email);
      setEmailValid(isValid);
      if (isValid) {
        checkEmail(basicInfo.email);
        if (emailExists) {
          setEmailError("E-mail já cadastrado");
        } else {
          setEmailError("");
        }
      } else {
        setEmailError("E-mail inválido");
      }
    }
  }, [basicInfo.email, emailExists]);

  useEffect(() => {
    if (basicInfo.cadasturCnpj !== "") {
      const isValid = validateCNPJ(basicInfo.cadasturCnpj);
      setCnpjValid(isValid);
      if (isValid) {
        checkCnpj(basicInfo.cpf);
        if (cnpjExists) {
          setCnpjError("CNPJ já cadastrado");
        } else {
          setCnpjError("");
        }
      } else {
        setCnpjError("CNPJ inválido");
      }
    }
  }, [basicInfo.cadasturCnpj, cnpjExists]);

  useEffect(() => {
    if (basicInfo.expireDate !== "") {
      const isExpired = checkExpiredDate(basicInfo.expireDate);
      setExpired(isExpired);
      if (isExpired) {
        setExpiredError("Vencimento expirado");
      } else {
        setExpiredError("");
      }
    }
  }, [basicInfo.expireDate, isExpired]);

  useEffect(() => {
    if (address.number !== "S/N"){
      setIsWithoutNumber(false);
    }
  }, [address.number])

  return (
    <>
      <Container className="pt-5">
        {isSuccess ? (
          <div>
            <Row>
              <div className="text-center">
                <Image src={mailSent} width={200} />
              </div>
            </Row>
            <Row>
              <div className="text-center my-5">
                <div className="fs-5">
                  Um e-mail foi enviado para{" "}
                  <span className="fw-bold text-primary fs-5">
                    {basicInfo.email}
                  </span>
                  , abra-o para dar continuidade com verificação de identidade.
                </div>
              </div>
            </Row>
          </div>
        ) : (
          <Row className="align-items-center" xs={1} md={2}>
            <Col className="d-none d-sm-block">
                <Image src={signUp} fluid/>
            </Col>
            <Col>
              <Alert
                key="danger"
                variant="danger"
                className={`text-center ${
                  error === "" ? "visually-hidden" : ""
                }`}
              >
                {error}
              </Alert>
              <Form onSubmit={handleSubmit}>
                {formTabs}
                <Row className="mb-3" xs={isFirstTab ? 1 : 2}>
                  <Col className={isFirstTab ? "visually-hidden" : ""}>
                    <Button
                      className="w-100"
                      variant="secondary"
                      onClick={handlePrevTab}
                    >
                      Anterior
                    </Button>
                  </Col>
                  <Col className={isLastTab ? "visually-hidden" : ""}>
                    <Button
                      className="w-100"
                      variant="primary"
                      onClick={handleNextTab}
                    >
                      Próximo
                    </Button>
                  </Col>
                  <Col className={isLastTab ? "" : "visually-hidden"}>
                    <Button
                      className="w-100"
                      type="submit"
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          Enviando...
                        </>
                      ) : (
                        "Enviar"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        )}
        <div className="position-absolute top-0 start-0 p-2">
          <Link to="/" className="link-secondary">
            &lt; Voltar para o início
          </Link>
        </div>
      </Container>
    </>
  );
};

export default Register;
