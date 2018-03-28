export default {
  IS_LOADING (state, payload) {
    state.accounts.loading = payload;
  },
  SET_CONNECTED (state, payload) {
    state.accounts.connected = payload;
  },
};
