<template>
  <div class="row align-items-md-stretch">
    <div class="col col-md-2 leftCard">
      <UserStatus :email="email" />
      <Chat />
    </div>
    <div class="col col-md-9">
      <Notepad />
    </div>
  </div>
</template>

<script>
import UserStatus from '~/components/Home/LeftBar/UserStatus';
import Chat from '~/components/Home/LeftBar/Chat';
import Notepad from '~/components/Home/MainContent/Notepad';
// import Notepadtest from '~/components/Home/MainContent/Notepadtest';

export default {
  components: {
    UserStatus,
    Chat,
    Notepad
    // Notepadtest
  },
  layout: 'Home',
  middleware: ['authenticated'],
  asyncData ({ store }) {
    store.dispatch('note/loadAll', store.getters['user/getEmail']);
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
  },
  computed: {
    email () {
      return this.$store.getters['user/getEmail'];
    }
  },
  methods: {

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
