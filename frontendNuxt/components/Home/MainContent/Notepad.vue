<template>
  <div class="container childContainer">
    <header>
      <ul id="navContainer" class="nav nav-tabs sortable">
        <div class="dropdown">
          <button id="newButton" class="btn btn-primary" type="button">New File</button>
          <button id="shareButton" class="btn btn-primary" type="button">Share</button>
          <button id="ddButton" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Load</button>
          <ul id="dropdownMenu" class="dropdown-menu" aria-labelledby="ddButton" />
        </div>
      </ul>
    </header>
    <br>
    <section class="notepad">
      <div id="noteFormDiv" class="form-floating">
        <textarea id="textareaForm" class="form-control" />
        <label id="textareaLabel">저장됨.</label>
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
export default {
  asyncData ({ store }) {
    const currentEmail = store.state.userEmail;
    console.log(currentEmail);
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
.form-floating {
  margin-bottom: 10px;
}

.notepad > div > textarea {
  height: 500px !important;
}

.disNone {
  display: none !important;
}

#btnGroup {
  margin-top: 10px;
}

input#difBtn {
  width: 200px;
}
li {
  list-style-type: none;
}
</style>
