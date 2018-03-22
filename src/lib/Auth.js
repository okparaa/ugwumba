import * as lib from './http';
import Cookie from 'js-cookie';
export const login = (payload) => { 
  return lib.XHR.post(payload.url, payload.data);   
};
export const logout = () => {
  setToken(null);
  return false;
};
export const getToken = () => {
    return Cookie.get('token');
};
export const getPassport = () => {
    return Cookie.get('passport');
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
      Cookie.set('token', token);
    } else {
      Cookie.remove('token');
      Cookie.remove('passport');
    }
};

export const setPassport = (passport = null) => {
  if (passport) {
    Cookie.set('passport', passport);
  } else {
    Cookie.remove('passport');
  }
};