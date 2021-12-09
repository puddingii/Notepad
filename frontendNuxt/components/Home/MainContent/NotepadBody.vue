<template>
  <section class="notepad">
    <div v-if="currentNoteId !== -1" id="noteFormDiv" class="form-floating">
      <textarea id="textareaForm" v-model="textareaValue" class="form-control" />
      <label id="textareaLabel">{{ isSaved ? '저장됨.' : '저장 안됨.' }}</label>
      <DataManageButtons
        @save="saveTextarea"
        @saveas="saveAsTextarea"
        @delete="deleteTextarea"
        @close="closeNote"
      />
      <p class="systemMessage">{{ systemMessage }}</p>
    </div>
  </section>
</template>

<script>
import DataManageButtons from '~/components/Home/MainContent/ButtonGroup/DataManageButtons';

export default {
  components: {
    DataManageButtons
  },
  props: {
    noteContent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isSaved: this.$store.getters['note/currentNoteInfo'].isSaved,
      textareaValue: this.$store.getters['note/currentNoteInfo'].content
    };
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
      this.textareaValue = this.$store.getters['note/currentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/currentNoteInfo'].isSaved;
    });
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

input#difBtn {
  width: 200px;
}

.systemMessage {
  font: bold;
  color: red;
}
</style>
