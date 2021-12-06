<template>
  <main class="form-signin">
    <form @submit.prevent="handleSubmit">
      <h1 class="h3 mb-3 fw-normal">Join</h1>
      <h3 class="mb-3 errorMsg">{{ errorMessage }}</h3>
      <div class="form-floating">
        <input id="floatingInput" v-model="email" class="form-control" type="email" name="loginId" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input id="floatingPassword" v-model="password" class="form-control" type="password" name="password" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>
      <div class="form-floating">
        <input id="floatingPassword2" v-model="passwordCheck" class="form-control" type="password" name="chkPassword" placeholder="Check Password">
        <label for="floatingPassword2">Check Password</label>
      </div>
      <button class="w-100 btn btn-lg btn-primary signBtn" type="submit">Submit</button>
    </form>
    <NuxtLink id="login" tag="button" to="/login" class="w-100 btn btn-lg btn-primary signBtn" type="button">Login</NuxtLink>
    <p class="mt-5 mb-3 text-muted">&copy; 2021&ndash;2021</p>
  </main>
</template>

<script>
export default {
  layout: 'sign',
  data () {
    return {
      email: '',
      password: '',
      passwordCheck: ''
    };
  },
  computed: {
    errorMessage () {
      return this.$store.state.sign.errorMessage;
    }
  },
  watch: {
    errorMessage (newValue) {
      if (newValue === '') {
        this.$router.push('/login');
      }
    }
  },
  methods: {
    async handleSubmit () {
      await this.$store.dispatch('sign/signUp', {
        email: this.email,
        password: this.password,
        passwordCheck: this.passwordCheck
      });
    }
  }
};
</script>
