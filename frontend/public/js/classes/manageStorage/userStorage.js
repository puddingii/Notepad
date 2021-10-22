class UserStorage {
    /**
     * 유저db에 열려있는 노트패드들을 저장
     * @param {String} email 
     * @param {Array} opentab 
     * @param {String} lasttab 
     * @returns Promise (성공여부)
     */
    async saveOpenNote(email, opentab, lasttab) {
        const response = await fetch("http://localhost:8000/api/users/saveOpenNote", {
            method: "post",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ email, opentab: opentab.toString(), lasttab })
        });
        return response;
    }
}