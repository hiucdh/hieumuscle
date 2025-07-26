import axios from '../utils/axios';

export const register = async (userData) => {
    const response = await axios.post('/register', userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post('/login', userData);
    return response.data;
};
