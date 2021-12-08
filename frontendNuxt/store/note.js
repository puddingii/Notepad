// @ts-ignore
import MArray from '@/store/util/manageArray';

const state = () => ({
  noteList: [],
  openTabList: [],
  currentNoteId: ''
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
  setCurrentNoteId (state, title) {
    state.currentNoteId = state.noteList.length ? MArray.getObjectByTitle(state.noteList, title)?.id : null;
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
  saveTextarea (state, { content, isSaved }) {
    const index = MArray.getIndexById(state.noteList, state.currentNoteId);
    state.noteList[index].content = content;
    state.noteList[index].isSaved = isSaved;
  }
};

const actions = {
  async loadAll ({ commit, state }, email) {
    const response = await this.$axios.post('http://localhost:8050/api/notepad/loadAllData', { email });
    const { endTitle, openTab } = response.data.pop();
    commit('initNotepadList', response.data);
    commit('setCurrentNoteId', endTitle);
    commit('initOpenTabList', openTab);
  }
};

export {
  state,
  getters,
  mutations,
  actions
};