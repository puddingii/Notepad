import jwt from 'jsonwebtoken';
// @ts-ignore
import ENV from '@/env';

/** @returns {ifStore.User.State}  */
const state = () => ({
  email: '',
  token: '',
  systemMessage: ''
});

/** @type {ifStore.User.Getters}  */
const getters = {
  getEmail: state => state.email,
  getSystemMessage: state => state.systemMessage,
  isLoggedIn: state => state.token !== ''
};

/** @type {ifStore.User.Mutations}  */
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

/** @type {ifStore.User.Actions}  */
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
      const userSettings = { email: userInfo.email, token };
      commit('SET_USER_INFO', { email: userInfo.email, token });
      commit('SET_SYSTEM_MESSAGE');
      this.$cookies.set('userInfo', userSettings, { path: '/' });

      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e);
      return false;
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
      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e);
      return false;
    }
  },
  async logout ({ commit, state }) {
    try {
      const response = await this.$axios.post('http://localhost:8050/api/users/logout', { email: state.email });
      if (response.status !== 201) {
        throw new Error('Logout failed');
      }
      commit('SET_USER_INFO');
      commit('SET_SYSTEM_MESSAGE');
      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      console.log(e);
      return false;
    }
  },
  async checkLoginStatus ({ commit }, userInfo) {
    try {
      if (!userInfo.token) {
        throw new Error('Token is not existing');
      }

      const response = await this.$axios.post('http://localhost:8050/api/users/loginStatus', { email: userInfo.email });
      const {
        data: { loginStatus }
      } = response;
      if (loginStatus !== userInfo.token) {
        throw new Error('Log out another browser');
      }

      const decoded = await jwt.verify(userInfo.token, ENV.JWT_SECRET);
      if (!decoded) {
        throw new Error('JWT Session Verify Error');
      }

      commit('SET_SYSTEM_MESSAGE');
      return { result: true, decoded };
    } catch (e) {
      if (e.message === 'JWT Session Verify Error') {
        await this.$axios.post('http://localhost:8050/api/users/logout', userInfo.email);
      }
      commit('SET_SYSTEM_MESSAGE', e.message);
      commit('SET_USER_INFO');
      return false;
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
