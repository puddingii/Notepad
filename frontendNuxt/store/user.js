import jwt from 'jsonwebtoken';

const state = () => ({
  userEmail: '',
  userToken: '',
  systemMessage: ''
});

const getters = {
  isLoggedIn: state => state.userToken !== ''
};

const mutations = {
  setUserInfo (state, userInfo = { userEmail: '', userToken: '' }) {
    const { userEmail, userToken } = userInfo;
    state.userEmail = userEmail;
    state.userToken = userToken;
  },
  setSystemMessage (state, msg = '') {
    state.systemMessage = msg;
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
        commit('setUserInfo', { userEmail: userInfo.email, userToken: token });
        commit('setSystemMessage');
      } else {
        commit('setSystemMessage', responseMessage);
      }
      return result;
    } catch (e) {
      commit('setSystemMessage', e);
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
      commit('setSystemMessage');
    } catch (e) {
      commit('setSystemMessage', e);
    }
  },
  async checkLoginStatus ({ commit, state }) {
    try {
      if (!state.userToken) {
        throw new Error('Token is not existing');
      }
      const response = await this.$axios.post('http://localhost:8050/api/users/loginStatus', { email: state.userEmail });
      const {
        data: { loginStatus }
      } = response;

      if (loginStatus !== state.userToken) {
        throw new Error('Log out another browser');
      }

      jwt.verify(state.userToken, 'jwtlksajdfjk343irjofii90', (err, decoded) => {
        if (err) {
          throw new Error('JWT Session Verify Error');
        }
        if (decoded) {
          commit('setSystemMessage');
        }
      });
    } catch (e) {
      if (e.message === 'JWT Session Verify Error') {
        await this.$axios.post('http://localhost:8050/api/users/logout', state.userEmail);
      }
      commit('setSystemMessage', e.message);
      commit('setUserInfo');
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
