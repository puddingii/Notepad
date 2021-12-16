<template>
  <div class="container childContainer">
    <header>
      <ul id="navContainer" class="nav nav-tabs sortable">
        <div class="dropdown">
          <b-button
            id="newButton"
            v-b-modal.newNoteTitleModal
            variant="primary"
            class="btn btn-primary"
            type="button"
          >
            New File
          </b-button>
          <b-modal
            id="newNoteTitleModal"
            title="New Note Title"
            @show="resetNewButtonModal"
            @hidden="resetNewButtonModal"
            @ok.prevent="onNewClick"
          >
            <form ref="form" @submit.stop.prevent="onNewClick">
              <b-form-input id="newNoteTitle-input" v-model="newNoteTitle" required />
            </form>
          </b-modal>
          <button
            id="ddButton"
            class="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Load
          </button>
          <ul id="dropdownMenu" class="dropdown-menu" aria-labelledby="ddButton">
            <li v-for="note in noteList" :key="note.id" :data-current-id="note.id">
              <a
                href="#"
                :data-currentid="note.id"
                class="dropdown-item"
                @click="onLoadClick(note.title)"
              >
                {{ note.title }}
              </a>
            </li>
          </ul>
        </div>
        <li
          v-for="(text, index) in openTabList"
          :id="`noteList${getId(text)}`"
          :key="index"
          class="nav-item notetab"
        >
          <a
            :id="`noteId${getId(text)}`"
            href="#"
            :class="currentNoteInfo ? (currentNoteInfo.title === text ? 'active' : '') : ''"
            class="nav-link notelink"
            :data-currentid="getId(text)"
            @click="onOpenTitleClick(text)"
          >
            {{ text }}
          </a>
        </li>
      </ul>
    </header>
    <br>
    <section class="notepad">
      <div v-if="currentNoteInfo !== null" id="noteFormDiv" class="form-floating">
        <textarea id="textareaForm" v-model="textareaValue" class="form-control" />
        <label id="textareaLabel">{{ isSaved ? '저장됨.' : '저장 안됨.' }}</label>
        <div id="btnGroup">
          <button id="save" type="button" class="btn btn-outline-primary" @click="handleClickSave">Save</button>
          <button id="saveAs" type="button" class="btn btn-outline-primary" @click="handleClickSaveAs">SaveAs</button>
          <button id="delete" type="button" class="btn btn-outline-danger" @click="handleClickRemove">Delete</button>
          <button id="close" type="button" class="btn btn-outline-danger" @click="handleClickClose">Close</button>
          <input id="saveAsInput" v-model="saveAsInput" placeholder="Input saveas title" type="text" class="form-control">
        </div>
        <p class="systemMessage">{{ systemMessage }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('note');

export default {
  data () {
    return {
      isSaved: this.$store.getters['note/getCurrentNoteInfo']?.isSaved,
      textareaValue: this.$store.getters['note/getCurrentNoteInfo']?.content ?? '',
      beforeNoteId: this.$store.getters['note/getCurrentNoteId'],
      saveAsInput: '',
      newNoteTitle: ''
    };
  },
  computed: {
    ...mapGetters({
      noteList: 'getNoteList',
      openTabList: 'getOpenTabList',
      currentNoteInfo: 'getCurrentNoteInfo',
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
  methods: {
    handleClickClose () {
      this.$store.dispatch('note/closeNote', { content: this.textareaValue, isSaved: this.isSaved });
    },
    async handleClickRemove () {
      await this.$store.dispatch('note/removeNote');
    },
    async handleClickSave () {
      const { isSucceed } = await this.$store.dispatch('note/updateTextarea', this.textareaValue);
      if (isSucceed) {
        this.isSaved = this.currentNoteInfo.isSaved;
      }
    },
    async handleClickSaveAs () {
      const { isSucceed } = await this.$store.dispatch('note/createSaveAsNote', {
        saveAsInput: this.saveAsInput,
        content: this.textareaValue,
        isSaved: this.isSaved,
        email: this.$store.getters['user/getEmail']
      });
      if (isSucceed) {
        this.isSaved = true;
        this.saveAsInput = '';
      }
    },

    getId (text = '') {
      const note = this.noteList.find(note => note.title === text);
      return note ? note.id : false;
    },
    onLoadClick (title) {
      this.$store.dispatch('note/changeNote', { content: this.textareaValue, isSaved: this.isSaved, title });
      this.textareaValue = this.currentNoteInfo.content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.currentNoteInfo.isSaved;// 가르키고 있는 노트를 업데이트 했으므로 textarea도 업데이트 해야함.
    },
    async onNewClick () {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // textarea 기록 저장
      const { isSucceed } = await this.$store.dispatch('note/createNewTextarea', { title: this.newNoteTitle, content: '', email: this.$store.getters['user/getEmail'] });
      if (!isSucceed) {
        return;
      }
      this.textareaValue = '';
      this.isSaved = true;
      this.$nextTick(() => {
        this.$bvModal.hide('newNoteTitleModal');
      });
    },
    onOpenTitleClick (title) {
      this.$store.dispatch('note/changeNote', { content: this.textareaValue, isSaved: this.isSaved, title });
      this.textareaValue = this.currentNoteInfo.content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.currentNoteInfo.isSaved;
    },
    resetNewButtonModal () {
      this.newNoteTitle = '';
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

li {
  list-style-type: none;
}

</style>
