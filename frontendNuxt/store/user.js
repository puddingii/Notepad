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
  getSystemMessage: state => state.systemMessage,
  isLoggedIn: state => state.token !== ''
};

const mutations = {
  SET_USER_INFO (state, userInfo = { email: '', token: '' }) {
    const { email, token } = userInfo;
    state.email = email;
    state.token = token;
  },
  SET_SYSTEM_MESSAGE (state, msg = '') {
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
      commit('SET_USER_INFO', { email: userInfo.email, token });
      commit('SET_SYSTEM_MESSAGE');

      return result;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e);
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
      commit('SET_SYSTEM_MESSAGE');
      return result;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e);
    }
  },
  async logout ({ commit, state }) {
    try {
      const response = await this.$axios.post('http://localhost:8050/api/users/logout', { email: state.email });
      if (response.status === 201) {
        commit('SET_USER_INFO');
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
          commit('SET_SYSTEM_MESSAGE');
        }
      });
    } catch (e) {
      if (e.message === 'JWT Session Verify Error') {
        await this.$axios.post('http://localhost:8050/api/users/logout', state.email);
      }
      commit('SET_SYSTEM_MESSAGE', e.message);
      commit('SET_USER_INFO');
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
