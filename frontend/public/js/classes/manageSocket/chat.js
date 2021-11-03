/*global io, bootstrap*/

export default class Chat {
    recordBoard = document.getElementById("chatRecordBoard");
    inputForm = document.getElementById("chatInput");
    inputButton = document.getElementById("chatInputButton");
    inputRoomName = document.getElementById("inputRoomName");
    newButton = document.getElementById("chatNewBtn");
    joinButton = document.getElementById("joinRoomButton");
    exitButton = document.getElementById("chatExitBtn");
    roomName = document.getElementById("roomName");
    /**
     * socket을 사용하기 위한 io함수 가져오기, 현재 사용중인 user의 id
     * 
     * @param {string} userId 유저아이디
     */
    constructor(userId) {
        this.#socket = io();
        this.#userId = userId;
        this.#userList = [userId];
    }
    #socket;
    #userId;
    #userList;

    /**
     * 채팅내용을 채팅방에 적어주기 위한 이벤트 설정.
     */
    initActions() {
        this.inputButton.addEventListener("click", () => this.sendClientMessage());
        this.inputForm.addEventListener("keydown", (e) => { if (e.key === "Enter") this.sendClientMessage(); });
        this.newButton.addEventListener("click", () => this.joinNewRoom());
        this.joinButton.addEventListener("click", () => this.joinRoom());
        this.exitButton.addEventListener("click", () => this.exitRoom());
        this.#socket.on("roomName", (text) => this.roomName.innerText = text);
        this.#socket.on("serverSendMessage", (chatInfo) => this.receiveClientMessage(chatInfo));
        this.#socket.on("serverSendFile", (data) => this.receiveClientFile(data));
        this.#socket.on("updateUser", (userId) => this.updateUser(userId));
        this.#socket.on("roomUserList", (list) => this.setUserList(list));
        this.#socket.on("deleteUserId", (userId) => this.deleteUserId(userId));
    }

    /**
     * userList에서 userId에 해당하는 것 삭제
     * 
     * @param {string} userId 방에서 나간 유저 아이디
     */
    deleteUserId(userId) {
        const index = this.#userList.indexOf(userId);
        if (index > -1) {
            this.#userList.splice(index, 1);
            this.setUserList();
        }
    }

    /**
     * List안의 내용물들을 html로 표시해주기 위한 변환과정
     * 
     * @param {Array} list html으로 합치기 위한 리스트목록
     * @returns {string} HTML표기법으로 합친 list값들
     */
    listToHtml(list) {
        return list.reduce((pre, cur) => `${pre}<br>${cur}`);
    }

    /**
     * 유저정보의 리스트들을 가지고 방의 참여자를 표시해주는 함수
     * 
     * @param {Array} list 유저정보를 가지고 있는 리스트 
     */
    setUserList(list = this.#userList) {
        const convertedList = this.listToHtml(list);
        this.roomName.dataset.bsContent = convertedList;
        new bootstrap.Popover(this.roomName, { html: true });
    }

    /**
     * 유저아이디를 list안에 넣어두고 유저목록을 리셋한다.
     * 
     * @param {string} userId 업데이트할 유저아이디
     */
    updateUser(userId) {
        this.#userList.push(userId);
        this.setUserList();
    }

    /**
     * 공유할 파일을 방에 있는 사람들에게 뿌려주기 위한 함수(Emit함)
     * 
     * @param {object} fileInfo title, value, userId를 담은 객체
     */
    shareFile(fileInfo) {
        this.#socket.emit("clientSendFile", fileInfo);
        const newChat = this.createItem(null, `Share file- ${fileInfo.title}.txt`);
        this.recordBoard.appendChild(newChat);
        this.autoScroll();
    }

    /**
     * 채팅방 기록을 지우는 기능
     */
    deleteRecords() {
        const records = this.recordBoard.querySelectorAll("li");
        records.forEach((record) => record.remove());
    }

    /**
     * 특정 방에 들어갔을 때의 기능으로 채팅방 기록들을 삭제한다.
     */
    joinRoom() {
        const roomName = this.inputRoomName.value;
        this.#socket.emit("joinRoom", { userId: this.#userId, roomName });
        this.deleteRecords();
        this.roomName.innerText = roomName;
    }

    /**
     * 랜덤 string을 생성해서 해당 방으로 들어간다.
     */
    joinNewRoom() {
        this.#socket.emit("joinNewRoom", this.#userId);
        this.deleteRecords();
    }

    /**
     * 현재 속해있는 방에서 나간다.
     */
    exitRoom() {
        this.#socket.emit("exitRoom");
        this.deleteRecords();
        this.#userList = [this.#userId];
        this.setUserList();
        this.roomName.innerText = "NULL";
    }

    /**
     * 유저 아이디를 부분 익명으로 변경해주는 함수
     * 
     * @param {string} userId 유저 아이디
     * @returns {string} 부분익명 유저 아이디
     */
    renameUserId(userId) {
        userId = userId.split("@")[0];
        userId = userId.length > 4 ? `*${userId.slice(-4)}` : `*${userId}`;
        return userId;
    }

    /**
     * scroll bar에서 제일 아래로 내려주는 기능
     */
    autoScroll() {
        this.recordBoard.scrollTop = this.recordBoard.scrollHeight - this.recordBoard.clientHeight;
    }

    /**
     * 클라이언트가 채팅을 하면 채팅내용을 다른 사람에게 전달하는 함수
     */
    sendClientMessage() {
        this.#socket.emit("clientMessage", this.#userId, this.inputForm.value);
        const newChat = this.createItem();
        this.recordBoard.appendChild(newChat);
        this.inputForm.value = "";
        this.inputForm.focus();
        this.autoScroll();
    }

    /**
     * 클라이언트가 채팅한 내용을 접속한 사람들에게 뿌려주는 함수
     * 
     * @param {object} chatInfo 채팅정보 
     */
    receiveClientMessage(chatInfo) {
        let { user, text } = chatInfo;
        if (user === "SYSTEM") {
            text = `${this.renameUserId(text)} entered!`;
        } else {
            user = this.renameUserId(user);
        }
        const newChat = this.createItem(user, text);
        this.recordBoard.appendChild(newChat);
        this.autoScroll();
    }

    /**
     * 브로드캐스트한 파일을 받으면 해당 파일을 보여주는 함수
     * 
     * @param {object} data title, value, userId를 담은 객체
     */
    receiveClientFile(data) {
        const { userId, textValue, title } = data;
        const blob = new Blob([textValue], { type: "text/plain;charset=utf8" });
        const blobUrl = URL.createObjectURL(blob);
        const downlaodLink = `<a href=${blobUrl} download=${title}.txt>${title}.txt</a>`;
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${title}.txt`;
        const newFile = this.createItem(this.renameUserId(userId), downlaodLink);
        this.recordBoard.appendChild(newFile);
        this.autoScroll();
    }

    /**
     * 채팅 내용과 채팅을 한 유저의 정보를 보여주기 위한 Element생성 함수
     * 
     * @param {string} userName 채팅을 친 사람
     * @param {string} text 채팅 내용
     * @returns {Element} 채팅한 내용을 담은 li Element
     */
    createItem(userName, text = this.inputForm.value) {
        const chatting = document.createElement("li");
        const user = userName ?? "You";
        const style = userName ? "'color:rgb(88, 88, 230);'" : "'color:orange;'";
        chatting.innerHTML = `<span style=${style}>${user}:</span> <span>${text}</span>`;

        return chatting;
    }
}
