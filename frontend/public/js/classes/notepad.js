import DropdownList from "./manageList/dropdownItem.js";
import NavBar from "./manageList/navBar.js";
import NoteButton from "./noteButton.js";
import NoteTextarea from "./noteTextarea.js";

export default class Notepad {
	#noteNameList = new Array();
	#userEmail = "";
	#openTabs;
	notepadStorage = new NotepadStorage();
	userStorage = new UserStorage();
	textareaForm = document.getElementById("textareaForm");
	noteFormDiv = document.getElementById("noteFormDiv");
	
	// 데이터 가져온 뒤 private변수에 저장
    constructor() { 
		this.noteTextarea = new NoteTextarea("textareaForm", "textareaLabel");
		this.dropdownList = new DropdownList("dropdownMenu");
		this.navbarList = new NavBar("navContainer");
	}

	set noteNameList(noteNameList) {
		this.#noteNameList = noteNameList;
	}
	get noteNameList() {
		return this.#noteNameList;
	}
	get openTabs() {
		return this.#openTabs;
	}
	getNoteById(noteId = this.noteTextarea.noteId) {
		return this.#noteNameList.find((element) => element.id === noteId);
	}
	getNoteIndexById(noteId = this.noteTextarea.noteId) {
		return this.#noteNameList.findIndex((element) => element.id === noteId);
	}
	// DB와 LOCAL의 MAX ID값을 뽑아 비교후 더 큰값 리턴.
	async getMaxId() {
		const dbMax = await this.notepadStorage.notepadLastId();
		const localMax = this.#noteNameList.reduce((max, cur) => cur.id > max ? cur.id : max, this.#noteNameList[0].id);
		return dbMax > localMax ? dbMax : localMax;
	}
	// 데이터 불러오는 초기화함수
	async initNotepad(currentUserId) {
		const allData = await new NotepadStorage(currentUserId).loadContent();
		const { endTitle, openTab } = allData.pop();
		openTab ? this.#openTabs = openTab.split(',').map( Number ) : this.#openTabs = [];
		this.#userEmail = currentUserId;
		this.#noteNameList = allData;
		this.#noteNameList.forEach((list) => list["isSaved"] = true);
		const noteId = allData.length ? parseInt(endTitle) : 0;
		this.noteTextarea.setIdAndName(noteId, noteId ? this.getNoteById(noteId).title : "");
	}

    // Dropdown에 아이템과 아이템이벤트 추가
	addDropdownItem(value, currentId) { 
		const itemInfo = {
			className: "",
			id: "",
            dataset: {
				key: "currentid",
				value: currentId
			}
        };
        const linkInfo = {
            className: "dropdown-item",
			id: "",
            href: "#",
            dataset: {
                key: "currentid",
                value: currentId
            },
            text: value
        };
		// 초기화를 위한 변수 전달
		const dropdownItem = this.dropdownList.initItem(itemInfo, linkInfo);

		// 정상적으로 초기화 했으면 초기화한 아이템에 이벤트추가하고 리스트에 추가.
		if(dropdownItem) {
			this.clickDropdownAndLoadValue(dropdownItem);
			this.dropdownList.addItemAtList(dropdownItem);
		}
	}

	// Dropdown 이벤트 처리
	clickDropdownAndLoadValue(item) {
		const handleLoadValue = async (e) => {
			const currentId = parseInt(e.target.dataset.currentid);
			const items = document.querySelectorAll(".notelink");

			// navBar에 없을 시 navBar에 추가
			if(!this.navbarList.isItemInList(items, currentId)) {
				this.addItemAtList(e.target.innerText, currentId);
			}
			this.clickListAndSaveLog(currentId);
		}
		item.addEventListener("click", handleLoadValue);
	}

