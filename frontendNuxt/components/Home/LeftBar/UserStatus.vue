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
      const result = await this.$store.dispatch('user/logout');
      if (result) {
        this.$router.push('/login');
      }
    }
  }
};
</script>
