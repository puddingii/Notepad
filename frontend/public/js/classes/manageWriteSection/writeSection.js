export default class WriteSection {
    #noteId = "";
    #noteName = "";
    #textareaId;
    #labelId;
    constructor(textareaId, labelId) {
        this.#textareaId = textareaId;
        this.#labelId = labelId;
    }
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

    /**
     * 현재 보고있는 Notepad가 무엇인지 셋팅
     *
     * @param {number} id 
     * @param {string} name 
     */
    setIdAndName(id, name) {
        this.#noteId = id;
        this.#noteName = name;
    }

    /**
     * Textarea부분의 Value 설정
     *
     * @param {string} text 
     */
    setTextarea(text) {
        document.getElementById(this.#labelId).innerText = text;
    }

    /**
     * textarea의 변경이 감지되었을 때 label을 재설정해주는 함수.
     *
     * @param {boolean} isSaved 
     * @param {string} labelValue 
     * @param {string} idOfLabel 
     */
    setMonitorLabel(isSaved, labelValue = undefined, idOfLabel = "textareaLabel") {
        const label = document.getElementById(idOfLabel);
        if (labelValue) label.innerText = labelValue;
        else label.innerText = isSaved ? "저장됨." : "저장 안됨.";
    }

    /**
     * 텍스트 적을곳 생성
     *
     * @param {string} value 
     * @returns Textarea Element
     */
    createTextarea(value = "") {
        const noteArea = document.createElement("textarea");
        noteArea.className = "form-control";
        noteArea.id = this.#textareaId;
        noteArea.value = value;
        noteArea.addEventListener("input", () => this.setTextarea("저장 안됨."));

        return noteArea;
    }

    /**
     * textarea 와 saveAs input의 value 설정
     *
     * @param {string} inputId 
     * @param {string} inputValue 
     * @param {string} textareaValue 
     */
    setWriteSectionValue(inputId, inputValue, textareaValue = "") {
        const noteArea = document.getElementById(this.#textareaId);
        noteArea.value = textareaValue;

        const saveAsInput = document.getElementById(inputId);
        saveAsInput.value = inputValue;
    }
}