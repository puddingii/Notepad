import Notepad from "./notepad.js";

export class MyWindow {
	myNotepad = new Notepad();
	constructor(id) {
		this.currentUserId = id;
	}

	async initMyWindow() {
		await this.myNotepad.initNotepad(this.currentUserId);
		const lastTabId = this.myNotepad.writeSection.noteId;
		
		const mainSection = document.querySelector("section.notepad");
		this.myNotepad.combineComponents(mainSection);

		const openBtn = document.getElementById("openFile");
		openBtn.addEventListener("click", (e) => this.myNotepad.onClickNewFile(e));
		if(this.myNotepad.openTabs) {
			this.myNotepad.openTabs.forEach((tab) => { 
				this.myNotepad.addItemAtNavbar(tab, this.myNotepad.getNoteByTitle(tab).id);
			});
			this.myNotepad.navigationBar.toggleItem(`noteId${lastTabId}`, "a.notelink");
		}
		if(this.myNotepad.noteNameList) {
			this.myNotepad.noteNameList.forEach((note) => {
				this.myNotepad.setDropdownItem(note.title, note.id);
			});
		}

		window.addEventListener("beforeunload", async() => {
			if(location.pathname === "/") {
				await this.myNotepad.saveOpenNote();
			}
		});
	}

	logout(btnId) {
		const logoutBtn = document.getElementById(btnId);
		const clickLogout = () => {
			location.href = "/logout";
		}
		logoutBtn.addEventListener("click", clickLogout);
	}
}
