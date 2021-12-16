<template>
  <div class="card userInfo">
    <p>Current id :</p>
    <p id="currentUserId" class="card-text">{{ email }}</p>
    <button id="logout" class="btn btn-danger" type="button" @click="handleLogout">Log out</button>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  methods: {
    async handleLogout () {
      const saveResponse = await this.$store.dispatch('note/saveNoteListStatus', this.email);
      if (!saveResponse.isSucceed) {
        return;
      }
      const isSucceed = await this.$store.dispatch('user/logout');
      if (isSucceed) {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.card {
  align-items: center;
}
.card-text {
  font-weight: bold;
}
.userInfo {
  margin-top: 30px !important;
  height: 145px;
  padding: 5px;
}
</style>
