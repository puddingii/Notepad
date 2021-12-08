<template>
  <div class="container childContainer">
    <header>
      <ul id="navContainer" class="nav nav-tabs sortable">
        <div class="dropdown">
          <button id="newButton" class="btn btn-primary" type="button">New File</button>
          <button id="shareButton" class="btn btn-primary" type="button">Share</button>
          <button id="ddButton" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Load</button>
          <ul id="dropdownMenu" class="dropdown-menu" aria-labelledby="ddButton">
            <li v-for="note in noteList" :key="note.id" :data-current-id="note.id">
              <a href="#" :data-currentid="note.id" class="dropdown-item" @click="handleLoadItemClick(note.title)">{{ note.title }}</a>
            </li>
          </ul>
        </div>
        <li v-for="(text, index) in openTabList" :id="`noteList${getId(text)}`" :key="index" class="nav-item notetab">
          <a :id="`noteId${getId(text)}`" href="#" class="nav-link notelink" :data-currentid="getId(text)" @click="handleListItemClick(text)">{{ text }}</a>
        </li>
      </ul>
    </header>
    <br>
    <section class="notepad">
      <div id="noteFormDiv" class="form-floating">
        <textarea id="textareaForm" v-model="textareaValue" class="form-control" />
        <label id="textareaLabel">{{ isSaved ? '저장됨.' : '저장 안됨.' }}</label>
        <div id="btnGroup">
          <button id="save" type="button" class="btn btn-outline-primary">save</button>
          <button id="saveAs" type="button" class="btn btn-outline-primary">saveAs</button>
          <button id="delete" type="button" class="btn btn-outline-danger">delete</button>
          <button id="close" type="button" class="btn btn-outline-danger">close</button>
          <input id="saveAsInput" type="text" class="form-control">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapState } = createNamespacedHelpers('note');

export default {
  data () {
    return {
      isSaved: this.$store.getters['note/currentNoteInfo'].isSaved,
      textareaValue: this.$store.getters['note/currentNoteInfo'].content,
      beforeNoteId: this.$store.state.note.currentNoteId
    };
  },
  computed: {
    ...mapState([
      'noteList',
      'openTabList',
      'currentNoteId'
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
  methods: {
    getId (text) {
      return this.noteList.find(note => note.title === text).id;
    },
    handleLoadItemClick (noteTitle) {
      const isExisting = this.openTabList.includes(noteTitle);
      if (!isExisting) {
        this.$store.commit('note/addOpenTab', noteTitle); // 탭에 없으면 추가
      }
      this.$store.commit('note/saveTextarea', { content: this.textareaValue, isSaved: this.isSaved }); // textarea 기록 저장
      this.$store.commit('note/setCurrentNoteId', noteTitle); // 현재 가르키고 있는 Notepad update
      this.textareaValue = this.$store.getters['note/currentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/currentNoteInfo'].isSaved;
    },
    handleListItemClick (noteTitle) {
      this.$store.commit('note/saveTextarea', { content: this.textareaValue, isSaved: this.isSaved }); // textarea 기록 저장
      this.$store.commit('note/setCurrentNoteId', noteTitle); // 현재 가르키고 있는 Notepad update
      this.textareaValue = this.$store.getters['note/currentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/currentNoteInfo'].isSaved;
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

li {
  list-style-type: none;
}

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
</style>
