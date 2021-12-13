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
            @show="resetNewTitleModal"
            @hidden="resetNewTitleModal"
            @ok.prevent="handleNewButtonClick"
          >
            <form ref="form" @submit.stop.prevent="handleNewButtonClick">
              <b-form-input id="newNoteTitle-input" v-model="newNoteTitle" required />
            </form>
          </b-modal>
          <button id="shareButton" class="btn btn-primary" type="button">Share</button>
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
                @click="handleLoadItemClick(note.title)"
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
            class="nav-link notelink"
            :data-currentid="getId(text)"
            @click="handleListItemClick(text)"
          >
            {{ text }}
          </a>
        </li>
      </ul>
    </header>
    <br>
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
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DataManageButtons from '~/components/Home/MainContent/ButtonGroup/DataManageButtons';
const { mapState } = createNamespacedHelpers('note');

export default {
  components: {
    DataManageButtons
  },
  data () {
    return {
      isSaved: this.$store.getters['note/getCurrentNoteInfo'].isSaved,
      textareaValue: this.$store.getters['note/getCurrentNoteInfo'].content,
      beforeNoteId: this.$store.getters['note/getCurrentNoteId'],
      newNoteTitle: ''
    };
  },
  computed: {
    ...mapState([
      'noteList',
      'openTabList',
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
  beforeDestroy () {
    this.$store.dispatch('note/saveNoteListStatus');
  },
  methods: {
    getId (text = '') {
      const note = this.noteList.find(note => note.title === text);
      return note ? note.id : false;
    },
    handleLoadItemClick (noteTitle) {
      const isExisting = this.openTabList.includes(noteTitle);
      if (!isExisting) {
        this.$store.commit('note/ADD_OPEN_TAB', noteTitle); // 탭에 없으면 추가
      }
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // textarea 기록 저장
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { title: noteTitle }); // 현재 가르키고 있는 Notepad update
      this.textareaValue = this.$store.getters['note/getCurrentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
    },
    handleListItemClick (noteTitle) {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // textarea 기록 저장
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { title: noteTitle }); // 현재 가르키고 있는 Notepad update
      this.textareaValue = this.$store.getters['note/getCurrentNoteInfo'].content; // 가르키고 있는 Notepad가 변경되었으므로 textarea 변경
      this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
    },
    async handleNewButtonClick () {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // textarea 기록 저장
      const isSucceed = await this.$store.dispatch('note/saveAsTextarea', { title: this.newNoteTitle, content: '' });
      if (isSucceed) {
        this.textareaValue = '';
        this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
        this.$nextTick(() => {
          this.$bvModal.hide('newNoteTitleModal');
        });
      }
    },
    async saveTextarea () {
      const isSucceed = await this.$store.dispatch('note/saveTextarea', this.textareaValue);
      if (isSucceed) {
        this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
      }
    },
    async saveAsTextarea (saveAsInput) {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved }); // saveAs 하기전 기존거 array에 저장
      const isSucceed = await this.$store.dispatch('note/saveAsTextarea', { title: saveAsInput, content: this.textareaValue });
      if (isSucceed) {
        this.isSaved = this.$store.getters['note/getCurrentNoteInfo'].isSaved;
      }
    },
    async deleteTextarea () {
      await this.$store.dispatch('note/deleteNote');
    },
    closeNote () {
      this.$store.commit('note/SET_TEXTAREA', { content: this.textareaValue, isSaved: this.isSaved });
      this.$store.commit('note/REMOVE_OPEN_NOTE', this.$store.getters['note/getCurrentNoteInfo'].title);
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { id: -1 });
    },
    resetNewTitleModal () {
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
.systemMessage {
  font: bold;
  color: red;
}
</style>
