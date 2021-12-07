<template>
  <div class="col col-md-9">
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
      <section class="notepad" />
    </div>
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

<style>

</style>
