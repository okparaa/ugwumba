import * as lib from './http';
import Cookie from 'js-cookie';
export default {
  login(payload){ 
    return lib.XHR.post(payload.url, payload.data);   
  },
  fbLogin(payload){ 
    return lib.XHR.post(payload.url, payload.data);   
  },
  logout(){
    this.setToken(null);
    return false;
  },
  getToken(){
    return Cookie.get('token');
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
  removeItem(token = null){
    if (token) {
      Cookie.remove('token', token);
    } else {
      Cookie.remove('token');
    }
  },
  setItem(name, value){
    Cookie.set(name, value);
  },
  getItem(name){
    return Cookie.get(name);
  }
}