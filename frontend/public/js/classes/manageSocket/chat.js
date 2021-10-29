/*global io*/

export default class Chat {
    recordBoard = document.getElementById("chatRecordBoard");
    inputForm = document.getElementById("chatInput");
    inputButton = document.getElementById("chatInputButton");
    newButton = document.getElementById("chatNewBtn");
    joinButton = document.getElementById("chatJoinBtn");
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
    }
    #socket;
    #userId;

    /**
     * 채팅내용을 채팅방에 적어주기 위한 이벤트 설정.
     */
    initActions() {
        this.inputButton.addEventListener("click", () => this.sendClientMessage());
        this.newButton.addEventListener("click", () => this.joinNewRoom());
        this.receiveClientMessage();
        this.serverEnterRoom();
    }

    joinNewRoom() {
        this.#socket.emit("joinNewRoom", this.#userId);
        const records = this.recordBoard.querySelectorAll("li");
        records.forEach((record) => record.remove());
        this.#socket.on("roomName", (text) => this.roomName.innerText = text);
    }

    /**
     * 유저 아이디를 부분 익명으로 변경해주는 함수
     * 
     * @param {string} userId 유저 아이디
     * @returns {string} 부분익명 유저 아이디
     */
    renameUserId(userId) {
        userId = userId.split("@")[0];
        userId = userId.length > 3 ? `*${userId.slice(-3)}` : `*${userId}`;
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
        this.autoScroll();
    }

    /**
     * 클라이언트가 채팅한 내용을 접속한 사람들에게 뿌려주는 함수
     */
    receiveClientMessage() {
        this.#socket.on("serverMessage", (chatInfo) => {
            let { user, text } = chatInfo;
            if (user === "SYSTEM") {
                text = `${this.renameUserId(text)} entered!`;
            } else {
                user = this.renameUserId(user);
            }
            const newChat = this.createItem(user, text);
            this.recordBoard.appendChild(newChat);
            this.autoScroll();
        });
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
        const style = userName ? "" : "'color:orange;'";
        chatting.innerHTML = `<span style=${style}>${user}:</span> <span>${text}</span>`;

        return chatting;
    }

    serverEnterRoom() {
        this.#socket.on("enterRoom", () => {
            console.log("Someone enters this room.");
        });
    }
}
