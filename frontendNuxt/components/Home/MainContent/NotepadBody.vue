<template>
  <section class="notepad">
    <div v-if="currentNoteId !== -1" id="noteFormDiv" class="form-floating">
      <textarea id="textareaForm" v-model="textareaValue" class="form-control" />
      <label id="textareaLabel">{{ isSaved ? '저장됨.' : '저장 안됨.' }}</label>
      <DataManageButtons
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
import DataManageButtons from '~/components/Home/MainContent/ButtonGroup/DataManageButtons';
const { mapState } = createNamespacedHelpers('note');

export default {
  components: {
    DataManageButtons
  },
  props: {
  },
  data () {
    return {
      isSaved: this.$store.getters['note/getCurrentNoteInfo']?.isSaved,
      textareaValue: this.$store.getters['note/getCurrentNoteInfo']?.content ?? '',
      beforeNoteId: this.$store.getters['note/getCurrentNoteId']
    };
  },
  computed: {
    ...mapState([
      'currentNoteId',
      'systemMessage'
    ])
  },
  watch: {
    textareaValue (newValue) {
      if (newValue && this.beforeNoteId === this.currentNoteId) {
        this.isSaved = false;
      } else {
        this.beforeNoteId = this.currentNoteId;
      }
    }
  },
  created () {
    this.$nuxt.$on('saveNotepadInfo', () => {
      this.$store.commit('note/setTextarea', { content: this.textareaValue, isSaved: this.isSaved });
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
      this.$store.commit('note/setTextarea', { content: this.textareaValue, isSaved: this.isSaved });
      this.$store.commit('note/deleteOpenNote', this.$store.getters['note/getCurrentNoteInfo'].title);
      this.$store.commit('note/setCurrentNoteId', -1);
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
      this.$store.commit('note/setTextarea', { content: this.textareaValue, isSaved: this.isSaved }); // saveAs 하기전 기존거 array에 저장
      const isSucceed = await this.$store.dispatch('note/saveAsTextarea', { title: saveAsInput, content: this.textareaValue });
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
