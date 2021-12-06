const state = () => ({
  userEmail: 'TEST12@naver.com',
  userToken: ''
});

const getters = {
  isLoggedIn: state => state.userToken !== ''
};

const mutations = {
  setUserInfo (state, userInfo) {
    const { userEmail, userToken } = userInfo;
    state.userEmail = userEmail;
    state.userToken = userToken;
  }
};

const actions = {

};

export {
  state,
  getters,
  mutations,
  actions
};
