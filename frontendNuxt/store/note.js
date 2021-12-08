// @ts-ignore
import MArray from '@/store/util/manageArray';

const state = () => ({
  noteList: [],
  openTabList: [],
  currentNoteId: '',
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
    return state.curretnNoteId;
  },
  currentNoteInfo (state) {
    return state.noteList.find(element => element.id === state.currentNoteId);
  }
};

const mutations = {
  setCurrentNoteId (state, id) {
    state.currentNoteId = id;
  },
  setCurrentNoteIdByTitle (state, title) {
    state.currentNoteId = state.noteList.length ? MArray.getObjectByTitle(state.noteList, title)?.id : null;
  },
  setSystemMessage (state, msg) {
    state.systemMessage = msg;
  },
  initOpenTabList (state, list) {
    state.openTabList = list ? list.split(',') : [];
  },
  initNotepadList (state, list) {
    state.noteList = list;
    state.noteList.forEach((note) => { note.isSaved = true; });
  },
  addOpenTab (state, title) {
    state.openTabList.push(title);
  },
  addNote (state, note) {
    state.noteList.push(note);
  },
  setTextarea (state, { content, isSaved }) {
    const index = MArray.getIndexById(state.noteList, state.currentNoteId);
    state.noteList[index].content = content;
    state.noteList[index].isSaved = isSaved;
  }
};

const actions = {
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
    if (!response.data.result) {
      commit('setSystemMessage', response.data.msg);
      setTimeout(() => commit('setSystemMessage', ''), 3000);
    }
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
