import localforage from 'localforage';
import * as lib from './http';

export const login = (payload) => { 
  return lib.XHR.post(payload.url, payload.data);   
};
export const logout = () => {
  setToken(null);
  return false;
};
export const getToken = () => {
    return window.localStorage.getItem('token');
};
export const isloggedIn = () => {
  if(getToken()){    
    return true;
  }else{
    return false;
  }
};
export const getUser = () => {
    if (getToken()) {
      return lib.XHR.get('/accounts/me');
    } else {
      return new Promise.reject({p: null});
    }
};
export const setToken = (token = null) => {
    if (token) {
      window.localStorage.setItem('token', token);
    } else {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('passport');
    }
};

export const setPassport = (passport = null) => {
  if (passport) {
    window.localStorage.setItem('passport', passport);
  } else {
    window.localStorage.removeItem('passport');
  }
};