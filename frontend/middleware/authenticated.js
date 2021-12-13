export default async function ({ store, redirect, app }) {
  const response = await store.dispatch('user/checkLoginStatus', app.$cookies.get('userInfo'));
  if (!response) {
    redirect('/login');
  }

  if (response.decoded.email === app.$cookies.get('userInfo').email) {
    store.commit('user/SET_USER_INFO', { email: response.decoded.email, token: app.$cookies.get('userInfo').token });
  }
};
