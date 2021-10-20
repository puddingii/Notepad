class NotepadStorage {
	constructor(id) {
		this.currentUserId = id;
	}
	async loadContent() {
		const response = await fetch(`http://localhost:8000/api/notepad/loadAllData?email=${this.currentUserId}`, {
		});
		const storage = await response.json();
		return storage;
	}

	async notepadLastId() {
		const response = await fetch("http://localhost:8000/api/notepad/getLastId", {
			headers: {
				"Content-type": "application/json"
			}
		});
		const storage = await response.json();
		return storage.id;
	}

	async deleteContent(noteId, email) {
		const response = await fetch("http://localhost:8000/api/notepad/delete", {
			method: "delete",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ noteId, email })
		});
		return response;
	}

	async saveContent(id, email, title, text) {
		const response = await fetch("http://localhost:8000/api/notepad/save", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ id, email, title, text })
		});
		return response;
	}

	async saveAsContent( email, title, text) {
		const response = await fetch("http://localhost:8000/api/notepad/saveAs", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email, title, text })
		});
		return response;
	}
}