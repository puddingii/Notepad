import Notepad from "./notepad.js";
import ManageArray from "./util/manageArray.js";

export class MyWindow {
	myNotepad = new Notepad();
	constructor(id) {
		this.currentUserId = id;
	}

	/**
	 * DB의 정보로 notepad들 셋팅(dropdown, navigation, button, textarea etc..)
	 */
	async init() {
		await this.myNotepad.init(this.currentUserId);
		const lastTabId = this.myNotepad.writeSection.noteId;

		const mainSection = document.querySelector("section.notepad");
		this.myNotepad.combineComponents(mainSection);

		const openBtn = document.getElementById("openFile");
		openBtn.addEventListener("click", (e) => this.myNotepad.onClickNewFile(e));
		if (this.myNotepad.openTabs) {
			this.myNotepad.openTabs.forEach((tab) => {
				const navigationItem = this.myNotepad.createNavigationItem(tab, new ManageArray().getObjectByTitle(this.myNotepad.noteInfoList, tab).id);
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

		window.addEventListener("beforeunload", async () => {
			if (location.pathname === "/") {
				await this.myNotepad.saveOpenNote();
			}
		});
		const copyRoomName = document.getElementById("roomName");
		copyRoomName.addEventListener("click", async () => await navigator.clipboard.writeText(copyRoomName.innerText));
	}

	/**
	 * Logout을 눌렀을 때의 기능
	 *
	 * @param {string} btnId button ID
	 */
	logout(btnId) {
		const logoutBtn = document.getElementById(btnId);
		const clickLogout = () => {
			location.href = "/logout";
		};
		logoutBtn.addEventListener("click", clickLogout);
	}
}
