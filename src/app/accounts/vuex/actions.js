import * as lib from '@/lib/http';
export default {
    createAccount({state, commit}, payload){
        return lib.XHR.post(payload.url, lib.FDT(payload.data));
    },
    getForm({state, commit}, payload){
        return lib.XHR.get(payload.url);
    }
}