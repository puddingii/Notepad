<template>
  <div class="card userInfo">
    <p>Current id :</p>
    <p id="currentUserId" class="card-text">{{ userEmail }}</p>
    <button id="logout" class="btn btn-danger" type="button">Log out</button>
  </div>
</template>

<script>
export default {
  props: {
    userEmail: {
      type: String,
      required: true
    }
  }
};
</script>
