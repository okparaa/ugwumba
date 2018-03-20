import axios from 'axios';
import config from '@/lib/config';
//import localforage from 'localforage';
export const XHR = axios.create({
        token: null,
        baseURL: config.url,
        'Content-Type': 'text/plain',
    });
    
 XHR.interceptors.request.use(
    config => {
      config.headers.authorization = window.localStorage.getItem("token");
      return config;
    },
    error => Promise.reject(error)
  );
      
export const FDT = (payload) => {
    var formdata = new FormData();
    Object.keys(payload).forEach(key =>{
        formdata.append(key, payload[key]);
    });
    return formdata;
}