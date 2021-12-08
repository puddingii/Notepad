<template>
  <div id="btnGroup">
    <button id="save" type="button" class="btn btn-outline-primary" @click="handleSaveClick">save</button>
    <button id="saveAs" type="button" class="btn btn-outline-primary" @click="handleSaveAsClick">saveAs</button>
    <button id="delete" type="button" class="btn btn-outline-danger" @click="handleDeleteClick">delete</button>
    <button id="close" type="button" class="btn btn-outline-danger" @click="handleCloseClick">close</button>
    <input id="saveAsInput" v-model="saveAsInput" type="text" class="form-control">
  </div>
</template>

<script>
export default {
  data () {
    return {
      saveAsInput: ''
    };
  },
  methods: {
    handleSaveClick () {
      this.$emit('save');
    },
    handleSaveAsClick () {
      this.$emit('saveas', this.saveAsInput);
    },
    handleDeleteClick () {
      this.$emit('delete');
    },
    handleCloseClick () {
      this.$emit('close');
    }
  }
};
</script>

<style>
#btnGroup {
  margin-top: 10px;
}
input#difBtn {
  width: 200px;
}
</style>
