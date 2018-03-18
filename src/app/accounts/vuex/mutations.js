export default {
  CREATE_ACCOUNT (state, payload) {
    state.accounts.accounts = payload.accounts;
  },
};
