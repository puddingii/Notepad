<template>
  <section class="notepad">
    <div id="noteFormDiv" class="form-floating">
      <textarea id="textareaForm" class="form-control" :value="noteContent.content" />
      <label id="textareaLabel">{{ noteContent.isSaved ? '저장됨.' : '저장 안됨.' }}</label>
      <div id="btnGroup">
        <button id="save" type="button" class="btn btn-outline-primary">save</button>
        <button id="saveAs" type="button" class="btn btn-outline-primary">saveAs</button>
        <button id="delete" type="button" class="btn btn-outline-danger">delete</button>
        <button id="close" type="button" class="btn btn-outline-danger">close</button>
        <input id="saveAsInput" type="text" class="form-control">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    noteContent: {
      type: Object,
      required: true
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

input#difBtn {
  width: 200px;
}
</style>
