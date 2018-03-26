import * as lib from '@/lib/http';
export default {
    storeFbProfile({state, commit}, payload){
        commit('SAVE_FB_PROFILE', payload);
    }
}