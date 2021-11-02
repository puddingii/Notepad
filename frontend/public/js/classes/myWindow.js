import Chat from "./manageSocket/chat.js";
import Notepad from "./notepad.js";
import ManageArray from "./util/manageArray.js";

export class MyWindow {
	myNotepad;
	myChat;
	manageArray = new ManageArray();
	constructor(id) {
		this.currentUserId = id;
		this.myNotepad = new Notepad();
		this.myChat = new Chat(this.currentUserId);
	}

	/**
	 * DB의 정보로 notepad들 셋팅(dropdown, navigation, button, textarea etc..)
	 */
	async initNotepad() {
		await this.myNotepad.init(this.currentUserId);
		const lastTabId = this.myNotepad.writeSection.noteId;

		const mainSection = document.querySelector("section.notepad");
		this.myNotepad.combineComponents(mainSection);

		if (this.myNotepad.openTabs) {
			this.myNotepad.openTabs.forEach((tabName) => {
				const tabId = this.manageArray.getObjectByTitle(this.myNotepad.noteInfoList, tabName).id;
				const navigationItem = this.myNotepad.createNavigationItem(tabName, tabId);
				this.myNotepad.navigationBar.addItemToBar(navigationItem);
			});
			this.myNotepad.navigationBar.toggleItem(`noteId${lastTabId}`, "a.notelink");
		}
		if (this.myNotepad.noteInfoList) {
			this.myNotepad.noteInfoList.forEach((note) => {
				const dropdownItem = this.myNotepad.createDropdownItem(note.title, note.id);
				this.myNotepad.dropdownBar.addItemToBar(dropdownItem);
			});
		}

		const openBtn = document.getElementById("newButton");
		openBtn.addEventListener("click", () => this.myNotepad.onClickNewFile());

		window.addEventListener("beforeunload", async () => {
			if (location.pathname === "/") {
				await this.myNotepad.saveOpenNote();
			}
		});
	}

	/**
	 * 채팅방 셋팅
	 */
	initChat() {
		this.myChat.initActions();
		const copyRoomName = document.getElementById("roomName");
		copyRoomName.addEventListener("click", async () => await navigator.clipboard.writeText(copyRoomName.innerText));
	}

	/**
	 * 노트패드에 적은 내용을 txt파일로 공유하는 버튼
	 */
	setShare() {
		const shareBtn = document.getElementById("shareButton");
		shareBtn.addEventListener("click", () => this.sendFile(this.myNotepad.writeSection.noteName));
	}

	sendFile(title) {
		const noteInfo = this.manageArray.getObjectByTitle(this.myNotepad.noteInfoList, title);
		const fileInfo = {
			userId: this.currentUserId,
			textValue: noteInfo.content,
			title
		};
		this.myChat.shareFile(fileInfo);
	}

	/**
	 * Logout을 눌렀을 때의 기능
	 *
	 * @param {string} btnId button ID
	 */
	setLogout(btnId) {
		const logoutBtn = document.getElementById(btnId);
		const clickLogout = () => {
			location.href = "/logout";
		};
		logoutBtn.addEventListener("click", clickLogout);
	}
}
