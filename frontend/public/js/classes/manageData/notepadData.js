// eslint-disable-next-line no-unused-vars
class NotepadData {
	/**
	 * email에 해당하는 Notepad정보를 가져온다
	 *
	 * @param {string} email User의 email
	 * @returns {JSON} JSON type (Notepad 정보들)
	 */
	async load(email) {
		const response = await fetch("https://localhost:8050/api/notepad/loadAllData", {
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
	 * @returns {number} Notepad의 Max number
	 */
	async getLastId() {
		const response = await fetch("https://localhost:8050/api/notepad/getLastId", {
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
	 * @param {number} noteId 삭제할 Notepad 아이디
	 * @param {string} email 삭제할 Notepad의 유저 이메일
	 * @returns {Promise} fetch의 결과물인 response의 status(성공여부)
	 */
	async delete(noteId, email) {
		const response = await fetch("https://localhost:8050/api/notepad/delete", {
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
	 * @param {number} id 저장할 Notepad의 아이디
	 * @param {string} email 저장할 Notepad의 유저 이메일
	 * @param {string} title 저장할 Notepad의 제목
	 * @param {string} text 저장할 Notepad의 내용
	 * @returns {Promise} fetch의 결과물인 response의 status(성공여부)
	 */
	async save(id, email, title, text) {
		const response = await fetch("https://localhost:8050/api/notepad/save", {
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
	 * @param {string} email 다른이름으로 저장할 Notepad의 유저 이메일
	 * @param {string} title 다른이름으로 저장할 Notepad의 제목
	 * @param {string} text 다른이름으로 저장할 Notepad의 내용
	 * @returns {Promise} fetch의 결과물인 response의 status(성공여부)
	 */
	async saveAs(email, title, text) {
		const response = await fetch("https://localhost:8050/api/notepad/saveAs", {
			method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email, title, text })
		});
		return response;
	}
}