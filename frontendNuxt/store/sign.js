const state = () => ({
  errorMessage: ''
});

const getters = {

};

const mutations = {
  setErrorMessage (state, msg) {
    state.errorMessage = msg;
  }
};

const actions = {
  async signIn ({ commit }, userInfo) {
    try {
      const {
        email: loginId,
        password: loginPassword
      } = userInfo;
      const response = await this.$axios.post('http://localhost:8050/api/users/login', { loginId, loginPassword });
      const {
        data: {
          result,
          msg: responseMessage,
          token
        }
      } = response;

      if (result) {
        commit('setUserInfo', { userEmail: userInfo.email, userToken: token }, { root: true });
        commit('setErrorMessage', '');
      } else {
        commit('setErrorMessage', responseMessage);
      }
    } catch (e) {
      commit('setErrorMessage', e);
    }
  },
  async signUp ({ commit }, userInfo) {
    try {
      const {
        email: loginId, password, passwordCheck: chkPassword
      } = userInfo;
      const response = await this.$axios.post('http://localhost:8050/api/users/join', { loginId, password, chkPassword });
      const {
        data: {
          result,
          msg: responseMessage
        }
      } = response;
      if (!result) {
        throw new Error(responseMessage);
      }
      commit('setErrorMessage', '');
    } catch (e) {
      commit('setErrorMessage', e);
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
