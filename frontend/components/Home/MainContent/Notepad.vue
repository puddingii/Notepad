<template>
  <div class="container childContainer">
    <NotepadHeader
      :open-tab-list="openTabList"
      :note-list="noteList"
      :current-note-info="currentNoteInfo"
      @addOpenTab="addOpenTab"
      @handleLoadClick="handleLoadClick"
      @setCurrentNoteId="setCurrentNoteId"
    />
    <br>
    <NotepadBody
      :current-note-info="currentNoteInfo"
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
    addOpenTab (noteTitle) {
      const isExisting = this.openTabList.includes(noteTitle);
      if (!isExisting) {
        this.$store.commit('note/ADD_OPEN_TAB', noteTitle);
      }
    },
    updateBody (noteTitle) {
      this.$store.commit('note/updateBody', noteTitle);
    },
    handleLoadClick (title) {
      const isExisting = this.openTabList.includes(title);
      if (!isExisting) {
        this.$store.commit('note/ADD_OPEN_TAB', title); // 탭에 없으면 추가
      }
    },
    setCurrentNoteId (title) {
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { title }); // 현재 가르키고 있는 Notepad update
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
