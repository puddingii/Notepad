<template>
  <div class="row align-items-md-stretch">
    <div class="col col-md-2 leftCard">
      <UserStatus :email="email" />
    </div>
    <div class="col col-md-9">
      <Notepad />
    </div>
  </div>
</template>

<script>
import UserStatus from '~/components/Home/LeftBar/UserStatus';
import Notepad from '~/components/Home/MainContent/Notepad';

export default {
  components: {
    UserStatus,
    Notepad
  },
  layout: 'Home',
  middleware: ['authenticated'],
  async asyncData ({ store }) {
    const response = await store.dispatch('note/loadAll', store.getters['user/getEmail']);
    const {
      result, msg, noteList, endTitle, openTab
    } = response;
    if (result) {
      store.commit('note/INIT_NOTE_LIST', noteList);
      store.commit('note/SET_CURRENT_NOTE_ID', { title: endTitle });
      store.commit('note/INIT_OPENTAB_LIST', openTab);
    } else {
      store.commit('note/SET_SYSTEM_MESSAGE', msg);
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
</style>
