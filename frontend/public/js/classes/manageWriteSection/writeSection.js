export default class WriteSection {
    /**
     * textarea id값과 labelid값을 처음에 설정한다.
     * 
     * @param {string} textareaId HTML의 textarea안에 들어갈 id값
     * @param {string} labelId HTML의 label안에 들어갈 id값
     */
    constructor(textareaId, labelId) {
        this.#textareaId = textareaId;
        this.#labelId = labelId;
    }
    #noteId = "";
    #noteName = "";
    #textareaId;
    #labelId;

    get noteId() {
        return this.#noteId;
    }
    set noteId(noteId) {
        this.#noteId = parseInt(noteId);
    }
    get noteName() {
        return this.#noteName;
    }
    set noteName(noteName) {
        this.#noteName = noteName;
    }
    get textareaId() {
        return this.#textareaId;
    }
    get labelId() {
        return this.#labelId;
    }

    /**
     * 현재 보고있는 Notepad가 무엇인지 셋팅
     *
     * @param {number} id 현재 사용중인 Notepad 아이디
     * @param {string} name 현재 사용중인 Notepad 제목
     */
    setIdAndName(id, name) {
        this.#noteId = id;
        this.#noteName = name;
    }

    /**
     * textarea의 변경이 감지되었을 때 label을 재설정해주는 함수.
     *
     * @param {boolean} isSaved 해당 Notepad가 DB에 저장이 되었는지
     * @param {string} labelValue 저장과 저장이 안된 상태외의 에러, 예외 처리를 위한 string값
     */
    setMonitorLabel(isSaved, labelValue = undefined) {
        const label = document.getElementById(this.#labelId);
        if (labelValue) label.innerText = labelValue;
        else label.innerText = isSaved ? "저장됨." : "저장 안됨.";
    }

    /**
     * 텍스트 적을곳 생성
     *
     * @param {string} value Textarea의 내용에 들어갈 값
     * @returns {Element}Textarea Element
     */
    createTextarea(value = "") {
        const noteArea = document.createElement("textarea");
        noteArea.className = "form-control";
        noteArea.id = this.#textareaId;
        noteArea.value = value;
        noteArea.addEventListener("input", () => this.setMonitorLabel(false));

        return noteArea;
    }

    /**
     * textarea 와 saveAs input의 value 설정
     *
     * @param {string} inputId saveAs를 할때 다른 제목을 적기 위한 input의 id
     * @param {string} inputValue 현재 가르키고 있는 Notepad의 제목
     * @param {string} textareaValue 현재 가르키고 있는 Notepad의 내용
     */
    setWriteSectionValue(inputId, inputValue, textareaValue = "") {
        const noteArea = document.getElementById(this.#textareaId);
        noteArea.value = textareaValue;

        const saveAsInput = document.getElementById(inputId);
        saveAsInput.value = inputValue;
    }
}