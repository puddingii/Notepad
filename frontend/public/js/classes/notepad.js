import DropdownBar from "./manageList/dropdownBar.js";
import NavigationBar from "./manageList/navigationBar.js";
import NoteButton from "./manageButton/noteButton.js";
import WriteSection from "./manageWriteSection/writeSection.js";

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
		this.writeSection = new WriteSection("textareaForm", "textareaLabel");
		this.dropdownBar = new DropdownBar("dropdownMenu");
		this.navigationBar = new NavigationBar("navContainer");
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
	/**
	 * ID에 해당하는 Notepad 정보를 가지고 온다.
	 * @param {Number} noteId 찾고자 하는 ID
	 * @returns {Object} Note Object
	 */
	getNoteById(noteId = this.writeSection.noteId) {
		return this.#noteNameList.find((element) => element.id === noteId);
	}
	/**
	 * 타이틀에 해당하는 노트정보
	 * @param {String} noteTitle 
	 * @returns Note Object
	 */
	getNoteByTitle(noteTitle = this.writeSection.noteName) {
		return this.#noteNameList.find((element) => element.title === noteTitle);
	}

	/**
	 * ID에 해당하는 노트정보 인덱스
	 * @param {Number} noteId 
	 * @returns Note Index
	 */
	getNoteIndexById(noteId = this.writeSection.noteId) {
		return this.#noteNameList.findIndex((element) => element.id === noteId);
	}
	/**
	 * DB와 LOCAL의 MAX ID값을 뽑아 비교후 더 큰값 리턴.
	 * @returns Max Number
	 */
	async getMaxId() {
		const dbMaxId = await this.notepadStorage.notepadLastId();
		if(this.#noteNameList.length) {
			const localMax = this.#noteNameList.reduce((max, cur) => cur.id > max ? cur.id : max, this.#noteNameList[0].id);
			const finalMax = dbMaxId > localMax ? dbMaxId : localMax;
			return finalMax ?? 0;
		}
		return dbMaxId ?? 0;
	}
	
	/**
	 * 데이터 불러오는 초기화함수
	 * Email에 해당하는 Notepad정보들을 모두 불러와서 private 변수에 저장.
	 * 열려있는 tab과 마지막에 바라본 tab을 private변수에 저장.
	 * @param {String} currentUserEmail 
	 */
	async initNotepad(currentUserEmail) {
		const allData = await new NotepadStorage(currentUserEmail).loadContent();
		const { endTitle, openTab } = allData.pop();
		this.#openTabs = openTab ? openTab.split(',') : [];
		this.#userEmail = currentUserEmail;
		this.#noteNameList = allData;
		this.#noteNameList.forEach((list) => list["isSaved"] = true);
		const noteId = allData.length ? this.getNoteByTitle(endTitle)?.id : null;
		this.writeSection.setIdAndName(noteId, noteId ? this.getNoteById(noteId).title : "");
	}

	/**
	 * Dropdown에 넣을 아이템초기화와 아이템이벤트를 추가해서
	 * Dropdown목록에 추가
	 * @param {String} value 
	 * @param {Number} currentId 
	 */
	setDropdownItem(textareaValue, currentId) { 
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
            text: textareaValue
        };
		// 초기화를 위한 변수 전달
		const dropdownItem = this.dropdownBar.initItem(itemInfo, linkInfo);

		// 정상적으로 초기화 했으면 초기화한 아이템에 이벤트추가하고 리스트에 추가.
		if(dropdownItem) {
			dropdownItem.addEventListener("click", (e) => this.onClickDropdown(e));
			this.dropdownBar.addItemAtList(dropdownItem);
		}
	}

	/**
	 * 드랍다운목록의 아이템을 클릭시 발동하는 이벤트.
	 * navigationBar에 없으면 추가하고 이동하기 전에 값들을 임시저장한다.
	 * 그 다음은 onClickNavigationBar기능을 수행한다.
	 * @param {Event} e 
	 */
	async onClickDropdown(e) {
		const currentId = parseInt(e.target.dataset.currentid);
		const items = document.querySelectorAll(".notelink");

		if(!this.navigationBar.isItemInList(items, currentId)) {
			this.addItemAtNavbar(e.target.innerText, currentId);
		}
		this.onClickNavigationBar(currentId);
	}

	/**
	 * 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시.
	 * 현재 가르키고 있는 note갱신
	 * @param {Number} clickedId 
	 */
	onClickNavigationBar(clickedId) {
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

		this.navigationBar.toggleItem(`noteId${clickedId}`, "a.notelink");
		const title = this.getNoteById(clickedId).title;
		this.writeSection.setIdAndName(clickedId, title);
		if(!this.#openTabs.find(element => element === title)) this.#openTabs.push(title);
		
		// 클릭한 notepad의 내용을 textarea에 로드.
		const getAfterValue = this.getNoteIndexById(clickedId);
		this.writeSection.loadValue("saveAsInput", this.#noteNameList[getAfterValue].title, this.#noteNameList[getAfterValue].content);
		this.writeSection.setMonitorLabel(this.getNoteById().isSaved);
	}

	// noteName값으로 NavigationBar에 아이템 추가
	addItemAtNavbar(value, id) {
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
		const item = this.navigationBar.initItem(itemInfo, linkInfo);
		item.addEventListener("click", (e) => this.onClickNavigationBar(parseInt(e.target.dataset.currentid))); // 클릭이벤트
		this.navigationBar.addItemAtList(item);
	}

	/**
	 * 파일 만들때 난수 생성해서 이름짓고 리스트추가
	 * id값은 현재 db에 저장되어있는 최대id값을 참고해서 생성함.(max+1)
	 */
	async onClickNewFile(e) {
		const id = await this.getMaxId() + 1;
		const random = `tmp${id}`;
		this.#noteNameList.push({
			id,
			email: this.#userEmail,
			title: random,
			content: "",
			isSaved: false,
		});
		this.addItemAtNavbar(random, id);
		this.onClickNavigationBar(id);
	}

	// textarea+Button부분을 없앤다.(display: none)
	closeNotepad() {
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.writeSection.noteId}`);
		this.writeSection.setIdAndName("","");
		note.remove();
	}

	textareaValue() {
		const textValue = document.getElementById("textareaForm");
		return {  //id 부분 다시 나중에 확인할 것 asdf 
			id: this.writeSection.noteId,
			email: this.#userEmail,
			title: this.writeSection.noteName,
			content: textValue.value,
			isSaved: true,
		};
	}

	async onClickSave(e) {
		const noteData = this.textareaValue();
		const response = await this.notepadStorage.saveContent(noteData.id, noteData.email, noteData.title, noteData.content);
		if(response.status !== 201)  {
			this.writeSection.setMonitorLabel(this.getNoteById().isSaved,`처리오류 - Response status code : ${response.status}`);
			return;
		}
		this.setDropdownItem(noteData.title, noteData.id); // dropdown목록 확인후 추가
		const indexOfItem = this.getNoteIndexById();
		if(indexOfItem !== -1) {
			this.#noteNameList[indexOfItem] = noteData;
		} else {
			this.#noteNameList.push(noteData);
			this.#openTabs.push(noteData.title);
		}
		this.writeSection.setMonitorLabel(this.getNoteById().isSaved);
	}

	async onClickSaveAs(e) {
		const noteData = this.textareaValue();
		noteData.id = await this.getMaxId() + 1;
		noteData.title = document.getElementById("saveAsInput").value;;
		const response = await this.notepadStorage.saveAsContent(noteData.email, noteData.title, noteData.content);
		if(response.status === 400)  {
			this.writeSection.setMonitorLabel(this.getNoteById().isSaved, `처리오류 - Response status code : ${response.status}`);
			return;
		}
		this.setDropdownItem(noteData.title);
		this.#noteNameList.push(noteData);
		this.addItemAtNavbar(noteData.title, noteData.id);
		this.onClickNavigationBar(noteData.id);
	}

	async onClickDelete(e) {
		const response = await this.notepadStorage.deleteContent(this.writeSection.noteId, this.#userEmail);
		if(response.status !== 201)  {
			this.writeSection.setMonitorLabel(this.getNoteById().isSaved,`처리오류 - Response status code : ${response.status}`);
			return;
		}
		this.dropdownBar.deleteDropdownItem(this.writeSection.noteId, "dropdownMenu");
		const opentabName = this.#openTabs.findIndex((element) => element === this.writeSection.noteName);
		if(opentabName !== -1) this.#openTabs.splice(opentabName, 1);
		this.#noteNameList = this.#noteNameList.filter((element) => element.title !== this.writeSection.noteId);
		this.closeNotepad();
	}

	onClickClose() {
		const opentabName = this.#openTabs.findIndex((element) => element === this.writeSection.noteName);
		this.#openTabs.splice(opentabName, 1);
		this.closeNotepad();
	}

	// 버튼을 눌렀을 때 버튼기능에 따른 textarea 처리.
	// save, saveAs, close, delete 기능
	getInitButton(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.setButton(classOfBtn);

		switch(type) { 
			// 저장할 때 이벤트. 가르키고 있는 노트를 저장한 노트의 이름으로 바꾸고 드롭다운목록에 없다면 추가해줌. 
			case "save":
				btn.addEventListener("click", (e) => this.onClickSave(e));
				break;
			// 다른이름저장할 때 이벤트. 다른이름으로 저장 칸을 내용을 토대로 저장.
			case "saveAs":
				btn.addEventListener("click", (e) => this.onClickSaveAs(e));
				break;
			// 삭제할 때 이벤트. 해당하는 데이터 삭제와 동시에 리스트와 드롭다운 목록에서 제거
			case "delete":
				btn.addEventListener("click", (e) => this.onClickDelete(e));
				break;
			// 닫을 때 이벤트
			default:
				btn.addEventListener("click", (e) => this.onClickClose());
		}
		return btn;
	}

	async saveOpenNote() {
		await this.userStorage.saveOpenNote(this.#userEmail, this.#openTabs, this.writeSection.noteName);
	}

	// 저장, 다른이름저장, 닫기 버튼 관리, 다른이름저장 input셋팅
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";

		const saveBtn = this.getInitButton("save", "btn btn-outline-primary");
		const saveAsBtn = this.getInitButton("saveAs", "btn btn-outline-primary");
		const deleteBtn = this.getInitButton("delete", "btn btn-outline-danger");
		const closeBtn = this.getInitButton("close", "btn btn-outline-danger");
		
		const saveAsInput = document.createElement("input");
		saveAsInput.type= "text";
		saveAsInput.className = "form-control";
		saveAsInput.id = "saveAsInput";
		saveAsInput.value = this.writeSection.noteId ? this.getNoteById().title : "";

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
		if(!this.writeSection.noteId) noteForm.classList.add("disNone");
		noteForm.id = "noteFormDiv";

		const noteNameIndex = this.getNoteById();
        const noteTextarea = noteNameIndex ? this.writeSection.initArea(noteNameIndex.content) : this.writeSection.initArea();
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