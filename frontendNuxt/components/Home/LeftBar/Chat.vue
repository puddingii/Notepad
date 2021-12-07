<template>
  <div class="card chat">
    <button id="roomName" class="btn btn-outline-secondary" type="button" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" title="User List" data-bs-content="">NULL</button>
    <div class="row">
      <button id="chatNewBtn" class="btn btn-light col" style="margin-left:12px;">New</button>
      <button class="btn btn-light col" data-bs-toggle="modal" data-bs-target="#joinRoomModal">Join</button>
      <button id="chatExitBtn" class="btn btn-light col" style="margin-right:12px;">Exit</button>
    </div>
    <ul id="chatRecordBoard" class="chatRecord" />
    <div class="chatInputDiv">
      <div class="input-group mb-3 chatInputForm">
        <input id="chatInput" class="form-control" type="text" placeholder="Chat" aria-describedby="chatInputButton">
        <button id="chatInputButton" class="input-group-text">></button>
      </div>
      <!-- <div id="joinRoomModal" class="modal fade" tabindex="-1" aria-labelledby="joinRoomModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="joinRoomModalLabel" class="modal-title">Input room name</h5>
              <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label class="col-form-label" for="inputRoomName">Room Name</label>
                  <input id="inputRoomName" class="form-control" type="text">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
              <button id="joinRoomButton" class="btn btn-primary" type="button" data-bs-dismiss="modal">Join</button>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.card {
  align-items: center;
}
.chat {
  margin-top: 30px !important;
  height: 530px;
  align-items: unset;
}
.chatRecord {
  overflow: scroll;
  height:450px;
}
ul {
  padding-left: 15px;
}
li {
  list-style-type: none;
}
.chatInputDiv {
  position: absolute;
  bottom: 0px;
  margin-bottom: 0px !important;
}
.chatInputForm {
  bottom: 0px;
  margin-bottom: 0px !important;
  margin-left: 0px !important;
}
@keyframes goAway {
  from {
    transform: none;
    opacity: 1;
  }
  to {
    transform: translateY(-50px);
    opacity: 0;
  }
}

.message {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 200px;
  padding: 10px 20px;
  border-radius: 10000px;
  text-align: center;
  animation: goAway 0.5s ease-in-out forwards;
  animation-delay: 5s;
  background-color: aquamarine;
  color: black;
}
</style>
