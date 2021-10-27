// eslint-disable-next-line no-unused-vars
class UserData {
    /**
     * 유저db에 열려있는 노트패드들을 저장
     *
     * @param {string} email 유저의 이메일
     * @param {Array} opentab 열려있는 탭들의 제목이 담겨있는 배열
     * @param {string} lasttab 맨 마지막으로 봤던 탭의 제목
     * @returns {Promise} fetch의 결과물인 response의 status(성공여부)
     */
    async saveOpenNote(email, opentab, lasttab) {
        const response = await fetch("https://localhost:8050/api/users/saveOpenNote", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, opentab: opentab.toString(), lasttab })
        });
        return response;
    }
}