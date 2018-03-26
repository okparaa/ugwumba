import * as lib from '@/lib/http';
export default {
    createAccount({state, commit}, payload){
        return lib.XHR.post(payload.url, lib.FDT(payload.data));
    },
    getGetForm({state, commit}, payload){
        return lib.XHR.get(payload.url);
    },
    postGetForm({state, commit}, payload){
        return lib.XHR.post(payload.url, payload.data);
    },
    sendSignedRequest({state, commit}, payload){
        return lib.XHR.post(payload.url, payload.data);
    }
}