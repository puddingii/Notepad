import Notepad from "./notepad.js";

export class MyWindow {
	myNotepad = new Notepad();
	constructor(id) {
		this.currentUserId = id;
	}

	/**
	 * DB의 정보로 notepad들 셋팅(dropdown, navigation, button, textarea etc..)
	 */
	async initMyWindow() {
		await this.myNotepad.initNotepad(this.currentUserId);
		const lastTabId = this.myNotepad.writeSection.noteId;
		
		const mainSection = document.querySelector("section.notepad");
		this.myNotepad.combineComponents(mainSection);

		const openBtn = document.getElementById("openFile");
		openBtn.addEventListener("click", (e) => this.myNotepad.onClickNewFile(e));
		if(this.myNotepad.openTabs) {
			this.myNotepad.openTabs.forEach((tab) => { 
				const navigationItem = this.myNotepad.createNavigationItem(tab, this.myNotepad.getNoteByTitle(tab).id);
				this.myNotepad.navigationBar.addItem(navigationItem);
			});
			this.myNotepad.navigationBar.toggleItem(`noteId${lastTabId}`, "a.notelink");
		}
		if(this.myNotepad.noteNameList) {
			this.myNotepad.noteNameList.forEach((note) => {
				const dropdownItem = this.myNotepad.createDropdownItem(note.title, note.id);
				this.myNotepad.dropdownBar.addItem(dropdownItem);
			});
		}

		window.addEventListener("beforeunload", async() => {
			if(location.pathname === "/") {
				await this.myNotepad.saveOpenNote();
			}
		});
	}

	/**
	 * Logout을 눌렀을 때의 기능
	 * @param {String} btnId 
	 */
	logout(btnId) {
		const logoutBtn = document.getElementById(btnId);
		const clickLogout = () => {
			location.href = "/logout";
		}
		logoutBtn.addEventListener("click", clickLogout);
	}
}
