<template>
  <Nuxt />
</template>

<script>
export default {
  name: 'Sign',
  head () {
    return {
      bodyAttrs: {
        class: 'text-center sign'
      }
    };
  }
};
</script>

<style>
.sign {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  margin: 0 auto;
}
</style>
