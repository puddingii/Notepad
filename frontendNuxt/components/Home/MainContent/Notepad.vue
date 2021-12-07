<template>
  <div class="container childContainer">
    <NotepadHeader :open-tab-list="openTabList" :note-list="noteList" />
    <br>
    <NotepadBody :note-content="currentNoteInfo" />
  </div>
</template>

<script>
import NotepadHeader from '~/components/Home/MainContent/NotepadHeader';
import NotepadBody from '~/components/Home/MainContent/NotepadBody';

export default {
  components: {
    NotepadHeader,
    NotepadBody
  },
  computed: {
    noteList () {
      return this.$store.state.note.noteList;
    },
    openTabList () {
      return this.$store.state.note.openTabList;
    },
    currentNoteInfo () {
      return this.$store.state.note.noteList.find(element => element.id === this.$store.state.note.currentNoteId);
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
