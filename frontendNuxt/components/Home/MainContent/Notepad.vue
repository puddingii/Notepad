<template>
  <div class="container childContainer">
    <NotepadHeader :open-tab-list="openTabList" :note-list="noteList" @addOpenTab="addOpenTab" />
    <br>
    <NotepadBody :note-content="currentNoteInfo" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import NotepadHeader from '~/components/Home/MainContent/NotepadHeader';
import NotepadBody from '~/components/Home/MainContent/NotepadBody';

const { mapState, mapGetters } = createNamespacedHelpers('note');

export default {
  components: {
    NotepadHeader,
    NotepadBody
  },
  computed: {
    ...mapState([
      'noteList',
      'openTabList'
    ]),
    ...mapGetters([
      'currentNoteInfo'
    ])
  },
  methods: {
    addOpenTab (noteTitle) {
      const isExisting = this.openTabList.includes(noteTitle);
      if (!isExisting) {
        this.$store.commit('note/addOpenTab', noteTitle);
      }
    },
    updateBody (noteTitle) {
      this.$store.commit('note/updateBody', noteTitle);
    }
  }
};
</script>

<style scoped>
.childContainer {
  margin-top: 30px;
  padding: 20px 30px !important;
  border: 0.5px solid rgb(67, 104, 173);
  border-radius: 1%;
}

.disNone {
  display: none !important;
}

</style>
