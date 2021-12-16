<template>
  <section class="notepad">
    <div v-if="currentNoteInfo !== null" id="noteFormDiv" class="form-floating">
      <textarea id="textareaForm" v-model="textareaValue" class="form-control" />
      <label id="textareaLabel">{{ isSaved ? '저장됨.' : '저장 안됨.' }}</label>
      <div id="btnGroup">
        <button id="save" type="button" class="btn btn-outline-primary" @click="onSaveClick">Save</button>
        <button id="saveAs" type="button" class="btn btn-outline-primary" @click="onSaveAsClick">SaveAs</button>
        <button id="delete" type="button" class="btn btn-outline-danger" @click="onRemoveClick">Delete</button>
        <button id="close" type="button" class="btn btn-outline-danger" @click="onCloseClick">Close</button>
        <input id="saveAsInput" v-model="saveAsInput" placeholder="Input saveas title" type="text" class="form-control">
      </div>
      <p class="systemMessage">{{ systemMessage }}</p>
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('note');

export default {
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
      beforeNoteId: this.$store.getters['note/getCurrentNoteId'],
      saveAsInput: ''
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
    this.$nuxt.$on('saveTextareaInfo', () => {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved });
    });
    this.$nuxt.$on('updateTextareaInfo', (info) => {
      if (info) {
        this.textareaValue = info.content;
        this.isSaved = info.isSaved;
      }
      this.textareaValue = this.$store.getters['note/getCurrentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
    });
  },
  methods: {
    onCloseClick () {
      this.$store.dispatch('note/closeNote', { content: this.textareaValue, isSaved: this.isSaved });
    },
    async onRemoveClick () {
      await this.$store.dispatch('note/removeNote');
    },
    async onSaveClick () {
      const { isSucceed } = await this.$store.dispatch('note/updateTextarea', this.textareaValue);
      if (isSucceed) {
        this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
      }
    },
    async onSaveAsClick () {
      if (this.saveAsInput === '') {
        this.$store.commit('note/SET_SYSTEM_MESSAGE', 'SaveAs Title is empty!');
        return;
      }

      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // saveAs 하기전 기존거 array에 저장
      const { isSucceed } = await this.$store.dispatch('note/createNewTextarea', { title: this.saveAsInput, content: this.textareaValue, email: this.$store.getters['user/getEmail'] });
      if (isSucceed) {
        this.isSaved = true;
        this.saveAsInput = '';
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

input#difBtn {
  width: 200px;
}
</style>
