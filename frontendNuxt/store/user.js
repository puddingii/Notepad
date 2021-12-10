import jwt from 'jsonwebtoken';
// @ts-ignore
import ENV from '@/env';

const state = () => ({
  email: '',
  token: '',
  systemMessage: ''
});

const getters = {
  getEmail: state => state.email,
  getToken: state => state.token,
  getSystemMessage: state => state.systemMessage,
  isLoggedIn: state => state.token !== ''
};

const mutations = {
  setUserInfo (state, userInfo = { email: '', token: '' }) {
    const { email, token } = userInfo;
    state.email = email;
    state.token = token;
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

      if (!result) {
        throw new Error(responseMessage);
      }
      commit('setUserInfo', { email: userInfo.email, token });
      commit('setSystemMessage');

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
      return result;
    } catch (e) {
      commit('setSystemMessage', e);
    }
  },
  async logout ({ commit, state }) {
    try {
      const response = await this.$axios.post('http://localhost:8050/api/users/logout', { email: state.email });
      if (response.status === 201) {
        commit('setUserInfo');
      }
      return response;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async checkLoginStatus ({ commit, state }) {
    try {
      if (!state.token) {
        throw new Error('Token is not existing');
      }
      const response = await this.$axios.post('http://localhost:8050/api/users/loginStatus', { email: state.email });
      const {
        data: { loginStatus }
      } = response;

      if (loginStatus !== state.token) {
        throw new Error('Log out another browser');
      }
      jwt.verify(state.token, ENV.JWT_SECRET, (err, decoded) => {
        if (err) {
          throw new Error('JWT Session Verify Error');
        }
        if (decoded) {
          commit('setSystemMessage');
        }
      });
    } catch (e) {
      if (e.message === 'JWT Session Verify Error') {
        await this.$axios.post('http://localhost:8050/api/users/logout', state.email);
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
