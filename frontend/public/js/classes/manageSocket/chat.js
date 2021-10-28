/*global io*/

export default class Chat {
    recordBoard = document.getElementById("chatRecordBoard");
    inputForm = document.getElementById("chatInput");
    inputButton = document.getElementById("chatInputButton");
    constructor(userId) {
        this.#socket = io();
        this.#userId = userId;
    }
    #socket;
    #userId;

    initActions() {
        this.inputButton.addEventListener("click", () => this.clientWrite());
        this.serverWrite();
        this.#socket.emit("clientHello", "clientHello11");
    }

    clientWrite() {
        this.#socket.emit("clientWrite", this.#userId, this.inputForm.value);
        const newChat = this.createItem();
        this.recordBoard.appendChild(newChat);
        this.inputForm.value = "";
    }

    serverWrite() {
        this.#socket.on("serverWrite", (chatInfo) => {
            const { user, text } = chatInfo;
            const newChat = this.createItem(user, text);
            this.recordBoard.appendChild(newChat);
        });
    }

    createItem(userName, text = this.inputForm.value) {
        const chatting = document.createElement("li");
        const user = userName ?? "You";
        const style = userName ? "" : "'color:orange;'";
        chatting.innerHTML = `<span style=${style}>${user}:</span> <span>${text}</span>`;

        return chatting;
    }
}
