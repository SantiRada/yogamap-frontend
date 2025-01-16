import axios from 'axios';

export const apiAxios = axios.create({
    baseURL: 'https://yogamap.com.ar/public/',
});

export const dirImg = "https://yogamap.com.ar/API_Yogamap/assets/";