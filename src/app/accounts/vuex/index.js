import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const state = {
  accounts: {
    loading: false,
    connected: false
  }
};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
};
