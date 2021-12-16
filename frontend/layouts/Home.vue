<template>
  <div class="row align-items-md-stretch">
    <div class="col col-md-2 leftCard">
      <UserStatus :email="email" />
    </div>
    <div class="col col-md-9">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import UserStatus from '~/components/Home/LeftBar/UserStatus';

export default {
  name: 'Home',
  components: {
    UserStatus
  },
  computed: {
    email () {
      return this.$store.getters['user/getEmail'];
    }
  }
};
</script>

<style>
html, body, #__nuxt, #__layout, main {
  height: 100%;
}
</style>
