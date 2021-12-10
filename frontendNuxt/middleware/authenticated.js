export default async function ({ store, redirect }) {
  await store.dispatch('user/checkLoginStatus');

  if (store.getters['user/getSystemMessage'] !== '') {
    redirect('/login');
  }
};
