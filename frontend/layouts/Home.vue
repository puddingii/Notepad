<template>
  <div class="row align-items-md-stretch">
    <div class="col col-2 leftCard">
      <UserStatus :email="email" />
    </div>
    <div class="col col-9 rightMain">
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

<style scoped>
.leftCard {
  min-width: 191px;
  max-width: 230px;
  height: 734px;
  margin-left: 30px;
  word-break:break-all;
}
.rightMain {
  max-width: 1120px;
}
</style>
