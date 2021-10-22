class NotepadStorage {
	/**
	 * email에 해당하는 Notepad정보를 가져온다
	 *
	 * @param email
	 * @returns JSON type (Notepad 정보들)
	 */
	async load(email) {
		const response = await fetch("http://localhost:8000/api/notepad/loadAllData", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email })
		});
		const storage = await response.json();
		return storage;
	}

	/**
	 * 저장된 Notepad의 가장 큰 id값 반환
	 *
	 * @returns Number (Notepad의 Max number)
	 */
	async getLastId() {
		const response = await fetch("http://localhost:8000/api/notepad/getLastId", {
			headers: {
				"Content-type": "application/json"
			}
		});
		const storage = await response.json();
		return storage.id;
	}

	/**
	 * 유저의 특정 Notepad정보 삭제
	 *
	 * @param {number} noteId 
	 * @param {string} email 
	 * @returns Promise (성공여부)
	 */
	async delete(noteId, email) {
		const response = await fetch("http://localhost:8000/api/notepad/delete", {
			method: "delete",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ noteId, email })
		});
		return response;
	}

	/**
	 * 유저의 특정 Notepad정보 저장
	 *
	 * @param {number} id 
	 * @param {string} email 
	 * @param {string} title 
	 * @param {string} text 
	 * @returns Promise (성공여부)
	 */
	async save(id, email, title, text) {
		const response = await fetch("http://localhost:8000/api/notepad/save", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ id, email, title, text })
		});
		return response;
	}

	/**
	 * 유저의 특정 Notepad정보 다른이름으로 저장
	 *
	 * @param {string} email 
	 * @param {string} title 
	 * @param {string} text 
	 * @returns Promise (성공여부)
	 */
	async saveAs(email, title, text) {
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