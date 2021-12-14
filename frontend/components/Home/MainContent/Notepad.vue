<template>
  <div class="container childContainer">
    <NotepadHeader
      :open-tab-list="openTabList"
      :note-list="noteList"
      :current-note-info="currentNoteInfo"
      @addOpenTab="addOpenTab"
      @handleLoadClick="handleLoadClick"
      @setCurrentNoteId="setCurrentNoteId"
      @setSystemMessage="setSystemMessage"
      @handleNewNote="handleNewNote"
    />
    <br>
    <NotepadBody
      :current-note-info="currentNoteInfo"
      @setCurrentNoteId="setCurrentNoteId"
      @removeOpenNote="removeOpenNote"
      @setSystemMessage="setSystemMessage"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import NotepadHeader from '~/components/Home/MainContent/NotepadHeader';
import NotepadBody from '~/components/Home/MainContent/NotepadBody';

const { mapGetters } = createNamespacedHelpers('note');

export default {
  components: {
    NotepadHeader,
    NotepadBody
  },
  computed: {
    ...mapGetters({
      noteList: 'getNoteList',
      openTabList: 'getOpenTabList',
      currentNoteInfo: 'getCurrentNoteInfo'
    })
  },
  methods: {
    addOpenTab (title) {
      const isExisting = this.openTabList.includes(title);
      if (!isExisting) {
        this.$store.commit('note/ADD_OPEN_TAB', title);
      }
    },
    handleLoadClick (title) {
      const isExisting = this.openTabList.includes(title);
      if (!isExisting) {
        this.$store.commit('note/ADD_OPEN_TAB', title); // 탭에 없으면 추가
      }
    },
    setCurrentNoteId (noteInfo) {
      this.$store.commit('note/SET_CURRENT_NOTE_ID', noteInfo); // 현재 가르키고 있는 Notepad update
    },
    setSystemMessage (message) {
      this.$store.commit('note/SET_SYSTEM_MESSAGE', message);
    },
    removeOpenNote () {
      this.$store.commit('note/REMOVE_OPEN_NOTE', this.currentNoteInfo.title);
    },
    handleNewNote (note) {
      this.$store.commit('note/ADD_NOTE', note);
      this.$store.commit('note/ADD_OPEN_TAB', note.title);
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { id: note.id });
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
