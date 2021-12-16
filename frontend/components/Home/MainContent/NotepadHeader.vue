<template>
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
</template>

<script>
export default {
  props: {
    openTabList: {
      type: Array,
      required: true
    },
    noteList: {
      type: Array,
      required: true
    },
    currentNoteInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      newNoteTitle: ''
    };
  },

  methods: {
    getId (text = '') {
      const note = this.noteList.find(note => note.title === text);
      return note ? note.id : false;
    },
    onLoadClick (title) {
      const isExisting = this.openTabList.includes(title);
      if (!isExisting) {
        this.$store.commit('note/ADD_OPEN_TAB', title); // 탭에 없으면 추가
      }
      this.$nuxt.$emit('saveTextareaInfo'); // 가르키고 있는 notepad update 기록 저장
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { title }); // 현재 가르키고 있는 Notepad update
      this.$nuxt.$emit('updateTextareaInfo'); // 가르키고 있는 노트를 업데이트 했으므로 textarea도 업데이트 해야함.
    },
    async onNewClick () {
      try {
        this.$nuxt.$emit('saveTextareaInfo'); // textarea 기록 저장
        const { isSucceed, msg, note } = await this.$store.dispatch('note/createNewTextarea', { title: this.newNoteTitle, content: '', email: this.$store.getters['user/getEmail'] });
        if (!isSucceed) {
          throw new Error(msg);
        }
        this.$nuxt.$emit('updateTextareaInfo', { content: '', isSaved: note.isSaved });
        this.$nextTick(() => {
          this.$bvModal.hide('newNoteTitleModal');
        });
        this.$store.commit('note/SET_SYSTEM_MESSAGE', 'Create new note succeed!');
      } catch (e) {
        this.$store.commit('note/SET_SYSTEM_MESSAGE', e.message);
      }
    },
    onOpenTitleClick (title) {
      this.$nuxt.$emit('saveTextareaInfo');
      this.$store.commit('note/SET_CURRENT_NOTE_ID', { title });
      this.$nuxt.$emit('updateTextareaInfo');
    },
    resetNewButtonModal () {
      this.newNoteTitle = '';
    }
  }
};
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
