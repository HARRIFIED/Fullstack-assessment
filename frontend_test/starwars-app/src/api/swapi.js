import axios from 'axios';

const API_BASE_URL = 'https://swapi.dev/api';

export const fetchCharacters = async (page = 1) => {
    const response = await axios.get(`${API_BASE_URL}/people/?page=${page}`);
    return response.data;
};

export const searchCharacters = async (query) => {
    const response = await axios.get(`${API_BASE_URL}/people/?search=${query}`);
    return response.data.results;
};

export const fetchCharacterDetails = async (url) => {
    const response = await axios.get(url);
    return response.data;
};
