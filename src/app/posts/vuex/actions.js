import * as lib from '@/lib/http';
export default {
    create({state, commit}, payload){
        return lib.XHR.post(payload.url, lib.FDT(payload.data));
    },
    imagePost({state, commit}, payload){
        return lib.XHR.post(payload.url, lib.FDT(payload.data), {
            onUploadProgress: uploadEvent => {
                console.log('Upload Progress : ' + Math.round(uploadEvent.loaded/uploadEvent.total) * 100 + '%');
            }
        });
    },
    getUnsaveImages({state, commit}, payload){
        return lib.XHR.get(payload.url);
    }
}