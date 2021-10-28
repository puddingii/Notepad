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

    renameUserId(userId) {
        userId = userId.split("@")[0];
        userId = userId.length > 3 ? `*${userId.slice(-3)}` : `*${userId}`;
        return userId;
    }

    autoScroll() {
        this.recordBoard.scrollTop = this.recordBoard.scrollHeight - this.recordBoard.clientHeight;
    }

    clientWrite() {
        this.#socket.emit("clientWrite", this.#userId, this.inputForm.value);
        const newChat = this.createItem();
        this.recordBoard.appendChild(newChat);
        this.inputForm.value = "";
        this.autoScroll();
    }

    serverWrite() {
        this.#socket.on("serverWrite", (chatInfo) => {
            let { user, text } = chatInfo;
            const renamedId = this.renameUserId(user);
            const newChat = this.createItem(renamedId, text);
            this.recordBoard.appendChild(newChat);
            this.autoScroll();
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