	// 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시
	// 현재 가르키고 있는 note갱신
	clickListAndSaveLog(clickedId) {
		const getBeforeValue = this.getNoteIndexById();
		noteFormDiv.classList.remove("disNone");

		// notelist에 저장한 value값과 현재 textarea에 있는 value값이 다르면
		// 저장된 상태와 변경된 값을 해당 배열에 저장.
		if(getBeforeValue !== -1) {
			if(this.#noteNameList[getBeforeValue].content !== textareaForm.value) { 
				this.#noteNameList[getBeforeValue].isSaved = false;
			}
			this.#noteNameList[getBeforeValue].content = textareaForm.value;
		}

		this.navbarList.toggleItem(`noteId${clickedId}`, "a.notelink");
		// 클릭한 notepad를 알려주기 위한 변수 갱신.
		this.noteTextarea.setIdAndName(clickedId, this.getNoteById(clickedId).title);
		if(!this.#openTabs.find(element => element === clickedId)) this.#openTabs.push(clickedId);
		
		// 클릭한 notepad의 내용을 textarea에 로드.
		const getAfterValue = this.getNoteIndexById(clickedId);
		this.noteTextarea.loadValue("saveAsInput", this.#noteNameList[getAfterValue].title, this.#noteNameList[getAfterValue].content);
		this.noteTextarea.setMonitorLabel(this.getNoteById().isSaved);
	}

	// noteName값으로 navBar에 아이템 추가
	addItemAtList(value, id) {
		if(!value) return;
		const itemInfo = {
            className: "nav-item notetab",
            id: `noteList${id}`,
			dataset: {
				key: "",
				value: "",
			},

        };
        const linkInfo = {
            className: "nav-link notelink",
			id: `noteId${id}`,
            dataset: {
				key: "currentid",
                value: id
            },
			href: "#",
            text: value
        };
		const item = this.navbarList.initItem(itemInfo, linkInfo);
		item.addEventListener("click", (e) => this.clickListAndSaveLog(parseInt(e.target.dataset.currentid))); // 클릭이벤트
		this.navbarList.addItemAtList(item);
	}

	// 파일 만들때 난수 생성해서 이름짓고 리스트추가
	// id값은 현재 db에 저장되어있는 최대id값을 참고해서 생성함.(max+1)
	clickNewFile() {
		const openBtn = document.getElementById("openFile");
		const handleNewFile = async(e) => {
			const random = `tmp${Math.floor(Math.random()*1000000+1)}`;
			const maxId = await this.getMaxId();
			const id = maxId + 1;
			this.#noteNameList.push({
				id,
				email: this.#userEmail,
				title: random,
				content: "",
				isSaved: false,
			});
			this.addItemAtList(random, id);
			this.navbarList.toggleItem(`noteId${id}`, "a.notelink");
			this.clickListAndSaveLog(id);
			this.noteTextarea.loadValue("saveAsInput", random);
			this.noteTextarea.setMonitorLabel(this.getNoteById().isSaved);
		}
		openBtn.addEventListener("click", handleNewFile);
	}

