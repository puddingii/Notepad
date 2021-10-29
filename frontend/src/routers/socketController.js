export default class SocketController {
    constructor(io, socket) {
        this.#io = io;
        this.#socket = socket;
    }
    #io;
    #socket;
    #currentRoom;

    init() {
        this.#socket.on("clientMessage", (user, text) => this.sendBroadcastMessage(user, text));
        this.#socket.on("joinNewRoom", (userId) => this.joinNewRoom(userId));
        this.#socket.on("joinRoom", (data) => this.join(data.userId, data.name));
    }

    leave() {
        this.#socket.leave(this.#currentRoom);
    }

    join(userId, roomName) {
        if (this.#currentRoom) this.leave();
        this.#currentRoom = roomName;
        this.#socket.join(roomName);
        this.sendBroadcastMessage("SYSTEM", userId);
    }

    joinNewRoom(userId) {
        const randomString = Math.random().toString(36);
        this.join(userId, randomString);
        this.sendRoomName(randomString);
    }

    sendRoomName(text) {
        this.#socket.emit("roomName", text);
    }

    sendBroadcastMessage(user, text) {
        this.#socket.broadcast.to(this.#currentRoom).emit("serverMessage", { user, text });
    }

}
