<template>
  <header>
    <ul id="navContainer" class="nav nav-tabs sortable">
      <div class="dropdown">
        <button id="newButton" class="btn btn-primary" type="button">New File</button>
        <button id="shareButton" class="btn btn-primary" type="button">Share</button>
        <button id="ddButton" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Load</button>
        <ul id="dropdownMenu" class="dropdown-menu" aria-labelledby="ddButton">
          <li v-for="note in noteList" :key="note.id" :data-current-id="note.id">
            <a href="#" :data-currentid="note.id" class="dropdown-item" @click="handleLoadNoteClick(note.title)">{{ note.title }}</a>
          </li>
        </ul>
      </div>
      <li v-for="(text, index) in openTabList" :id="`noteList${getId(text)}`" :key="index" class="nav-item notetab">
        <a :id="`noteId${getId(text)}`" href="#" class="nav-link notelink" :data-currentid="getId(text)">{{ text }}</a>
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
  methods: {
    getId (text) {
      return this.noteList.find(note => note.title === text).id;
    },
    handleLoadNoteClick (noteTitle) {
      this.$emit('addOpenTab', noteTitle);
      // this.$emit('updateBody', noteTitle);
    }
  }
};
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
