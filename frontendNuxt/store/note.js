// @ts-ignore
import MArray from '@/store/util/manageArray';

/** @returns {ifStore.Note.State}  */
const state = () => ({
  noteList: [],
  openTabList: [],
  currentNoteId: -1,
  systemMessage: ''
});

/** @type {ifStore.Note.Getters}  */
const getters = {
  getNoteList: state => state.noteList,
  getOpenTabList: state => state.openTabList,
  getCurrentNoteId: state => state.currentNoteId,
  getSystemMessage: state => state.systemMessage,
  getCurrentNoteInfo (state) {
    if (state.currentNoteId !== -1) {
      return state.noteList.find(element => element.id === state.currentNoteId);
    }
    return null;
  }

};

/** @type {ifStore.Note.Mutations}  */
const mutations = {
  ADD_OPEN_TAB (state, title) {
    state.openTabList.push(title);
  },
  ADD_NOTE (state, note) {
    state.noteList.push(note);
  },
  REMOVE_NOTE (state) {
    const index = MArray.getIndexById(state.noteList, state.currentNoteId);
    state.noteList.splice(index, 1);
  },
  REMOVE_OPEN_NOTE (state, noteTitle) {
    const index = MArray.getIndex(state.openTabList, noteTitle);
    state.openTabList.splice(index, 1);
  },
  SET_OPENTAB_LIST (state, list) {
    state.openTabList = list ? list.split(',') : [];
    state.openTabList = state.openTabList.filter(tab => state.noteList.find(note => note.title === tab));
  },
  SET_NOTE_LIST (state, list) {
    state.noteList = list;
    state.noteList.forEach((note) => { note.isSaved = true; });
  },
  SET_TEXTAREA (state, { content, isSaved }) {
    if (state.currentNoteId > -1) {
      const index = MArray.getIndexById(state.noteList, state.currentNoteId);
      state.noteList[index].content = content;
      state.noteList[index].isSaved = isSaved;
    }
  },
  SET_CURRENT_NOTE_ID (state, { id, title }) {
    if (id) {
      state.currentNoteId = id;
    } else {
      state.currentNoteId = state.noteList.length ? MArray.getObjectByTitle(state.noteList, title)?.id ?? -1 : -1;
    }
  },
  SET_SYSTEM_MESSAGE (state, msg) {
    state.systemMessage = msg;
  }
};

/** @type {ifStore.Note.Actions}  */
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
      commit('REMOVE_OPEN_NOTE', getters.getCurrentNoteInfo.title);
      commit('REMOVE_NOTE');
      commit('SET_CURRENT_NOTE_ID', { id: -1 });
      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return false;
    }
  },
  async loadAll ({ commit }, email) {
    try {
      const response = await this.$axios.post('http://localhost:8050/api/notepad/loadAllData', { email });
      const {
        data: { noteList, result, msg }
      } = response;
      if (!result) {
        throw new Error(msg);
      }
      const { endTitle, openTab } = noteList.pop();
      commit('SET_NOTE_LIST', noteList);
      commit('SET_CURRENT_NOTE_ID', { title: endTitle });
      commit('SET_OPENTAB_LIST', openTab);
      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return false;
    }
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
      commit('SET_SYSTEM_MESSAGE', response.data.msg);
      setTimeout(() => commit('SET_SYSTEM_MESSAGE', ''), 3000);

      const index = MArray.getIndexById(state.noteList, state.currentNoteId);
      state.noteList[index].isSaved = true;
      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
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

      commit('SET_SYSTEM_MESSAGE', response.data.msg);
      setTimeout(() => commit('SET_SYSTEM_MESSAGE', ''), 3000);

      commit('ADD_NOTE', note);
      commit('ADD_OPEN_TAB', title);
      commit('SET_CURRENT_NOTE_ID', { id });
      return true;
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
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
      commit('SET_SYSTEM_MESSAGE', e.message);
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
