export default function ({ store, redirect }) {
  if (store.state.user.userToken !== '') {
    redirect('/');
  }
};
