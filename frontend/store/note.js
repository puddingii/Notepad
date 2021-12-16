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
  INIT_OPENTAB_LIST (state, list) {
    state.openTabList = list ? list.split(',') : [];
    state.openTabList = state.openTabList.filter(tab => state.noteList.find(note => note.title === tab));
  },
  INIT_NOTE_LIST (state, list) {
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
  },
  SET_ISSAVED_TRUE (state) {
    const index = MArray.getIndexById(state.noteList, state.currentNoteId);
    state.noteList[index].isSaved = true;
  }
};

/** @type {ifStore.Note.Actions}  */
const actions = {
  async removeNote ({ state, getters, commit }) {
    try {
      const response = await this.$axios.delete('http://localhost:8050/api/notepad/delete', {
        data: {
          noteId: state.currentNoteId,
          email: getters.getCurrentNoteInfo.email
        }
      });
      const {
        data: { isSucceed, msg }
      } = response;
      if (!isSucceed) {
        throw new Error(msg);
      }

      commit('REMOVE_OPEN_NOTE', getters.getCurrentNoteInfo.title);
      commit('REMOVE_NOTE');
      commit('SET_CURRENT_NOTE_ID', { id: -1 });
      commit('SET_SYSTEM_MESSAGE', 'Remove succeed!');

      return { isSucceed };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return { isSucceed: false, msg: e.message };
    }
  },
  async loadAll ({ commit }, email) {
    try {
      const response = await this.$axios.post('http://localhost:8050/api/notepad/loadAllData', { email });
      const {
        data: { noteList, isSucceed, msg }
      } = response;
      if (!isSucceed) {
        throw new Error(msg);
      }
      const { endTitle, openTab } = noteList.pop();
      commit('INIT_NOTE_LIST', noteList);
      commit('SET_CURRENT_NOTE_ID', { title: endTitle });
      commit('INIT_OPENTAB_LIST', openTab);
      return { isSucceed, noteList, endTitle, openTab };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return { isSucceed: false, msg: e.message };
    }
  },
  async updateTextarea ({ getters, commit }, value) {
    const requestPacket = {
      id: getters.getCurrentNoteInfo.id,
      email: getters.getCurrentNoteInfo.email,
      title: getters.getCurrentNoteInfo.title,
      text: value
    };
    try {
      const response = await this.$axios.post('http://localhost:8050/api/notepad/save', requestPacket);
      const {
        data: { isSucceed = false, msg = '' }
      } = response;

      if (isSucceed === false) {
        throw new Error(msg);
      }
      commit('SET_ISSAVED_TRUE');
      commit('SET_SYSTEM_MESSAGE', 'Save succeed!');
      return { isSucceed };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return { isSucceed: false, msg: e.message };
    }
  },
  changeNote ({ getters, commit }, noteInfo) {
    const isExisting = getters.getOpenTabList.includes(noteInfo.title);
    if (!isExisting) {
      commit('ADD_OPEN_TAB', noteInfo.title); // 탭에 없으면 추가
    }
    commit('SET_TEXTAREA', { content: noteInfo.content, isSaved: noteInfo.isSaved }); // 가르키고 있는 notepad update 기록 저장
    commit('SET_CURRENT_NOTE_ID', { title: noteInfo.title });
  },
  async createNewTextarea ({ commit }, { title, content, email }) {
    const requestPacket = {
      email,
      title,
      text: content
    };
    try {
      const response = await this.$axios.post('http://localhost:8050/api/notepad/saveAs', requestPacket);
      const {
        data: { id, isSucceed, msg }
      } = response;
      if (!isSucceed) {
        throw new Error(msg);
      }

      const note = {
        id,
        email,
        title,
        content,
        isSaved: true
      };

      commit('ADD_NOTE', note);
      commit('ADD_OPEN_TAB', note.title);
      commit('SET_CURRENT_NOTE_ID', { id: note.id });
      commit('SET_SYSTEM_MESSAGE', 'Create succeed!');

      return { isSucceed, note };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return { isSucceed: false, msg: e.message };
    }
  },
  async createSaveAsNote ({ commit, dispatch }, noteInfo) {
    if (noteInfo.saveAsInput === '') {
      commit('SET_TEXTAREA', 'SaveAs Title is empty!');
      return;
    }

    commit('SET_TEXTAREA', { content: noteInfo.content, isSaved: noteInfo.isSaved }); // saveAs 하기전 기존거 array에 저장
    const { isSucceed, msg, note } = await dispatch('createNewTextarea', { title: noteInfo.saveAsInput, content: noteInfo.content, email: noteInfo.email });
    return { isSucceed };
  },
  closeNote ({ getters, commit }, noteInfo) {
    const { textareaValue, isSaved } = noteInfo;
    commit('SET_TEXTAREA', { content: textareaValue, isSaved });
    commit('REMOVE_OPEN_NOTE', getters.getCurrentNoteInfo.title);
    commit('SET_CURRENT_NOTE_ID', { id: -1 });
  },
  async saveNoteListStatus ({ state, getters, commit }, email) {
    try {
      const { data: { isSucceed, msg } } = await this.$axios.post('http://localhost:8050/api/users/saveOpenNote', {
        email,
        opentab: state.openTabList.toString(),
        lasttab: getters.getCurrentNoteInfo?.title ?? ''
      });
      console.log(isSucceed);
      if (!isSucceed) {
        throw new Error(msg);
      }
      return { isSucceed };
    } catch (e) {
      commit('SET_SYSTEM_MESSAGE', e.message);
      return { isSucceed: false, msg: e.message };
    }
  }
};

export {
  state,
  getters,
  mutations,
  actions
};
