<template>
  <Test />
</template>

<script>
import Notepad from '~/components/Home/MainContent/Notepad';
import Test from '~/components/Home/MainContent/test';

export default {
  components: {
    Notepad,
    Test
  },
  layout: 'Home',
  middleware: ['authenticated'],
  async asyncData ({ store }) {
    await store.dispatch('note/loadAll', store.getters['user/getEmail']);
  },
  head: {
    script: [{
      src: 'https://code.jquery.com/jquery-3.6.0.js'
    }, {
      src: 'https://code.jquery.com/ui/1.13.0/jquery-ui.js'
    }, {
      src: 'https://cdn.socket.io/4.3.2/socket.io.min.js',
      integrity: 'sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs',
      crossorigin: 'anonymous'
    }]
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
</style>
