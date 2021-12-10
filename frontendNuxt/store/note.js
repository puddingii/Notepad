// @ts-ignore
import MArray from '@/store/util/manageArray';

const state = () => ({
  noteList: [],
  openTabList: [],
  currentNoteId: -1,
  systemMessage: ''
});

const getters = {
  getNoteList (state) {
    return state.noteList;
  },
  getOpenTabList (state) {
    return state.openTabList;
  },
  getCurrentNoteId (state) {
    return state.currentNoteId;
  },
  getCurrentNoteInfo (state) {
    if (state.currentNoteId !== -1) {
      return state.noteList.find(element => element.id === state.currentNoteId);
    }
    return null;
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
    state.currentNoteId = state.noteList.length ? MArray.getObjectByTitle(state.noteList, title)?.id ?? -1 : -1;
  },
  setSystemMessage (state, msg) {
    state.systemMessage = msg;
  }
};

const actions = {
  async deleteNote ({ state, getters, commit }) {
    try {
      const response = await this.$axios.delete('http://localhost:8050/api/notepad/delete', {
        data: {
          noteId: state.currentNoteId,
          email: getters.getCurrentNoteInfo.email
        }
      });
      if (!response.data.result) {
        throw new Error(response.data.msg);
      }
      commit('deleteOpenNote', getters.getCurrentNoteInfo.title);
      commit('deleteNote');
      commit('setCurrentNoteId', -1);
      return true;
    } catch (e) {
      commit('setSystemMessage', e.message);
      return false;
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
      id: getters.getCurrentNoteInfo.id,
      email: getters.getCurrentNoteInfo.email,
      title: getters.getCurrentNoteInfo.title,
      text: value
    };
    try {
      const response = await this.$axios.post('http://localhost:8050/api/notepad/save', requestPacket);
      if (!response.data.result) {
        throw new Error(response.data.msg);
      }
      commit('setSystemMessage', response.data.msg);
      setTimeout(() => commit('setSystemMessage', ''), 3000);

      const index = MArray.getIndexById(state.noteList, state.currentNoteId);
      state.noteList[index].isSaved = true;
      return true;
    } catch (e) {
      commit('setSystemMessage', e.message);
      return false;
    }
  },
  async saveAsTextarea ({ getters, commit }, { title, content }) {
    const requestPacket = {
      email: getters.getCurrentNoteInfo.email,
      title,
      text: content
    };
    try {
      const response = await this.$axios.post('http://localhost:8050/api/notepad/saveAs', requestPacket);
      if (!response.data.result) {
        throw new Error(response.data.msg);
      }
      // DB에 저장된 ID값을 가지고 Array.push해야함.
      const { id } = response.data;
      const note = {
        id,
        email: getters.getCurrentNoteInfo.email,
        title,
        content,
        isSaved: true
      };

      commit('setSystemMessage', response.data.msg);
      setTimeout(() => commit('setSystemMessage', ''), 3000);

      commit('addNote', note);
      commit('addOpenTab', title);
      commit('setCurrentNoteId', id);
      return true;
    } catch (e) {
      commit('setSystemMessage', e.message);
      return false;
    }
  },
  async saveNoteListStatus ({ state, getters, commit }, email) {
    try {
      const response = await this.$axios.post('http://localhost:8050/api/users/saveOpenNote', {
        email,
        opentab: state.openTabList.toString(),
        lasttab: getters.getCurrentNoteInfo?.title ?? ''
      });
      if (!response.data.result) {
        throw new Error(response.data.msg);
      }
      return true;
    } catch (e) {
      commit('setSystemMessage', e.message);
      return false;
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
