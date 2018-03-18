import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const state = {
  accounts: {}
};

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
};
