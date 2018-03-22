export default {
  CREATE_ACCOUNT (state, payload) {
    state.accounts.accounts = payload.accounts;
  },
  IS_LOADING (state, payload) {
    state.accounts.loading = payload;
  },
};
