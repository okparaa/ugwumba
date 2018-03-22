import * as lib from './http';
import Cookie from 'js-cookie';
export default {
  login(payload){ 
    return lib.XHR.post(payload.url, payload.data);   
  },
  logout(){
    this.setToken(null);
    return false;
  },
  getToken(){
    return Cookie.get('token');
  },
  getPassport(){
    return Cookie.get('passport');
  },
  isloggedIn() {
    if(this.getToken()){    
      return true;
    }else{
      return false;
    }
  },
  getUser(){
    if (this.getToken()) {
      return lib.XHR.get('/accounts/me');
    } else {
      return new Promise.reject({p: null});
    }
  },
  setToken(token = null){
    if (token) {
      Cookie.set('token', token);
    } else {
      Cookie.remove('token');
      Cookie.remove('passport');
    }
  },
  setPassport(passport = null){
    if (passport) {
      Cookie.set('passport', passport);
    } else {
      Cookie.remove('passport');
    }
  },
  setItem(name, value){
    Cookie.set(name, value);
  },
  getItem(name){
    return Cookie.get(name);
  }
}