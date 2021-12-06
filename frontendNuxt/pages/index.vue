<template>
  <div class="row align-items-md-stretch">
    <div class="col col-md-2 leftCard">
      <UserStatus :user-email="userEmail" />
      <Chat />
    </div>
    <div class="col col-md-9">
      <div class="container childContainer">
        <header>
          <ul id="navContainer" class="nav nav-tabs sortable">
            <div class="dropdown">
              <button id="newButton" class="btn btn-primary" type="button">New File</button><button id="shareButton" class="btn btn-primary" type="button">Share</button><button id="ddButton" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Load</button>
              <ul id="dropdownMenu" class="dropdown-menu" aria-labelledby="ddButton" />
            </div>
          </ul>
        </header>
        <br>
        <section class="notepad" />
      </div>
    </div>
  </div>
</template>

<script>
import UserStatus from '~/components/Home/LeftBar/UserStatus';
import Chat from '~/components/Home/LeftBar/Chat';

export default {
  components: {
    UserStatus,
    Chat
  },
  layout: 'default',
  head: {
    script: [{
      src: 'https://code.jquery.com/jquery-3.6.0.js'
    }, {
      src: 'https://code.jquery.com/ui/1.13.0/jquery-ui.js'
    }, {
      src: 'https://cdn.socket.io/4.3.2/socket.io.min.js',
      integrity: 'sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs',
      crossorigin: 'anonymous'
    }]
  },
  computed: {
    userEmail () {
      return this.$store.state.userEmail;
    },
    isLoggedIn () {
      return this.$store.isLoggedIn;
    }
  },
  watched: {
    isLoggedIn (newValue) {
      if (newValue === '') {
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style >
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

.childContainer {
  margin-top: 30px;
  padding: 20px 30px !important;
  border: 0.5px solid rgb(67, 104, 173);
  border-radius: 1%;
}

.card {
  align-items: center;
}
.card-text {
  font-weight: bold;
}
.leftCard {
  min-width: 191px;
  max-width: 230px;
  height: 734px;
  margin-left: 30px;
  word-break:break-all;
}
.userInfo {
  margin-top: 30px !important;
  height: 145px;
  padding: 5px;
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
