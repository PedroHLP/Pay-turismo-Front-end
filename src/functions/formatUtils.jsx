export function formatCpf(cpf) {
    if (!cpf) return '';
    // Remove all non-digits
    cpf = cpf.replace(/\D/g, '');
    // Apply CPF mask
    const cpfRegex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
    return cpf.replace(cpfRegex, '$1.$2.$3-$4');
}

export function formatPhone(phone) {
    if (!phone) return '';
    // Remove all non-digits
    phone = phone.replace(/\D/g, '');
    // Apply phone number mask
    const phoneRegex = /^(\d{2})(\d{5})(\d{4})$/;
    return phone.replace(phoneRegex, '($1) $2-$3');
}

export function formatCnpj(cnpj) {
    if (!cnpj) return '';
    const cnpjRegex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
    return cnpj.replace(cnpjRegex, '$1.$2.$3/$4-$5');
}

export function formatCep(cep) {
    if (!cep) return '';
    // Remove all non-digits
    cep = cep.replace(/\D/g, '');
    // Apply CEP mask
    const cepRegex = /^(\d{5})(\d{3})$/;
    return cep.replace(cepRegex, '$1-$2');
}
