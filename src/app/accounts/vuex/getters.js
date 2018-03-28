export default {
    getConnected(state, getters){
        return state.accounts.connected;
    },
    getLoading(state, getters){
        return state.accounts.loading;
    }  
};
