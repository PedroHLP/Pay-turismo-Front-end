import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css'; // Import the CSS for Typeahead

const SearchCity = ({ onCitySelect, selectedCity }) => {
    const [options, setOptions] = useState([]);
    const [internalSelectedCity, setInternalSelectedCity] = useState(null); // Internal state to manage selected city
    const URL = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios";

    const getCities = async () => {
        try {
            const response = await fetch(URL);

            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }

            const data = await response.json();
            
            const cityNames = data.map(city => city.nome);
            setOptions(cityNames);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    useEffect(() => {
        getCities();
    }, []);

    useEffect(() => {
        // Update internal state when selectedCity changes externally
        setInternalSelectedCity(selectedCity);
    }, [selectedCity]);

    const handleCityChange = (selected) => {
        if (selected.length > 0) {
            setInternalSelectedCity(selected[0]); // Update internal state with selected city
            onCitySelect(selected[0]); // Pass selected city to parent component
        } else {
            setInternalSelectedCity(null); // Handle case where no city is selected
            onCitySelect(null); // Pass null to parent component when no city is selected
        }
    };

    return (
        <>
            <Form.Group className="mb-3">
                <Typeahead
                    id="basic-typeahead-single"
                    labelKey="name" // Assuming your city names array has 'name' property, adjust as needed
                    onChange={handleCityChange}
                    options={options}
                    placeholder="Selecione a cidade..."
                    selected={internalSelectedCity ? [internalSelectedCity] : []} // Set the selected option
                    size="lg"
                    flip
                    paginate
                />
            </Form.Group>
        </>
    );
};

export default SearchCity;
