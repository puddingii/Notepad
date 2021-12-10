<template>
  <div class="card userInfo">
    <p>Current id :</p>
    <p id="currentUserId" class="card-text">{{ userEmail }}</p>
    <button id="logout" class="btn btn-danger" type="button" @click="handleLogout">Log out</button>
  </div>
</template>

<script>
export default {
  props: {
    userEmail: {
      type: String,
      required: true
    }
  },
  methods: {
    async handleLogout () {
      await this.$store.dispatch('note/saveNoteListStatus', this.userEmail);
      const result = await this.$store.dispatch('user/logout');
      if (result) {
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
