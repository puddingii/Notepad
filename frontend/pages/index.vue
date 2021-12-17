<template>
  <Notepad />
</template>

<script>
import Notepad from '~/components/Home/MainContent/Notepad';

export default {
  components: {
    Notepad
  },
  layout: 'Home',
  middleware: ['authenticated'],
  async asyncData ({ store }) {
    await store.dispatch('note/loadAll', store.getters['user/getEmail']);
    if (process.server) {
      console.log('server');
    }
    if (process.client) {
      console.log('client');
    }
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
