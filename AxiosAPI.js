import axios from 'axios';

export const apiAxios = axios.create({
    baseURL: 'http://192.168.100.2/API_Yogamap/public/',
});

export const dirImg = "http://192.168.100.2/API_Yogamap/assets/";