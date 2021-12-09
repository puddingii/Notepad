// @ts-ignore
import MArray from '@/store/util/manageArray';

const state = () => ({
  noteList: [],
  openTabList: [],
  currentNoteId: -1,
  systemMessage: ''
});

const getters = {
  noteList (state) {
    return state.noteList;
  },
  openTabList (state) {
    return state.openTabList;
  },
  currentNoteId (state) {
    return state.currentNoteId;
  },
  currentNoteInfo (state) {
    if (state.currentNoteId !== -1) {
      return state.noteList.find(element => element.id === state.currentNoteId);
    }
  }
};

const mutations = {
  addOpenTab (state, title) {
    state.openTabList.push(title);
  },
  addNote (state, note) {
    state.noteList.push(note);
  },
  deleteNote (state) {
    const index = MArray.getIndexById(state.noteList, state.currentNoteId);
    state.noteList.splice(index, 1);
  },
  deleteOpenNote (state, noteTitle) {
    const index = MArray.getIndex(state.openTabList, noteTitle);
    state.openTabList.splice(index, 1);
  },
  initOpenTabList (state, list) {
    state.openTabList = list ? list.split(',') : [];
    state.openTabList = state.openTabList.filter(tab => state.noteList.find(note => note.title === tab));
  },
  initNotepadList (state, list) {
    state.noteList = list;
    state.noteList.forEach((note) => { note.isSaved = true; });
  },
  setTextarea (state, { content, isSaved }) {
    if (state.currentNoteId > -1) {
      const index = MArray.getIndexById(state.noteList, state.currentNoteId);
      state.noteList[index].content = content;
      state.noteList[index].isSaved = isSaved;
    }
  },
  setCurrentNoteId (state, id) {
    state.currentNoteId = id;
  },
  setCurrentNoteIdByTitle (state, title) {
    state.currentNoteId = state.noteList.length ? MArray.getObjectByTitle(state.noteList, title)?.id : null;
  },
  setSystemMessage (state, msg) {
    state.systemMessage = msg;
  }
};

const actions = {
  async addNewTextarea ({ state, commit }) {
    const response = await this.$axios.post('http://localhost:8050/api/notepad/getLastId');
    const { id } = response.data;
    if (state.noteList.length) {
      const localMax = MArray.getMaxId(state.noteList);
      const maxId = Math.max(localMax, id);
      return maxId ?? 0;
    }
    return id ?? 0;
  },
  async deleteNote ({ state, getters, commit }) {
    const response = await this.$axios.delete('http://localhost:8050/api/notepad/delete', {
      data: {
        noteId: state.currentNoteId,
        email: getters.currentNoteInfo.email
      }
    });
    if (response.data.result) {
      commit('deleteOpenNote', getters.currentNoteInfo.title);
      commit('deleteNote');
      commit('setCurrentNoteId', -1);
    }
  },
  async loadAll ({ commit }, email) {
    const response = await this.$axios.post('http://localhost:8050/api/notepad/loadAllData', { email });
    const { endTitle, openTab } = response.data.pop();
    commit('initNotepadList', response.data);
    commit('setCurrentNoteIdByTitle', endTitle);
    commit('initOpenTabList', openTab);
  },
  async saveTextarea ({ state, getters, commit }, value) {
    const requestPacket = {
      id: getters.currentNoteInfo.id,
      email: getters.currentNoteInfo.email,
      title: getters.currentNoteInfo.title,
      text: value
    };
    const response = await this.$axios.post('http://localhost:8050/api/notepad/save', requestPacket);

    commit('setSystemMessage', response.data.msg);
    setTimeout(() => commit('setSystemMessage', ''), 3000);

    const index = MArray.getIndexById(state.noteList, state.currentNoteId);
    state.noteList[index].isSaved = true;
  },
  async saveAsTextarea ({ getters, commit }, { title, content }) {
    const requestPacket = {
      email: getters.currentNoteInfo.email,
      title,
      text: content
    };
    const response = await this.$axios.post('http://localhost:8050/api/notepad/saveAs', requestPacket);
    // DB에 저장된 ID값을 가지고 Array.push해야함.
    const { id } = response.data;
    const note = {
      id,
      email: getters.currentNoteInfo.email,
      title,
      content,
      isSaved: true
    };

    commit('setSystemMessage', response.data.msg);
    setTimeout(() => commit('setSystemMessage', ''), 3000);

    commit('addNote', note);
    commit('addOpenTab', title);
    commit('setCurrentNoteId', id);
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
