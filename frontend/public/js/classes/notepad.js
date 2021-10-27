/*global NotepadData, UserData*/
import DropdownBar from './manageList/dropdownBar.js';
import NavigationBar from "./manageList/navigationBar.js";
import NoteButton from "./manageButton/noteButton.js";
import WriteSection from "./manageWriteSection/writeSection.js";
import ManageArray from './util/manageArray.js';

export default class Notepad {
	/**
	 * DropdownBar, NavigationBar, WriteSection(Textarea) Class를 가져와 Id값으로 셋팅한다.
	 */
	constructor() {
		this.notepadData = new NotepadData();
		this.userData = new UserData();
		this.writeSection = new WriteSection("textareaForm", "textareaLabel");
		this.dropdownBar = new DropdownBar("dropdownMenu");
		this.navigationBar = new NavigationBar("navContainer");
		this.manageArray = new ManageArray();
	}
	#noteInfoList = [];
	#userEmail = '';
	#openTabs;

	get noteInfoList() {
		return this.#noteInfoList;
	}
	set noteInfoList(noteInfoList) {
		this.#noteInfoList = noteInfoList;
	}

	get openTabs() {
		return this.#openTabs;
	}

	/**
	 * DB와 LOCAL의 MAX ID값을 뽑아 비교후 더 큰값 리턴.
	 *
	 * @returns {number} 최대값
	 */
	async getMaxId() {
		const dbMaxId = await this.notepadData.getLastId();
		if (this.#noteInfoList.length) {
			const localMax = this.manageArray.getMaxId(this.#noteInfoList);
			const finalMax = Math.max(dbMaxId, localMax);
			return finalMax ?? 0;
		}
		return dbMaxId ?? 0;
	}

	/**
	 * 데이터 불러오는 초기화함수
	 * Email에 해당하는 Notepad정보들을 모두 불러와서 private 변수에 저장.
	 * 열려있는 tab과 마지막에 바라본 tab을 private변수에 저장.
	 *
	 * @param {string} currentUserEmail 로그인한 유저 이메일
	 */
	async init(currentUserEmail) {
		const allData = await this.notepadData.load(currentUserEmail);
		const { endTitle, openTab } = allData.pop();
		this.#openTabs = openTab ? openTab.split(',') : [];
		this.#userEmail = currentUserEmail;
		this.#noteInfoList = allData;
		this.#noteInfoList.forEach((list) => list["isSaved"] = true);
		const noteId = allData.length ? this.manageArray.getObjectByTitle(this.#noteInfoList, endTitle)?.id : null;
		this.writeSection.setIdAndName(noteId, noteId ? this.manageArray.getObjectById(this.#noteInfoList, noteId).title : "");
	}

	/**
	 * Dropdown에 넣을 아이템초기화와 아이템이벤트를 추가해서
	 * Dropdown목록에 추가
	 *
	 * @param {string} textareaValue Dropdown Bar안에 들어갈 요소의 제목
	 * @param {number} currentId Dropdown Bar안에 들어갈 요소의 아이디
	 * @returns {Element}li Element
	 */
	createDropdownItem(textareaValue, currentId) {
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
		const dropdownItem = this.dropdownBar.createItem(itemInfo, linkInfo);

		// 정상적으로 초기화 했으면 초기화한 아이템에 이벤트추가하고 리스트에 추가.
		if (dropdownItem) {
			dropdownItem.addEventListener("click", (e) => this.onClickDropdown(e));
		}
		return dropdownItem;
	}

	/**
	 * 드랍다운목록의 아이템을 클릭시 발동하는 이벤트.
	 * navigationBar에 없으면 추가하고 이동하기 전에 값들을 임시저장한다.
	 * 그 다음은 onClickNavigationBar기능을 수행한다.
	 *
	 * @param {Event} e Dropdown Bar에서 요소를 클릭한 이벤트
	 */
	async onClickDropdown(e) {
		const currentId = parseInt(e.target.dataset.currentid);
		const items = document.querySelectorAll(".notelink");

		if (!this.navigationBar.isItemInBar(items, currentId)) {
			const navigationItem = this.createNavigationItem(e.target.innerText, currentId);
			this.navigationBar.addItemToBar(navigationItem);
		}
		this.onClickNavigationBar(currentId);
	}

	/**
	 * 리스트에 있는 아이템 클릭시 기존에 적어둔 값 저장, 클릭한 리스트의 값 표시.
	 * 현재 가르키고 있는 note갱신
	 *
	 * @param {number} clickedId Navigation Bar에서 클릭한 요소의 아이디 값
	 */
	onClickNavigationBar(clickedId) {
		const noteFormDiv = document.getElementById("noteFormDiv");
		const textareaForm = document.getElementById(this.writeSection.textareaId);
		const getBeforeValue = this.manageArray.getIndexById(this.#noteInfoList, this.writeSection.noteId);
		noteFormDiv.classList.remove("disNone");

		// notelist에 저장한 value값과 현재 textarea에 있는 value값이 다르면
		// 저장된 상태와 변경된 값을 해당 배열에 저장.
		if (getBeforeValue !== -1) {
			if (this.#noteInfoList[getBeforeValue].content !== textareaForm.value) {
				this.#noteInfoList[getBeforeValue].isSaved = false;
			}
			this.#noteInfoList[getBeforeValue].content = textareaForm.value;
		}

		// 클릭한 곳을 보여주기 위한 작업
		this.navigationBar.toggleItem(`noteId${clickedId}`, "a.notelink");
		const title = this.manageArray.getObjectById(this.#noteInfoList, clickedId).title;
		this.writeSection.setIdAndName(clickedId, title);
		if (!this.manageArray.getElement(this.#openTabs, title)) this.#openTabs.push(title);

		// 클릭한 notepad의 내용을 textarea에 로드.
		const getAfterValue = this.manageArray.getIndexById(this.#noteInfoList, clickedId);
		this.writeSection.setWriteSectionValue("saveAsInput", this.#noteInfoList[getAfterValue].title, this.#noteInfoList[getAfterValue].content);
		const targetObject = this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId);
		this.writeSection.setMonitorLabel(targetObject.isSaved);
	}

	/**
	 * noteName값으로 NavigationBar에 아이템 추가
	 *
	 * @param {string} textareaValue Navigation Bar안에 들어갈 요소의 제목
	 * @param {number} currentId Navigation Bar안에 들어갈 요소의 아이디
	 * @returns {Element}li Element 
	 */
	createNavigationItem(textareaValue, currentId) {
		if (!textareaValue) return;
		const itemInfo = {
			className: "nav-item notetab",
			id: `noteList${currentId}`,
			dataset: {
				key: "",
				value: "",
			},
		};
		const linkInfo = {
			className: "nav-link notelink",
			id: `noteId${currentId}`,
			dataset: {
				key: "currentid",
				value: currentId
			},
			href: "#",
			text: textareaValue
		};
		const item = this.navigationBar.createItem(itemInfo, linkInfo);
		item.addEventListener("click", (e) => this.onClickNavigationBar(parseInt(e.target.dataset.currentid))); // 클릭이벤트
		return item;
	}

	/**
	 * 파일 만들때 난수 생성해서 이름짓고 리스트추가
	 * id값은 현재 db에 저장되어있는 최대id값을 참고해서 생성함.(max+1)
	 */
	async onClickNewFile() {
		const id = await this.getMaxId() + 1;
		const random = `tmp${id}`;
		this.#noteInfoList.push({
			id,
			email: this.#userEmail,
			title: random,
			content: "",
			isSaved: false,
		});
		const navigationItem = this.createNavigationItem(random, id);
		this.navigationBar.addItemToBar(navigationItem);
		this.onClickNavigationBar(id);
	}

	/**
	 * writeSection+Buttons부분을 숨기고 가르키는 id와 name을 리셋한다.
	 */
	closeNotepad() {
		const noteFormDiv = document.getElementById("noteFormDiv");
		noteFormDiv.classList.add("disNone");

		const note = document.getElementById(`noteList${this.writeSection.noteId}`);
		this.writeSection.setIdAndName("", "");
		note.remove();
	}

	/**
	 * DB에 있는 Notepad 테이블의 구조와 같음.
	 * 
	 * @returns {object} 현재 사용중인 Notepad정보 반환
	 */
	getCurrentInfo() {
		const textValue = document.getElementById(this.writeSection.textareaId);
		return {
			id: this.writeSection.noteId,
			email: this.#userEmail,
			title: this.writeSection.noteName,
			content: textValue.value,
			isSaved: true,
		};
	}

	/**
	 * 저장할 때 이벤트. 가르키고 있는 노트를 저장한 노트의 이름으로 바꾸고 드롭다운목록에 없다면 추가해줌. 
	 */
	async onClickSave() {
		const noteData = this.getCurrentInfo();
		const response = await this.notepadData.save(noteData.id, noteData.email, noteData.title, noteData.content);
		if (response.status !== 201) {
			const targetData = this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId);
			this.writeSection.setMonitorLabel(targetData.isSaved, `처리오류 - Response status code : ${response.status}`);
			return;
		}
		const dropdownItem = this.createDropdownItem(noteData.title, noteData.id);
		if (dropdownItem) this.dropdownBar.addItemToBar(dropdownItem);

		// Save를 하면 class안의 private 변수안에도 있다는 뜻이므로 확인하는 절차
		const indexOfItem = this.manageArray.getIndexById(this.#noteInfoList, this.writeSection.noteId);
		if (indexOfItem !== -1) { // 있다면 갱신해준다.
			this.#noteInfoList[indexOfItem] = noteData;
		} else { // NewFile -> SAVE시 변수안에 없기 때문에 push 해준다.
			this.#noteInfoList.push(noteData);
			this.#openTabs.push(noteData.title);
		}
		const targetObject = this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId);
		this.writeSection.setMonitorLabel(targetObject.isSaved);
	}

	/**
	 * 다른이름저장할 때 이벤트. 다른이름으로 저장 칸을 내용을 토대로 저장.
	 * 
	 * @returns {undefined} 
	 */
	async onClickSaveAs() {
		const noteData = this.getCurrentInfo();
		noteData.id = await this.getMaxId() + 1;
		noteData.title = document.getElementById("saveAsInput").value;

		const response = await this.notepadData.saveAs(noteData.email, noteData.title, noteData.content);
		if (response.status === 400) {
			const targetData = this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId);
			this.writeSection.setMonitorLabel(targetData.isSaved, `처리오류 - Response status code : ${response.status}`);
			return;
		}
		const dropdownItem = this.createDropdownItem(noteData.title);
		this.dropdownBar.addItemToBar(dropdownItem);
		this.#noteInfoList.push(noteData);

		const navigationItem = this.createNavigationItem(noteData.title, noteData.id);
		this.navigationBar.addItemToBar(navigationItem);
		this.onClickNavigationBar(noteData.id);
	}

	/**
	 * 삭제할 때 이벤트. 해당하는 데이터 삭제와 동시에 리스트와 드롭다운 목록에서 제거. openTab에서 해당 요소 삭제.
	 * 
	 * @returns {undefined} 
	 */
	async onClickDelete() {
		const response = await this.notepadData.delete(this.writeSection.noteId, this.#userEmail);
		if (response.status !== 201) {
			const targetData = this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId);
			this.writeSection.setMonitorLabel(targetData.isSaved, `처리오류 - Response status code : ${response.status}`);
			return;
		}
		this.dropdownBar.deleteItem(this.writeSection.noteId, "dropdownMenu");
		const opentabName = this.manageArray.getIndex(this.#openTabs, this.writeSection.noteName);
		if (opentabName !== -1) this.#openTabs.splice(opentabName, 1);
		this.#noteInfoList = this.#noteInfoList.filter((element) => element.title !== this.writeSection.noteId);
		this.closeNotepad();
	}

	/**
	 * 닫을 때 이벤트로 openTab에서 해당 요소를 지워주고 writeSection쪽을 안보이게 설정한다.
	 */
	onClickClose() {
		const opentabName = this.manageArray.getIndex(this.#openTabs, this.writeSection.noteName);
		this.#openTabs.splice(opentabName, 1);
		this.closeNotepad();
	}

	/**
	 * 버튼을 눌렀을 때 버튼기능에 따른 Event부여(저장, 다른이름으로 저장, 삭제, 닫기)
	 * 
	 * @param {string} type Button type(ex: save, saveAs, close etc...)
	 * @param {string} classOfBtn class name of button
	 * @returns {Element} Button Element 반환
	 */
	createButton(type, classOfBtn) {
		const buttonController = new NoteButton(type);
		const btn = buttonController.create(classOfBtn);

		switch (type) {
			case "save":
				btn.addEventListener("click", (e) => this.onClickSave(e));
				break;
			case "saveAs":
				btn.addEventListener("click", (e) => this.onClickSaveAs(e));
				break;
			case "delete":
				btn.addEventListener("click", (e) => this.onClickDelete(e));
				break;
			default:
				btn.addEventListener("click", () => this.onClickClose());
		}
		return btn;
	}

	/**
	 * 창을 닫거나 주소를 이동하기전에 열어놨던 탭과 마지막에 봤던 탭을 저장할 때 사용
	 */
	async saveOpenNote() {
		await this.userData.saveOpenNote(this.#userEmail, this.#openTabs, this.writeSection.noteName);
	}

	/**
	 * Button들에 대한 셋팅. 저장, 다른이름으로 저장, 닫기, 삭제 버튼, 다른이름으로 저장 Input값 정의
	 *
	 * @returns {Element} Button들을 담은 Div Element
	 */
	setButtonGroup() {
		const btnGroup = document.createElement("div");
		btnGroup.id = "btnGroup";

		const saveBtn = this.createButton("save", "btn btn-outline-primary");
		const saveAsBtn = this.createButton("saveAs", "btn btn-outline-primary");
		const deleteBtn = this.createButton("delete", "btn btn-outline-danger");
		const closeBtn = this.createButton("close", "btn btn-outline-danger");

		const saveAsInput = document.createElement("input");
		saveAsInput.type = "text";
		saveAsInput.className = "form-control";
		saveAsInput.id = "saveAsInput";
		saveAsInput.value = this.writeSection.noteId ? this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId).title : "";

		btnGroup.appendChild(saveBtn);
		btnGroup.appendChild(saveAsBtn);
		btnGroup.appendChild(deleteBtn);
		btnGroup.appendChild(closeBtn);
		btnGroup.appendChild(saveAsInput);

		return btnGroup;
	}

	/**
	 * mainSection Element를 가져와서 해당 Element안에 Button, Textarea, Div등의 요소들을 배치한다.
	 *
	 * @param {Element} mainSection Notepad들의 정보들을 붙여줄 Element
	 */
	combineComponents(mainSection) {
		const noteForm = document.createElement("div");
		noteForm.className = "form-floating";
		if (!this.writeSection.noteId) noteForm.classList.add("disNone");
		noteForm.id = "noteFormDiv";

		const noteNameIndex = this.manageArray.getObjectById(this.#noteInfoList, this.writeSection.noteId);
		const noteTextarea = noteNameIndex ? this.writeSection.createTextarea(noteNameIndex.content) : this.writeSection.createTextarea();
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