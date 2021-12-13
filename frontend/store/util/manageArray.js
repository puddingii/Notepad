class MArray {
  /**
   * 배열에서 ID에 해당하는 Object정보를 반환한다.
   *
   * @param {Array} list Object가 담겨 있는 배열
   * @param {number} id 찾고자 하는 ID
   * @returns {object} Note Object
   */
  getObjectById (list, id) { // = this.writeSection.noteId
    return list.find(element => element.id === id);
  }

  /**
   * 배열에서 타이틀에 해당하는 Object정보를 반환한다.
   *
   * @param {Array} list Object가 담겨 있는 배열
   * @param {string} noteTitle 노트 이름
   * @returns {object} Note Object
   */
  getObjectByTitle (list, noteTitle) { //  = this.writeSection.noteName
    return list.find(element => element.title === noteTitle);
  }

  /**
   * 배열에서 ID에 해당하는 Object 인덱스 값을 반환한다.
   *
   * @param {Array} list Object가 담겨 있는 배열
   * @param {number} id 노트 아이디
   * @returns {object} 해당 Notepad의 인덱스
   */
  getIndexById (list, id) { // = this.writeSection.noteId
    return list.findIndex(element => element.id === id);
  }

  /**
   *
   * @param {Array} list 데이터가 string값으로 담겨있는 배열
   * @param {string} value 배열 안의 찾고자 하는 값
   * @returns {string} 찾고자 하는 값이 있으면 해당 값 반환
   */
  getElement (list, value) {
    return list.find(element => element === value);
  }

  /**
   *
   * @param {Array} list 데이터 string값으로 담겨있는 배열
   * @param {string} value 배열 안의 찾고자 하는 값
   * @returns {number} 찾고자 하는 값의 인덱스 번호
    */
  getIndex (list, value) {
    return list.findIndex(element => element === value);
  }

  /**
   * List안의 id값을 비교해서 제일 높은 Object의 id값을 반환한다.
   *
   * @param {Array} list Object가 담겨 있는 배열
   * @returns {number} 최대값
   */
  getMaxId (list) {
    if (list.length) {
      const maxValue = list.reduce((max, cur) => Math.max(cur.id, max), list[0].id);
      return maxValue ?? 0;
    }
    return 0;
  }
}

export default new MArray();
