<template>
  <div class="container childContainer">
    <NotepadHeader
      :open-tab-list="openTabList"
      :note-list="noteList"
      :current-note-info="currentNoteInfo"
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
