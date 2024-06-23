const getBank = async (bankNumber) => {
    const urlWithParams = `https://brasilapi.com.br/api/banks/v1/${bankNumber}`;
    try {
        const response = await fetch(urlWithParams);

        if (response.ok) {
            const data = await response.json();
            return data.fullName;
        } else {
            return "";
        }
    } catch (error) {
        return error;
    }
};

export default getBank;
  