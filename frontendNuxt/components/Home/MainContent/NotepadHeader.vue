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
    onLoadClick (noteTitle) {
      this.$emit('handleLoadClick', noteTitle);
      this.$nuxt.$emit('saveNotepadInfo'); // 가르키고 있는 notepad update 기록 저장(body부분으로 넘겨줘야할듯 , value랑 isSaved가 필요함)
      this.$emit('setCurrentNoteIdByTitle', noteTitle);
      this.$nuxt.$emit('updateNotepadInfo'); // 가르키고 있는 노트를 업데이트 했으므로 textarea도 업데이트 해야함.
    },
    async onNewClick () {
      this.$nuxt.$emit('saveNotepadInfo'); // textarea 기록 저장
      const isSucceed = await this.$store.dispatch('note/saveAsTextarea', { title: this.newNoteTitle, content: '' });
      if (isSucceed) {
        this.$nuxt.$emit('updateNotepadInfo', { content: '', isSaved: this.$store.getters['note/getCurrentNoteInfo'].isSaved });
        this.$nextTick(() => {
          this.$bvModal.hide('newNoteTitleModal');
        });
      }
    },
    onOpenTitleClick (title) {
      this.$nuxt.$emit('saveNotepadInfo');
      this.$emit('setCurrentNoteIdByTitle', title);
      this.$nuxt.$emit('updateNotepadInfo');
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
