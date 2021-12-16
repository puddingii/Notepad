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
  async signIn ({ commit }, loginInfo) {
    try {
      const {
        email: loginId,
        password: loginPassword
      } = loginInfo;
      const response = await this.$axios.post('http://localhost:8050/api/users/login', { loginId, loginPassword });
      const {
        data: {
          isSucceed,
          msg: responseMessage,
          token
        }
      } = response;

      if (!isSucceed) {
        throw new Error(responseMessage);
      }
      const userInfo = { email: loginInfo.email, token };
      commit('SET_USER_INFO', userInfo);
      commit('SET_SYSTEM_MESSAGE');
      this.$cookies.set('userInfo', userInfo, { path: '/' });

      return { isSucceed };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return { isSucceed: false };
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
          isSucceed,
          msg: responseMessage
        }
      } = response;
      if (!isSucceed) {
        throw new Error(responseMessage);
      }
      commit('SET_SYSTEM_MESSAGE');
      return { isSucceed };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e);
      return { isSucceed: false };
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
      return { isSucceed: true, decoded };
    } catch (e) {
      if (e.message === 'JWT Session Verify Error') {
        await this.$axios.post('http://localhost:8050/api/users/logout', userInfo.email);
      }
      commit('SET_SYSTEM_MESSAGE', e.message);
      commit('SET_USER_INFO');
      return { isSucceed: false, msg: e.message };
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
