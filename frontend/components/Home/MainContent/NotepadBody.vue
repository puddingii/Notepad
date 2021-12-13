<template>
  <section class="notepad">
    <div v-if="currentNoteInfo !== null" id="noteFormDiv" class="form-floating">
      <textarea id="textareaForm" v-model="textareaValue" class="form-control" />
      <label id="textareaLabel">{{ isSaved ? '저장됨.' : '저장 안됨.' }}</label>
      <NoteControlButtons
        @save="handleSaveButton"
        @saveas="handleSaveAsButton"
        @delete="handleDeleteButton"
        @close="handleCloseButton"
      />
      <p class="systemMessage">{{ systemMessage }}</p>
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import NoteControlButtons from '~/components/Home/MainContent/NoteControlButtons';
const { mapGetters } = createNamespacedHelpers('note');

export default {
  components: {
    NoteControlButtons
  },
  props: {
    currentNoteInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isSaved: this.$store.getters['note/getCurrentNoteInfo']?.isSaved,
      textareaValue: this.$store.getters['note/getCurrentNoteInfo']?.content ?? '',
      beforeNoteId: this.$store.getters['note/getCurrentNoteId']
    };
  },
  computed: {
    ...mapGetters({
      systemMessage: 'getSystemMessage'
    })
  },
  watch: {
    textareaValue (newValue) {
      if (newValue && this.beforeNoteId === this.currentNoteInfo.id) {
        this.isSaved = false;
      } else {
        this.beforeNoteId = this.currentNoteInfo.id;
      }
    }
  },
  created () {
    this.$nuxt.$on('saveNotepadInfo', () => {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved });
    });
    this.$nuxt.$on('updateNotepadInfo', (info) => {
      if (info) {
        this.textareaValue = info.content;
        this.isSaved = info.isSaved;
      }
      this.textareaValue = this.$store.getters['note/getCurrentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
    });
  },
  methods: {
    handleCloseButton () {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved });
      this.$store.commit('note/REMOVE_OPEN_NOTE', this.$store.getters['note/getCurrentNoteInfo'].title);
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { id: -1 });
    },
    async handleDeleteButton () {
      await this.$store.dispatch('note/deleteNote');
    },
    async handleSaveButton () {
      const isSucceed = await this.$store.dispatch('note/saveTextarea', this.textareaValue);
      if (isSucceed) {
        this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
      }
    },
    async handleSaveAsButton (saveAsInput) {
      if (saveAsInput === '') {
        this.$store.commit('note/SET_SYSTEM_MESSAGE', 'SaveAs Title is empty!');
        return;
      }
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // saveAs 하기전 기존거 array에 저장
      const isSucceed = await this.$store.dispatch('note/saveAsTextarea', { title: saveAsInput, content: this.textareaValue, email: this.$store.getters['user/getEmail'] });
      if (isSucceed) {
        this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
      }
    }
  }
};
</script>

<style scoped>
.form-floating {
  margin-bottom: 10px;
}

.notepad > div > textarea {
  height: 500px !important;
}

#btnGroup {
  margin-top: 10px;
}

.systemMessage {
  font: bold;
  color: red;
}
</style>