	// textarea+Button부분을 없앤다.(display: none)
	closeNotepad() {
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.noteTextarea.noteId}`);
		this.noteTextarea.setIdAndName("","");
		note.remove();
	}

	// 버튼을 눌렀을 때 버튼기능에 따른 textarea 처리.
	// save, saveAs, close, delete 기능
	setButtonWithData(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.setButton(classOfBtn);
		const textareaValue = () => {
			const textValue = document.getElementById("textareaForm");
			return {  //id 부분 다시 나중에 확인할 것 asdf 
				id: this.noteTextarea.noteId,
				email: this.#userEmail,
				title: this.noteTextarea.noteName,
				content: textValue.value,
				isSaved: true,
			};
		}

		let actionOfBtn;
		switch(type) { 
			// 저장할 때 이벤트. 가르키고 있는 노트를 저장한 노트의 이름으로 바꾸고 드롭다운목록에 없다면 추가해줌. 
			case "save":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					const response = await this.notepadStorage.saveContent(noteData.id, noteData.email, noteData.title, noteData.content);
					if(response.status !== 201)  {
						this.noteTextarea.setMonitorLabel(this.getNoteById().isSaved,`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(noteData.title, noteData.id); // dropdown목록 확인후 추가
					const indexOfItem = this.getNoteIndexById();
					if(indexOfItem !== -1) {
						this.#noteNameList[indexOfItem] = noteData;
					} else {
						this.#noteNameList.push(noteData);
						this.#openTabs.push(noteData.id);
					}
					this.noteTextarea.setMonitorLabel(this.getNoteById().isSaved);
				}
				break;
			// 삭제할 때 이벤트. 해당하는 데이터 삭제와 동시에 리스트와 드롭다운 목록에서 제거
			case "delete":
				actionOfBtn = async (e) => {
					const response = await this.notepadStorage.deleteContent(this.noteTextarea.noteId, this.#userEmail);
					if(response.status !== 201)  {
						this.noteTextarea.setMonitorLabel(this.getNoteById().isSaved,`처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.dropdownList.deleteDropdownItem(this.noteTextarea.noteId, "dropdownMenu");
					this.closeNotepad();
					const opentabId = this.#openTabs.findIndex((element) => element === this.noteTextarea.noteId);
					this.#openTabs.splice(opentabId, 1);
					this.#noteNameList = this.#noteNameList.filter((element) => element.title !== this.noteTextarea.noteId);
				}
				break;
			// 다른이름저장할 때 이벤트. 다른이름으로 저장 칸을 내용을 토대로 저장.
			case "saveAs":
				actionOfBtn = async (e) => {
					const noteData = textareaValue();
					noteData.id = await this.getMaxId() + 1;
					noteData.title = document.getElementById("saveAsInput").value;;
					const response = await this.notepadStorage.saveAsContent(noteData.id, noteData.email, noteData.title, noteData.content);
					if(response.status === 400)  {
						this.noteTextarea.setMonitorLabel(this.getNoteById().isSaved, `처리오류 - Response status code : ${response.status}`);
						return;
					}
					this.addDropdownItem(noteData.title);
					this.#noteNameList.push(noteData);
					this.addItemAtList(noteData.title, noteData.id);
					this.clickListAndSaveLog(noteData.id);
				}
				break;
			// 닫을 때 이벤트
			default:
				actionOfBtn = (e) => {
					const opentabId = this.#openTabs.findIndex((element) => element === this.noteTextarea.noteId);
					this.#openTabs.splice(opentabId, 1);
					this.closeNotepad();
				}
		}
		btn.addEventListener("click", actionOfBtn);
		return btn;
	}

	async saveOpenNote() {
		await this.userStorage.saveOpenNote(this.#userEmail, this.#openTabs, this.noteTextarea.noteId);
	}

	// 저장, 다른이름저장, 닫기 버튼 관리, 다른이름저장 input셋팅
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";

		const saveBtn = this.setButtonWithData("save", "btn btn-outline-primary");
		const saveAsBtn = this.setButtonWithData("saveAs", "btn btn-outline-primary");
		const deleteBtn = this.setButtonWithData("delete", "btn btn-outline-danger");
		const closeBtn = this.setButtonWithData("close", "btn btn-outline-danger");
		
		const saveAsInput = document.createElement("input");
		saveAsInput.type= "text";
		saveAsInput.className = "form-control";
		saveAsInput.id = "saveAsInput";
		saveAsInput.value = this.noteTextarea.noteId ? this.getNoteById().title : "";

		btnGroup.appendChild(saveBtn);
		btnGroup.appendChild(saveAsBtn);
		btnGroup.appendChild(deleteBtn);
		btnGroup.appendChild(closeBtn);
		btnGroup.appendChild(saveAsInput);

		return btnGroup;
	}

    // textarea와 버튼들을 합치고 보여주는 기능.
    combineComponents(mainSection) {
        const noteForm = document.createElement("div");
        noteForm.className = "form-floating";
		if(!this.noteTextarea.noteId) noteForm.classList.add("disNone");
		noteForm.id = "noteFormDiv";

		const noteNameIndex = this.getNoteById();
        const noteTextarea = noteNameIndex ? this.noteTextarea.initArea(noteNameIndex.content) : this.noteTextarea.initArea();
        noteForm.appendChild(noteTextarea);
		
        const detectLabel = document.createElement("label");
		detectLabel.innerText = "저장됨.";
		detectLabel.id = "textareaLabel";
        noteForm.appendChild(detectLabel);
		mainSection.appendChild(noteForm);

		const btnGroup = this.setButtonGroup();
        noteForm.appendChild(btnGroup);
		mainSection.appendChild(noteForm);
    }
}