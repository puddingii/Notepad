<template>
  <div id="btnGroup">
    <button id="save" type="button" class="btn btn-outline-primary" @click="onSaveClick">save</button>
    <button id="saveAs" type="button" class="btn btn-outline-primary" @click="onSaveAsClick">saveAs</button>
    <button id="delete" type="button" class="btn btn-outline-danger" @click="onDeleteClick">delete</button>
    <button id="close" type="button" class="btn btn-outline-danger" @click="onCloseClick">close</button>
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
    onSaveClick () {
      this.$emit('save');
    },
    onSaveAsClick () {
      this.$emit('saveas', this.saveAsInput);
    },
    onDeleteClick () {
      this.$emit('delete');
    },
    onCloseClick () {
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
