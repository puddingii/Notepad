export default async function ({ store, redirect }) {
  await store.dispatch('user/checkLoginStatus');

  if (store.state.user.systemMessage !== '') {
    redirect('/login');
  }
};
