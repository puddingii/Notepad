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

    setIdAndName(id, name) {
        this.#noteId = parseInt(id);
        this.#noteName = name;
    }

    // textarea생성과 textarea처리를 위한 버튼 생성
    monitorValue(textarea, text) {
        const handleTextarea = (e) => {
            document.getElementById(this.#labelId).innerText = text;
        }
        textarea.addEventListener("input", handleTextarea);
    }

    // textarea의 변경이 감지되었을 때 label을 재설정해주는 함수.
	setMonitorLabel(isSaved, labelValue = undefined, idOfLabel= "textareaLabel") {
		const label = document.getElementById(idOfLabel);
		if(labelValue) label.innerText = labelValue;
		else label.innerText = isSaved ? "저장됨." : "저장 안됨.";
	}

    // 텍스트 적을곳 생성
	initArea(value = "") {
		const noteArea = document.createElement("textarea");
		noteArea.className = "form-control";
        noteArea.id = this.#textareaId;
        noteArea.value = value;
		this.monitorValue(noteArea, "저장 안됨.");

		return noteArea;
	}

	// textarea value 설정
	loadValue(inputId, inputValue, textareaValue = "") {
		const noteArea = document.getElementById(this.#textareaId);
		noteArea.value = textareaValue;

		const saveAsInput = document.getElementById(inputId);
		saveAsInput.value = inputValue;
	}
}